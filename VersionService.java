package com.samsung.efota.zeus.core.service.admin;

import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.dao.*;
import com.samsung.efota.zeus.core.database.zeus.ZeusDatabaseConfig;
import com.samsung.efota.zeus.core.database.zeus.vo.*;
import com.samsung.efota.zeus.core.minio.MinioInterface;
import com.samsung.efota.zeus.core.serviceHistory.ActivityHistoryInserter;
import com.samsung.efota.zeus.core.serviceHistory.ZeusHistoryConstants;
import com.samsung.efota.zeus.core.util.DateStringConvertUtil;
import com.samsung.efota.zeus.core.vo.httpbody.common.*;
import com.samsung.efota.zeus.core.vo.httpbody.request.FirmwareUpdateRequestBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.GenerateSignedUrlResponseBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.ModelSalesCodesResponseBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.ScenarioListResponseBodyVO;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.lang.invoke.MethodHandles;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

import static com.samsung.efota.zeus.core.database.zeus.ZeusDBColumnValueConstants.DEVICE_MODEL_NOT_SYNCED;

@Service
public class VersionService {
    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Autowired WorkspaceDAO workspaceDAO;

    @Autowired DeviceDAO deviceDAO;

    @Autowired FirmwareDAO firmwareDAO;

    @Autowired ScenarioListDAO scenarioListDAO;

    @Autowired MinioInterface minioInterface;

    @Autowired UpdateStatusHelper updateStatusHelper;

    @Autowired
    ActivityHistoryInserter activityHistoryInserter;

    @Autowired
    FirmwareService firmwareService;

    @Autowired
    CampaignService campaignService;

    @Autowired
    CampaignTargetFirmwareDAO campaignTargetFirmwareDAO;

    @Autowired
    CampaignDAO campaignDAO;

    public static String makeObjectPath(String model, String salesCode, String fileName) {
        return model + "/" + salesCode + "/" + fileName + ".bin";
    }

    public ScenarioListResponseBodyVO getScenarioList(String domainId, String userId) {
        List<ScenarioInfoDVO> scenarioInfoDVOs = scenarioListDAO.selectScenarioList(domainId);

        List<ScenarioVO> scenarioList = new LinkedList<>();

        Map<Pair<String, String>, List<FileMetaVO>> scenarioMap = new HashMap<>();

        for (ScenarioInfoDVO scenarioInfoDVO : scenarioInfoDVOs) {
            Pair<String, String> key =
                    new ImmutablePair<>(scenarioInfoDVO.getModel(), scenarioInfoDVO.getSalesCode());
            List<FileMetaVO> scenarioInfoList = scenarioMap.get(key);
            if (scenarioInfoList == null) {
                scenarioInfoList = new LinkedList<>();
                scenarioMap.put(key, scenarioInfoList);
            }

            FileMetaVO fileMetaVO =
                    new FileMetaVO.Builder()
                            .setScenarioId(scenarioInfoDVO.getScenarioId())
                            .setFileName(scenarioInfoDVO.getFileName())
                            .setSize(scenarioInfoDVO.getSize())
                            .setMd5(scenarioInfoDVO.getMd5())
                            .build();
            scenarioInfoList.add(fileMetaVO);
        }

        for (Map.Entry<Pair<String, String>, List<FileMetaVO>> each : scenarioMap.entrySet()) {
            ScenarioVO scenarioVO =
                    new ScenarioVO.Builder()
                            .setModel(each.getKey().getLeft())
                            .setSalesCode(each.getKey().getRight())
                            .setFileMetas(each.getValue())
                            .build();
            scenarioList.add(scenarioVO);
        }

        Set<ScenarioListResponseBodyVO.DeviceVersionInfo> deviceVersionInfoSet =
                new LinkedHashSet<>();
        List<WorkspaceDVO> workspaceDVOS = workspaceDAO.listWorkspaces(domainId);
        for (WorkspaceDVO workspaceDVO : workspaceDVOS) {
            List<DeviceDVO> deviceDVOS = deviceDAO.listDevicesByWorkspaceId(workspaceDVO.getWorkspaceId());
            for (DeviceDVO deviceDVO : deviceDVOS) {
                if (!DEVICE_MODEL_NOT_SYNCED.equals(deviceDVO.getModel())) {
                    deviceVersionInfoSet.add(
                            new ScenarioListResponseBodyVO.DeviceVersionInfo()
                                    .setModel(deviceDVO.getModel())
                                    .setSalesCode(deviceDVO.getSalesCode())
                                    .setCurrentVersion(deviceDVO.getFirmwareVersion()));
                }
            }
        }
        List<ScenarioListResponseBodyVO.DeviceVersionInfo> deviceVersionInfoList =
                new ArrayList<>();
        deviceVersionInfoList.addAll(deviceVersionInfoSet);

        ScenarioListResponseBodyVO response =
                (ScenarioListResponseBodyVO)
                        new ScenarioListResponseBodyVO()
                                .setExportedTime(
                                        DateStringConvertUtil.toFormattedString(
                                                System.currentTimeMillis()))
                                .setVersion(ZeusDatabaseConfig.dbVersion)
                                .setDeviceVersions(deviceVersionInfoList)
                                .setScenarios(scenarioList);

        return response;
    }

    public GenerateSignedUrlResponseBodyVO generateSignedUrls(ScenarioListVO scenarioList)
            throws ZeusException {

        List<UrlVO> urlList = new LinkedList<>();
        Map<Pair<String, String>, List<SignedUrlVO>> signedUrlList = new HashMap<>();

        for (ScenarioVO scenario : scenarioList.getScenarios()) {
            String model = scenario.getModel();
            String salesCode = scenario.getSalesCode();
            for (FileMetaVO fileMete : scenario.getFileMetas()) {
                String fileName = fileMete.getFileName();

                String object = makeObjectPath(model, salesCode, fileName);

                // Skip generating Signed Url if files already exist
                if (minioInterface.isFirmwareExistedInMinio(object, fileMete.getMd5())) {
                    LOGGER.info("binary already exist. This binary is skipped : {}", object);
                    continue;
                }

                String url = minioInterface.generatePresignedFirmwareUploadUrl(object);

                SignedUrlVO signedUrlVO =
                        new SignedUrlVO.Builder().setUrl(url).setFileName(fileName).build();

                Pair<String, String> key = new ImmutablePair<>(model, salesCode);
                List<SignedUrlVO> signedUrlVOs = signedUrlList.get(key);
                if (signedUrlVOs == null) {
                    signedUrlVOs = new LinkedList<>();
                    signedUrlList.put(key, signedUrlVOs);
                }
                signedUrlVOs.add(signedUrlVO);
            }
        }

        for (Map.Entry<Pair<String, String>, List<SignedUrlVO>> each : signedUrlList.entrySet()) {
            UrlVO urlVO =
                    new UrlVO.Builder()
                            .setModel(each.getKey().getLeft())
                            .setSalesCode(each.getKey().getRight())
                            .setSignedUrls(each.getValue())
                            .build();
            urlList.add(urlVO);
        }
        GenerateSignedUrlResponseBodyVO response =
                new GenerateSignedUrlResponseBodyVO().setUrlList(urlList);
        LOGGER.info("SignedURL : {} ", response.toString());
        return response;
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public Map uploadFirmwareMeta(
            String domainId, String userId, FirmwareUpdateRequestBodyVO firmwareUpdateRequestBodyVO)
            throws ZeusException {

        List<FirmwareScenarioVO> firmwareScenarioVOs =
                firmwareUpdateRequestBodyVO.getFirmwareScenarios();
        List<FirmwareDescriptionVO> firmwareDescriptionVOs =
                firmwareUpdateRequestBodyVO.getFirmwareDescriptions();
        List<FirmwareVersionVO> firmwareDataVOs = firmwareUpdateRequestBodyVO.getFirmwareVersions();

        // 1. match DB data and minIO binaries
        for (FirmwareScenarioVO firmwareScenarioVO : firmwareScenarioVOs) {
            String model = firmwareScenarioVO.getModel();
            String salesCode = firmwareScenarioVO.getSalesCode();
            String fileName = firmwareScenarioVO.getFileName();
            Long size = firmwareScenarioVO.getSize();

            String object = makeObjectPath(model, salesCode, fileName);

            long objSize = minioInterface.getObjectSize(object);
            if (size != objSize) {
                LOGGER.error("size is mismatched: "+ size + "," + objSize) ;
                throw new ZeusException(ZeusResultCode.WRONG_FIRMWARE_VERSION);
            }
        }

        List<FirmwareScenarioDVO> firmwareScenarioDVOs = new LinkedList<>();
        for (FirmwareScenarioVO each : firmwareScenarioVOs) {
            FirmwareScenarioDVO firmwareScenarioDVO = new FirmwareScenarioDVO();
            firmwareScenarioDVO.setFirmwareScenarioId(each.getFirmwareScenarioId());
            firmwareScenarioDVO.setFrom(each.getFrom());
            firmwareScenarioDVO.setTo(each.getTo());
            firmwareScenarioDVO.setModel(each.getModel());
            firmwareScenarioDVO.setSalesCode(each.getSalesCode());
            firmwareScenarioDVO.setCdnCode(each.getCdnCode());

            firmwareScenarioDVO.setDummy(each.getDummy());
            firmwareScenarioDVO.setSize(each.getSize());
            firmwareScenarioDVO.setMd5Checksum(each.getMd5Checksum());
            firmwareScenarioDVO.setFileName(each.getFileName());
            firmwareScenarioDVO.setDeleted(each.getDeleted());
            if (each.getServiceOpenedAt() != null) {
                firmwareScenarioDVO.setServiceOpenedTimestamp(
                        new Timestamp(each.getServiceOpenedAt()));
            }
            firmwareScenarioDVOs.add(firmwareScenarioDVO);
        }

        List<FirmwareDescriptionDVO> firmwareDescriptionDVOs = new LinkedList<>();
        for (FirmwareDescriptionVO each : firmwareDescriptionVOs) {
            FirmwareDescriptionDVO firmwareDescriptionDVO = new FirmwareDescriptionDVO();
            firmwareDescriptionDVO.setFirmwareId(each.getFirmwareId());
            firmwareDescriptionDVO.setLanguageCode(each.getLanguageCode());
            firmwareDescriptionDVO.setDescription(each.getDescription());
            firmwareDescriptionDVO.setModel(each.getModel());
            firmwareDescriptionDVO.setSalesCode(each.getSalesCode());

            firmwareDescriptionDVOs.add(firmwareDescriptionDVO);
        }

        List<FirmwareDVO> firmwareDVOs = new LinkedList<>();
        for (FirmwareVersionVO each : firmwareDataVOs) {
            FirmwareDVO firmwareDVO = new FirmwareDVO();
            firmwareDVO.setFirmwareId(each.getFirmwareId());
            firmwareDVO.setFirmwareVersion(each.getFirmwareVersion());
            firmwareDVO.setModel(each.getModel());
            firmwareDVO.setSalesCode(each.getSalesCode());
            firmwareDVO.setOsVersion(each.getOsVersion());
            firmwareDVO.setPlatform(each.getPlatform());
            firmwareDVO.setSecurityPatchVersion(each.getSecurityVersion());
            firmwareDVO.setBuildTypeCode(each.getBuildTypeCode());
            firmwareDVO.setDummyTypeCode(each.getDummyTypeCode());
            firmwareDVO.setDeleted(each.getDeleted());
            firmwareDVO.setOpenOrder(each.getOpenOrder());
            firmwareDVO.setIsDummyOf(each.getIsDummyOf());
            firmwareDVO.setBranchCode(each.getBranchCode());
            if (each.getServiceOpenedAt() != null) {
                firmwareDVO.setOpenedTimestamp(new Timestamp(each.getServiceOpenedAt()));
            }
            firmwareDVOs.add(firmwareDVO);
        }

        // 2. truncate table
        // TODO need to changed as delete query
        firmwareDAO.deleteFirmwares(domainId);
        firmwareDAO.deleteFirmwareScenarios(domainId);
        firmwareDAO.deleteFirmwareDescriptions(domainId);

        // 3. insert DB data
        firmwareDAO.insertFirmwareScenariosWithLog(domainId, firmwareScenarioDVOs);
        firmwareDAO.insertFirmwareDescriptions(domainId, firmwareDescriptionDVOs);
        firmwareDAO.insertFirmwares(domainId, firmwareDVOs);

        // 4. Replace Campaign If has latest
        List<String> workspaceIdList = workspaceDAO.listWorkspaces(domainId).stream().map(WorkspaceDVO::getWorkspaceId).collect(Collectors.toList());
        for(String workspaceId : workspaceIdList){
            List<String> campaignIdList = campaignDAO.listCampaign(workspaceId).stream().map(CampaignDVO::getCampaignId).collect(Collectors.toList());
            for(String campaignId: campaignIdList){
                List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOList = campaignTargetFirmwareDAO.selectAllCampaingTargetFirmware(workspaceId, campaignId);
                for(CampaignTargetFirmwareDVO campaignTargetFirmwareDVO : campaignTargetFirmwareDVOList){
                    campaignTargetFirmwareDVO.setTargetFirmwareId(campaignService.findLatestTargetFirmwareId(
                            domainId,campaignTargetFirmwareDVO.getModel(),campaignTargetFirmwareDVO.getSalesCode(),campaignTargetFirmwareDVO.getTargetType(),campaignTargetFirmwareDVO.getTargetFirmwareId()
                    ));
                }
                campaignTargetFirmwareDAO.replaceCampaignTargetFirmware(workspaceId,campaignId,campaignTargetFirmwareDVOList);
            }
        }


        activityHistoryInserter.insertVersionHistoryOfUpload(
                domainId, userId, ZeusHistoryConstants.Action.UPLOAD_VERSION, firmwareDVOs.size());

        // refresh UpdateStatus of all device in domain
        Set<ScenarioListResponseBodyVO.DeviceVersionInfo> deviceVersionInfoSet =
                new LinkedHashSet<>();
        List<WorkspaceDVO> workspaceDVOS = workspaceDAO.listWorkspaces(domainId);
        for (WorkspaceDVO workspaceDVO : workspaceDVOS) {
            List<DeviceDVO> deviceDVOS = deviceDAO.listDevicesByWorkspaceId(workspaceDVO.getWorkspaceId());
            for (DeviceDVO deviceDVO : deviceDVOS) {
                deviceVersionInfoSet.add(
                        new ScenarioListResponseBodyVO.DeviceVersionInfo()
                                .setModel(deviceDVO.getModel())
                                .setSalesCode(deviceDVO.getSalesCode()));
            }
        }

        for (ScenarioListResponseBodyVO.DeviceVersionInfo deviceVersionInfo :
                deviceVersionInfoSet) {
            updateStatusHelper.updateUpdateStatus(
                    domainId,
                    userId,
                    deviceVersionInfo.getModel(),
                    deviceVersionInfo.getSalesCode());
        }
        return null;
    }

    public ModelSalesCodesResponseBodyVO getModelSalesCodes(String domainId, String userId) {

        List<ModelSalesCodeDVO> modelSalesCodesDVO = firmwareDAO.listModelSalesCodes(domainId);
        List<ModelSalesCodeVO> modelSalesCodesVO =
                modelSalesCodesDVO.stream()
                        .map(
                                v ->
                                        new ModelSalesCodeVO()
                                                .setModel(v.getModel())
                                                .setSalesCode(v.getSalesCode()))
                        .collect(Collectors.toList());

        return new ModelSalesCodesResponseBodyVO().setModelSalesCodes(modelSalesCodesVO);
    }
}
