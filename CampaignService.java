package com.samsung.efota.zeus.core.service.admin;

import com.samsung.efota.zeus.core.common.ZeusApiSpec;
import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.ZeusDBValue;
import com.samsung.efota.zeus.core.database.dao.*;
import com.samsung.efota.zeus.core.database.zeus.ZeusDBColumnValueConstants;
import com.samsung.efota.zeus.core.database.zeus.vo.*;
import com.samsung.efota.zeus.core.license.LicenseEvaluator;
import com.samsung.efota.zeus.core.serviceHistory.ActivityHistoryInserter;
import com.samsung.efota.zeus.core.serviceHistory.ZeusHistoryConstants;
import com.samsung.efota.zeus.core.util.IDGenUtil;
import com.samsung.efota.zeus.core.util.MultiValueObjectListMap;
import com.samsung.efota.zeus.core.util.ScheduleUtil;
import com.samsung.efota.zeus.core.vo.httpbody.common.CampaignScheduleVO;
import com.samsung.efota.zeus.core.vo.httpbody.common.CampaignTargetFirmwareVO;
import com.samsung.efota.zeus.core.vo.httpbody.common.CampaignVO;
import com.samsung.efota.zeus.core.vo.httpbody.common.ModelSalesCodeCountVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.CampaignIdQueryRequestBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.CampaignRequestBodyVONew;
import com.samsung.efota.zeus.core.vo.httpbody.request.CampaignWithActivateRequestBodyVONew;
import com.samsung.efota.zeus.core.vo.httpbody.response.CampaignIdResponseBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.CampaignListResponseBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.ModelSalesCodesWithCountResponseBodyVO;
import org.apache.logging.log4j.LogManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.lang.invoke.MethodHandles;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CampaignService {
    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Autowired WorkspaceDAO workspaceDAO;

    @Autowired CampaignDAO campaignDAO;

    @Autowired FirmwareDAO firmwareDAO;

    @Autowired CampaignTargetFirmwareDAO campaignTargetFirmwareDAO;

    @Autowired CampaignScheduleCustomDAO campaignScheduleCustomDAO;

    @Autowired DeviceManagementService deviceMgrService;

    @Autowired DeviceDAO deviceDAO;

    @Autowired LicenseEvaluator licenseEvaluator;

    @Autowired UpdateStatusHelper updateStatusHelper;

    @Autowired
    ActivityHistoryInserter activityHistoryInserter;

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public CampaignVO createCampaign(
            String domainId,
            String workspaceId,
            String userId,
            @Valid CampaignWithActivateRequestBodyVONew requestBodyVO)
            throws ZeusException {

        licenseEvaluator.checkActiveLicense(domainId);

        if (CampaignBiz.containsDuplicatedTargetModelSalesCode(
                requestBodyVO.getTargetFirmwares())) {
            throw new ZeusException(
                    ZeusResultCode.UNDEFINED_REQUEST_ERROR,
                    "Duplicated target model and sales code.");
        }
        if (CampaignBiz.containsInvalidTargetModelSalesFirmwareId(
                requestBodyVO.getTargetFirmwares())) {
            throw new ZeusException(ZeusResultCode.BODY_COLUMN_INVALID);
        }

        String campaignId = IDGenUtil.generateCampaignId();

        CampaignDVO campaignDVO =
                CampaignBiz.generateReqAffectedDVO(
                        userId, requestBodyVO, requestBodyVO.getActivate());
        campaignDVO.setWorkspaceId(workspaceId);
        campaignDVO.setCampaignId(campaignId);
        campaignDAO.createCampaign(campaignDVO);

        if (requestBodyVO.getTargetFirmwares() != null) {
            checkTargetFirmwaresInBlacklist(
                    workspaceId,
                    requestBodyVO.getTargetFirmwares().stream()
                            .map(v -> v.getTargetFirmwareId())
                            .collect(Collectors.toList()));
        }

        List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOList =
                generateCampaignTargetFirmwareDVOs(
                        domainId, workspaceId, campaignId, requestBodyVO.getTargetFirmwares());
        campaignTargetFirmwareDAO.insertCampaignTargetFirmware(campaignTargetFirmwareDVOList);

        List<CampaignScheduleCustomDVO> scheduleExceptionDVOList =
                generateCampaignScheduleCustomDVOs(
                        workspaceId, campaignId, requestBodyVO.getSchedule());
        campaignScheduleCustomDAO.insertCampaignScheduleCustom(scheduleExceptionDVOList);

        activityHistoryInserter.insertCampaignHistory(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.CREATE_CAMPAIGN,
                campaignDVO.getCampaignId(),
                campaignDVO.getCampaignName());

        return getCampaign(domainId, workspaceId, campaignId);
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public CampaignVO updateCampaign(
            String domainId,
            String workspaceId,
            String userId,
            String campaignId,
            @Valid CampaignRequestBodyVONew requestBodyVO)
            throws ZeusException {

        licenseEvaluator.checkActiveLicense(domainId);

        CampaignDVO previousCampaignVONew = campaignDAO.selectCampaign(workspaceId, campaignId);
        if (previousCampaignVONew == null) {
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "Campaign");
        }

        if (CampaignBiz.containsDuplicatedTargetModelSalesCode(
                requestBodyVO.getTargetFirmwares())) {
            throw new ZeusException(
                    ZeusResultCode.UNDEFINED_REQUEST_ERROR,
                    "Duplicated target model and sales code.");
        }
        if (CampaignBiz.containsInvalidTargetModelSalesFirmwareId(
                requestBodyVO.getTargetFirmwares())) {
            throw new ZeusException(ZeusResultCode.BODY_COLUMN_INVALID);
        }

        CampaignDVO campaignDVO = CampaignBiz.generateReqAffectedDVO(userId, requestBodyVO, null);
        campaignDAO.updateCampaign(workspaceId, campaignId, campaignDVO);

        if (requestBodyVO.getTargetFirmwares() != null) {

            checkTargetFirmwaresInBlacklist(domainId,
                    requestBodyVO.getTargetFirmwares().stream()
                            .map(v -> v.getTargetFirmwareId())
                            .collect(Collectors.toList()));

            List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOList =
                    generateCampaignTargetFirmwareDVOs(
                            domainId, workspaceId, campaignId, requestBodyVO.getTargetFirmwares());
            campaignTargetFirmwareDAO.replaceCampaignTargetFirmware(
                    workspaceId, campaignId, campaignTargetFirmwareDVOList);
        }
        if (requestBodyVO.getSchedule() != null) {
            List<CampaignScheduleCustomDVO> scheduleExceptionDVOList =
                    generateCampaignScheduleCustomDVOs(
                            workspaceId, campaignId, requestBodyVO.getSchedule());

            campaignScheduleCustomDAO.deleteAllCampaignScheduleCustom(workspaceId, campaignId);
            campaignScheduleCustomDAO.insertCampaignScheduleCustom(scheduleExceptionDVOList);

        }

        updateStatusHelper.updateUpdateStatusInCampaign(domainId, workspaceId, userId, campaignId);
        activityHistoryInserter.insertCampaignHistory(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.MODIFY_CAMPAIGN,
                campaignId,
                campaignDVO.getCampaignName());
        return getCampaign(domainId, workspaceId, campaignId);
    }

    private void checkTargetFirmwaresInBlacklist(String domainId, List<Integer> firmwareIds) {
        List<Integer> firmwareIdsInBlacklist = firmwareDAO.selectFirmwaresInBlacklist(domainId, firmwareIds);
        Set<Integer> firmwareIdSetInBlacklist = firmwareIdsInBlacklist.stream().collect(Collectors.toSet());

        for(Integer each: firmwareIds){
            if(firmwareIdSetInBlacklist.contains(each) == true){
                throw new ZeusException(
                        ZeusResultCode.BLACKLISTED_FIRMWARE_CANNOT_ASSIGNED_TARGET_FIRMWARE);
            }
        }
    }

    public CampaignVO getCampaign(String domainId, String workspaceId, String campaignId) throws ZeusException {
        CampaignJoinDVO campaigcampaignJoinDVODVO =
                campaignDAO.selectCampaignWithDeviceCount(workspaceId, campaignId);
        if (campaigcampaignJoinDVODVO == null) {
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "Campaign");
        }

        List<CampaignTargetFirmwareJoinDVO> campaignTargetFirmwareJoinDVOList =
                campaignTargetFirmwareDAO.listCampaignTargetFirmwareWithFwDetail(
                        domainId, workspaceId, campaignId);
        List<CampaignScheduleCustomDVO> campaignScheduleCustomDVOList =
                campaignScheduleCustomDAO.listCampaignScheduleCustom(workspaceId, campaignId);
        List<CampaignTargetDeviceCountDVO> campaignTargetCountDVOList =
                deviceDAO.countDevicePerSingleCampaignTarget(workspaceId, campaignId);

        CampaignVO campaignVO =
                new CampaignVO.Builder()
                        .withCampaignJoinedDVONew(campaigcampaignJoinDVODVO)
                        .withCampaignTargetFirmwareDVOs(campaignTargetFirmwareJoinDVOList)
                        .withCampaignCustomDaysDVONew(campaignScheduleCustomDVOList)
                        .withCampaignTargetDeviceCount(campaignTargetCountDVOList)
                        .build();

        return campaignVO;
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public void deleteCampaign(String domainId, String workspaceId, String userId, String campaignId, boolean force)
            throws ZeusException {

        licenseEvaluator.checkActiveLicense(domainId);

        CampaignDVO campaignDVO = campaignDAO.selectCampaign(workspaceId, campaignId);
        if (campaignDVO == null) {
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "Campaign");
        }
        if (force == false
                && ZeusApiSpec.Campaign.Status.RUNNING
                        == CampaignBiz.defineCampaignStatus(
                                campaignDVO.getStatusCode(),
                                campaignDVO.getScheduleStartDate(),
                                campaignDVO.getScheduleEndDate())) {
            throw new ZeusException(
                    ZeusResultCode.UNDEFINED_REQUEST_ERROR,
                    "Campaign must be Scheduled/Expired/Deactivated");
        }

        int result = campaignDAO.deleteCampaign(workspaceId, campaignId);
        if (result != 1) {
            LogManager.getLogger()
                    .error(
                            "Failed to delete a campaign row. workspaceId={}, campaignId={}",
                            workspaceId,
                            campaignId);
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
        campaignTargetFirmwareDAO.deleteAllCampaignTargetFirmwares(workspaceId, campaignId);

        List<DeviceDVO> deviceDVOs = deviceDAO.listDevicesByCampaignId(workspaceId, campaignId);
        deviceMgrService.assignToCampaign(
                domainId,
                workspaceId,
                "system",
                deviceDVOs,
                ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED);

        activityHistoryInserter.insertCampaignHistory(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.DELETE_CAMPAIGN,
                campaignDVO.getCampaignId(),
                campaignDVO.getCampaignName());
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public CampaignVO activateCampaign(String domainId, String workspaceId, String userId, String campaignId)
            throws ZeusException {

        licenseEvaluator.checkActiveLicense(domainId);

        CampaignDVO campaignDVO = campaignDAO.selectCampaign(workspaceId, campaignId);
        if (campaignDVO == null) {
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "Campaign");
        }

        if (ZeusDBValue.Campaign.Status.ACTIVE.getValue().equals(campaignDVO.getStatusCode())
                == false) {
            campaignDAO.activateCampaign(workspaceId, campaignId, userId);
            updateStatusHelper.updateUpdateStatusInCampaign(domainId, workspaceId, userId, campaignId);
        }
        activityHistoryInserter.insertCampaignHistory(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.ACTIVATE_CAMPAIGN,
                campaignDVO.getCampaignId(),
                campaignDVO.getCampaignName());
        return getCampaign(domainId, workspaceId, campaignId);
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public CampaignVO deactivateCampaign(String domainId, String workspaceId, String userId, String campaignId)
            throws ZeusException {

        licenseEvaluator.checkActiveLicense(domainId);

        CampaignDVO campaignDVO = campaignDAO.selectCampaign(workspaceId, campaignId);
        if (campaignDVO == null) {
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "Campaign");
        }

        if (ZeusDBValue.Campaign.Status.INACTIVE.getValue().equals(campaignDVO.getStatusCode())
                == false) {
            campaignDAO.deactivateCampaign(workspaceId, campaignId, userId);
            updateStatusHelper.updateUpdateStatusInCampaign(domainId, workspaceId, userId, campaignId);
        }
        activityHistoryInserter.insertCampaignHistory(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.DEACTIVATE_CAMPAIGN,
                campaignDVO.getCampaignId(),
                campaignDVO.getCampaignName());
        return getCampaign(domainId, workspaceId, campaignId);
    }

    public CampaignListResponseBodyVO listCampaigns(String domainId, String workspaceId) {

        List<CampaignJoinDVO> campaignDVOList = campaignDAO.listCampaignWithDeviceCount(workspaceId);
        List<CampaignTargetFirmwareJoinDVO> campaignTargetFirmwareDVOLists =
                campaignTargetFirmwareDAO.listDomainTargetFirmwareWithFwDetail(domainId, workspaceId);
        List<CampaignScheduleCustomDVO> campaignScheduleCustomDVOLists =
                campaignScheduleCustomDAO.listDomainScheduleCustom(workspaceId);
        List<CampaignTargetDeviceCountDVO> campaignTargetDeviceCountDVOList =
                deviceDAO.countDevicePerDomainCampaignTarget(workspaceId);

        MultiValueObjectListMap mapTargetFirmwares = new MultiValueObjectListMap();
        for (CampaignTargetFirmwareJoinDVO each : campaignTargetFirmwareDVOLists) {
            mapTargetFirmwares.add(each.getCampaignId(), each);
        }

        MultiValueObjectListMap mapCustomDays = new MultiValueObjectListMap();
        for (CampaignScheduleCustomDVO each : campaignScheduleCustomDVOLists) {
            mapCustomDays.add(each.getCampaignId(), each);
        }

        CampaignListResponseBodyVO campaignListResponseBodyVO =
                new CampaignListResponseBodyVO().init();
        for (CampaignJoinDVO campaignJoinDVO : campaignDVOList) {
            List<CampaignTargetFirmwareJoinDVO> campaignTargetFirmwareDVOList =
                    mapTargetFirmwares.get(campaignJoinDVO.getCampaignId());
            List<CampaignScheduleCustomDVO> campaignScheduleCustomDVOList =
                    mapCustomDays.get(campaignJoinDVO.getCampaignId());

            CampaignVO campaignVO =
                    new CampaignVO.Builder()
                            .withCampaignJoinedDVONew(campaignJoinDVO)
                            .withCampaignTargetFirmwareDVOs(campaignTargetFirmwareDVOList)
                            .withCampaignCustomDaysDVONew(campaignScheduleCustomDVOList)
                            .withCampaignTargetDeviceCount(campaignTargetDeviceCountDVOList)
                            .build();

            campaignListResponseBodyVO.addCampaign(campaignVO);
        }

        return campaignListResponseBodyVO;
    }

    public List<CampaignTargetFirmwareDVO> generateCampaignTargetFirmwareDVOs(
            String domainId, String workspaceId, String campaignId, List<CampaignTargetFirmwareVO> targetFirmwares) {
        List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOList = new ArrayList<>();
        for (CampaignTargetFirmwareVO each : targetFirmwares) {
            CampaignTargetFirmwareDVO targetFirmware = new CampaignTargetFirmwareDVO();
            targetFirmware.setWorkspaceId(workspaceId);
            targetFirmware.setCampaignId(campaignId);
            targetFirmware.setModel(each.getModel());
            targetFirmware.setSalesCode(each.getSalesCode());
            targetFirmware.setTargetType(each.getTargetType());
            targetFirmware.setTargetFirmwareId(
                    findLatestTargetFirmwareId(
                            domainId,
                            each.getModel(),
                            each.getSalesCode(),
                            each.getTargetType(),
                            each.getTargetFirmwareId()));
            campaignTargetFirmwareDVOList.add(targetFirmware);
        }
        return campaignTargetFirmwareDVOList;
    }

    public Integer findLatestTargetFirmwareId(
            String domainId,
            String model,
            String salesCode,
            String targetTypeStr,
            Integer targetFirmwareIdInSelective) {
        Integer targetFirmwareId = null;
        if (ZeusApiSpec.TargetFirmware.TargetType.LATEST.getValue().equals(targetTypeStr) == true) {
            FirmwareDVO firmwareDVO = firmwareDAO.selectLatestUserTypeFirmware(domainId, model, salesCode);
            if (firmwareDVO != null) {
                targetFirmwareId = firmwareDVO.getFirmwareId();
            } else {
                LOGGER.warn("No Latest firmware. model:{}, salesCode:{}", model, salesCode);
            }
        } else if (ZeusApiSpec.TargetFirmware.TargetType.LATEST_IN_TESTED
                        .getValue()
                        .equals(targetTypeStr)
                == true) {
            FirmwareDVO firmwareDVO =
                    firmwareDAO.selectLatestInTestedUserTypeFirmware(domainId, model, salesCode);
            if (firmwareDVO != null) {
                targetFirmwareId = firmwareDVO.getFirmwareId();
            } else {
                LOGGER.warn("No Latest firmware. model:{}, salesCode:{}", model, salesCode);
            }
        } else if (ZeusApiSpec.TargetFirmware.TargetType.SELECTIVE.getValue().equals(targetTypeStr)
                == true) {
            targetFirmwareId = targetFirmwareIdInSelective;
        } else {
            LOGGER.error("ERROR - Invalid targetType. model:{}, salesCode:{}", model, salesCode);
        }

        return targetFirmwareId;
    }

    public List<CampaignScheduleCustomDVO> generateCampaignScheduleCustomDVOs(
            String workspaceId, String campaignId, CampaignScheduleVO schedule) throws ZeusException {
        List<CampaignScheduleCustomDVO> dvoList = new LinkedList<>();

        Set<DayOfWeek> activeWeekdays =
                ScheduleUtil.parseToDayOfWeekSet(schedule.getWeeklyRepeat());

        if (schedule.getDaysInclude() != null) {
            for (String dayInclude : schedule.getDaysInclude()) {
                if (ScheduleUtil.isInThePeriod(
                        dayInclude, schedule.getStartDate(), schedule.getEndDate())) {
                    if (false
                            == activeWeekdays.contains(
                                    LocalDate.parse(dayInclude).getDayOfWeek())) {
                        dvoList.add(
                                new CampaignScheduleCustomDVO(
                                        workspaceId,
                                        campaignId,
                                        ZeusDBValue.Schedule.Custom.INCLUDE,
                                        LocalDate.parse(dayInclude)));
                    }
                }
            }
        }

        if (schedule.getDaysExclude() != null) {
            for (String dayExclude : schedule.getDaysExclude()) {
                if (ScheduleUtil.isInThePeriod(
                        dayExclude, schedule.getStartDate(), schedule.getEndDate())) {
                    if (activeWeekdays.contains(LocalDate.parse(dayExclude).getDayOfWeek())) {
                        dvoList.add(
                                new CampaignScheduleCustomDVO(
                                        workspaceId,
                                        campaignId,
                                        ZeusDBValue.Schedule.Custom.EXCLUDE,
                                        LocalDate.parse(dayExclude)));
                    }
                }
            }
        }

        return dvoList;
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public void changeTargetFirmwareIfLatestChanged(
            String domainId, String userId, String model, String salesCode) {
        List<WorkspaceDVO> workspaceDVOs = workspaceDAO.listWorkspaces(domainId);

        for(WorkspaceDVO workspaceDVO: workspaceDVOs){
            LogManager.getLogger().info("changeTargetFirmware. domainId={}, userId={}, model={}, salesCode={}, workspaceId={}",domainId,userId,model,salesCode);
            String workspaceId = workspaceDVO.getWorkspaceId();
            Integer targetFirmwareId = null;

            FirmwareDVO firmwareDVO =
                    firmwareDAO.selectLatestInTestedUserTypeFirmware(domainId, model, salesCode);
            if (firmwareDVO != null) {
                targetFirmwareId = firmwareDVO.getFirmwareId();
            } else {
                LOGGER.warn("No Latest firmware. model:{}, salesCode:{}", model, salesCode);
            }

            List<CampaignTargetFirmwareDVO> targetFirmwares =
                    campaignTargetFirmwareDAO.selectAllTargetFirmware(
                            workspaceId,
                            model,
                            salesCode,
                            ZeusApiSpec.TargetFirmware.TargetType.LATEST_IN_TESTED.getValue());
            List<CampaignTargetFirmwareDVO> targetFirmwwaresToBeChanged = new ArrayList<>();
            List<String> campaignIdsChanged = new ArrayList<>();
            for (CampaignTargetFirmwareDVO each : targetFirmwares) {
                if (Objects.equals(each.getTargetFirmwareId(), targetFirmwareId) == false) {
                    each.setTargetFirmwareId(targetFirmwareId);
                    targetFirmwwaresToBeChanged.add(each);
                    campaignIdsChanged.add(each.getCampaignId());
                }
            }

            campaignTargetFirmwareDAO.insertCampaignTargetFirmware(targetFirmwwaresToBeChanged);
            updateStatusHelper.updateUpdateStatusInCampaign(domainId, workspaceId, userId, campaignIdsChanged, model, salesCode);
        }
    }

    public ModelSalesCodesWithCountResponseBodyVO getModelSalesCodes(String domainId, String workspaceId, String campaignId) {
        List<CampaignTargetDeviceCountDVO> campaignTargetCountDVOList =
                deviceDAO.countDevicePerSingleCampaignTarget(workspaceId, campaignId);
        List<ModelSalesCodeCountVO> listModelSalesCodeCount = new ArrayList<>();
        int totalDeviceCount = 0;
        for (CampaignTargetDeviceCountDVO each : campaignTargetCountDVOList) {
            listModelSalesCodeCount.add(
                    new ModelSalesCodeCountVO()
                            .setModel(each.getModel())
                            .setSalesCode(each.getSalesCode())
                            .setDeviceCount(each.getCount()));
            totalDeviceCount += each.getCount();
        }

        return new ModelSalesCodesWithCountResponseBodyVO()
                .setModelSalesCodes(listModelSalesCodeCount)
                .setDeviceCount(totalDeviceCount);
    }

    public CampaignIdResponseBodyVO queryCampaignId(String workspaceId, CampaignIdQueryRequestBodyVO requestBodyVO) {

        List<CampaignDVO> campaignDVOList = campaignDAO.queryCampaignsReturningCampaignIdCampaignName(workspaceId, requestBodyVO.getFilters());

        CampaignIdResponseBodyVO campaignIdResponseBodyVO = new  CampaignIdResponseBodyVO.Builder().withCampaignDVOs(campaignDVOList).build();

        return campaignIdResponseBodyVO;

    }
}
