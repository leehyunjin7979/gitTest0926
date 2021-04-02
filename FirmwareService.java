package com.samsung.efota.zeus.core.service.admin;

import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.dao.FirmwareDAO;
import com.samsung.efota.zeus.core.database.dao.WorkspaceDAO;
import com.samsung.efota.zeus.core.database.zeus.ZeusDBColumnValueConstants;
import com.samsung.efota.zeus.core.database.zeus.vo.FirmwareDVO;
import com.samsung.efota.zeus.core.database.zeus.vo.FirmwareDescriptionDVO;
import com.samsung.efota.zeus.core.database.zeus.vo.FirmwareInternalTestResultDVO;
import com.samsung.efota.zeus.core.license.LicenseEvaluator;
import com.samsung.efota.zeus.core.serviceHistory.ActivityHistoryInserter;
import com.samsung.efota.zeus.core.serviceHistory.ZeusHistoryConstants;
import com.samsung.efota.zeus.core.vo.httpbody.common.FirmwareVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.MarkTestedRequestBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.FirmwareListResponseBodyVO;
import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.lang.invoke.MethodHandles;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FirmwareService {
    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    final FirmwareDAO firmwareDAO;

    final WorkspaceDAO workspaceDAO;

    final CampaignService campaignService;

    final LicenseEvaluator licenseEvaluator;

    final UpdateStatusHelper updateStatusHelper;

    final ActivityHistoryInserter activityHistoryInserter;

    public FirmwareService(
            FirmwareDAO firmwareDAO,
            WorkspaceDAO workspaceDAO, CampaignService campaignService,
            LicenseEvaluator licenseEvaluator,
            UpdateStatusHelper updateStatusHelper, ActivityHistoryInserter activityHistoryInserter) {
        this.firmwareDAO = firmwareDAO;
        this.workspaceDAO = workspaceDAO;
        this.campaignService = campaignService;
        this.licenseEvaluator = licenseEvaluator;
        this.updateStatusHelper = updateStatusHelper;
        this.activityHistoryInserter = activityHistoryInserter;
    }

    public FirmwareListResponseBodyVO getFirmwareList(
            String domainId, String userId, String model, String salesCode, String languageCode) {
        List<FirmwareDVO> firmwareDVOs = firmwareDAO.listFirmwaresByModelSalesCode(domainId, model, salesCode);
        List<Integer> firmwareIds = new LinkedList<Integer>();

        List<FirmwareVO> firmwareList = new LinkedList<FirmwareVO>();
        if (firmwareDVOs.size() > 0) {
            for (FirmwareDVO firmwareDVO : firmwareDVOs) {
                firmwareIds.add(firmwareDVO.getFirmwareId());
            }

            // Confirm
            Map<Integer, FirmwareInternalTestResultDVO> mapFirmwareConfirm =
                    new HashMap<Integer, FirmwareInternalTestResultDVO>();
            List<FirmwareInternalTestResultDVO> firmwareInternalTestResultDVOS =
                    firmwareDAO.selectFirmwareInternalTestResultList(domainId, firmwareIds);
            for (FirmwareInternalTestResultDVO confirmDVO : firmwareInternalTestResultDVOS) {
                mapFirmwareConfirm.put(confirmDVO.getFirmwareId(), confirmDVO);
            }

            // Descirption
            Map<Integer, FirmwareDescriptionDVO> mapFirmwareDescription =
                    new HashMap<Integer, FirmwareDescriptionDVO>();
            List<FirmwareDescriptionDVO> firmwareDescriptionDVOs =
                    firmwareDAO.selectFirmwareDescriptionList(domainId, languageCode, firmwareIds);
            for (FirmwareDescriptionDVO descriptionDVO : firmwareDescriptionDVOs) {
                if (descriptionDVO.getLanguageCode().equalsIgnoreCase("ENG") == true) {
                    mapFirmwareDescription.putIfAbsent(
                            descriptionDVO.getFirmwareId(), descriptionDVO);
                } else {
                    mapFirmwareDescription.put(descriptionDVO.getFirmwareId(), descriptionDVO);
                }
            }

            // Blacklist
            List<Integer> firmwareIdsInBlacklist = firmwareDAO.selectFirmwaresInBlacklist(domainId, firmwareIds);
            Set<Integer> firmwareIdsetInBlacklist = firmwareIdsInBlacklist.stream().collect(Collectors.toSet());

            for (FirmwareDVO firmwareDVO : firmwareDVOs) {
                Integer firmwareId = firmwareDVO.getFirmwareId();
                FirmwareVO firmwareVO =
                        new FirmwareVO.Builder()
                                .withFirmwareDVO(firmwareDVO)
                                .withFirmwareConfirmDVO(mapFirmwareConfirm.get(firmwareId))
                                .withFirmwareDescriptionDVO(mapFirmwareDescription.get(firmwareId))
                                .setBlocklisted(firmwareIdsetInBlacklist.contains(firmwareId))
                                .build();
                firmwareList.add(firmwareVO);
            }
        }

        FirmwareListResponseBodyVO response =
                new FirmwareListResponseBodyVO().setFirmwares(firmwareList);

        return response;
    }

    public FirmwareVO getFirmware(
            String domainId, String userId, Integer firmwareId, String languageCode)
            throws ZeusException {
        FirmwareDVO firmwareDVO = firmwareDAO.selectFirmware(domainId, firmwareId);

        if (firmwareDVO == null) {
            LOGGER.error("Does not exist!, workspaceId:{}, firmwareId:{}", domainId, firmwareId);
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "Firmware");
        }

        List<Integer> firmwareIds = Arrays.asList(firmwareId);

        // Confirm
        List<FirmwareInternalTestResultDVO> firmwareInternalTestResultDVOS =
                firmwareDAO.selectFirmwareInternalTestResultList(domainId, firmwareIds);
        FirmwareInternalTestResultDVO firmwareInternalTestResultDVO =
                firmwareInternalTestResultDVOS.size() > 0
                        ? firmwareInternalTestResultDVOS.get(0)
                        : null;

        // Descirption
        FirmwareDescriptionDVO firmwareDescriptionDVO = null;
        List<FirmwareDescriptionDVO> firmwareDescriptionDVOs =
                firmwareDAO.selectFirmwareDescriptionList(domainId, languageCode, firmwareIds);
        for (FirmwareDescriptionDVO descriptionDVO : firmwareDescriptionDVOs) {
            if (descriptionDVO.getLanguageCode().equalsIgnoreCase("ENG") == true) {
                if (firmwareDescriptionDVO == null) {
                    firmwareDescriptionDVO = descriptionDVO;
                }
            } else {
                firmwareDescriptionDVO = descriptionDVO;
            }
        }

        // Blacklist
        List<Integer> firmwareIdsInBlacklist = firmwareDAO.selectFirmwaresInBlacklist(domainId, firmwareIds);
        boolean blacklisted = false;
        if(CollectionUtils.isNotEmpty(firmwareIdsInBlacklist)) {
            if(firmwareId.equals(firmwareIdsInBlacklist.get(0))){
                blacklisted = true;
            }
        }

        FirmwareVO firmwareVO =
                new FirmwareVO.Builder()
                        .withFirmwareDVO(firmwareDVO)
                        .withFirmwareConfirmDVO(firmwareInternalTestResultDVO)
                        .withFirmwareDescriptionDVO(firmwareDescriptionDVO)
                        .setBlocklisted(blacklisted)
                        .build();

        return firmwareVO;
    }

    public boolean isUserNormalFirmware(String domainId, Integer firmwareId) throws ZeusException {
        FirmwareDVO firmwareDVO = firmwareDAO.selectFirmware(domainId, firmwareId);

        if (firmwareDVO == null) {
            LOGGER.error("Does not exist!, workspaceId:{}, firmwareId:{}", domainId, firmwareId);
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "Firmware");
        }

        return ZeusDBColumnValueConstants.BUILD_TYPE_CODE_USER.equals(firmwareDVO.getBuildTypeCode())
                == true
                && ZeusDBColumnValueConstants.DUMMY_TYPE_CODE_NORMAL.equals(
                firmwareDVO.getDummyTypeCode())
                == true;
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public FirmwareVO markTested(
            String domainId,
            String userId,
            Integer firmwareId,
            MarkTestedRequestBodyVO markTestedRequestBodyVO,
            String languageCode)
            throws ZeusException {

        licenseEvaluator.checkActiveLicense(domainId);

        if (isUserNormalFirmware(domainId, firmwareId) == false) {
            LOGGER.error("Does not exist!, workspaceId:{}, firmwareId:{}", domainId, firmwareId);
            throw new ZeusException(ZeusResultCode.NOTSUPPORTED_MARK_TEST);
        }

        firmwareDAO.markTested(
                domainId, userId, firmwareId, "Passed", markTestedRequestBodyVO.getNote());

        FirmwareVO firmwareVO = getFirmware(domainId, userId, firmwareId, languageCode);

        campaignService.changeTargetFirmwareIfLatestChanged(
                domainId, userId, firmwareVO.getModel(), firmwareVO.getSalesCode());


        activityHistoryInserter.insertVersionHistoryOfMark(
            domainId,
            userId,
            ZeusHistoryConstants.Action.MARK_TESTED,
            firmwareVO.getFirmwareVersion());

        return firmwareVO;
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public FirmwareVO unmarkTested(
            String domainId, String userId, Integer firmwareId, String languageCode)
            throws ZeusException {
        licenseEvaluator.checkActiveLicense(domainId);

        if (isUserNormalFirmware(domainId, firmwareId) == false) {
            LOGGER.error("Does not exist!, workspaceId:{}, firmwareId:{}", domainId, firmwareId);
            throw new ZeusException(ZeusResultCode.NOTSUPPORTED_MARK_TEST);
        }

        firmwareDAO.deleteMarkTested(domainId, userId, firmwareId);

        FirmwareVO firmwareVO = getFirmware(domainId, userId, firmwareId, languageCode);

        campaignService.changeTargetFirmwareIfLatestChanged(
                domainId, userId, firmwareVO.getModel(), firmwareVO.getSalesCode());

        activityHistoryInserter.insertVersionHistoryOfMark(
                domainId,
                userId,
                ZeusHistoryConstants.Action.UNMARK_TESTED,
                firmwareVO.getFirmwareVersion());
        return firmwareVO;
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public FirmwareVO blacklisted(
            String domainId,
            String userId,
            Integer firmwareId,
            String languageCode)
            throws ZeusException {

        licenseEvaluator.checkActiveLicense(domainId);

        firmwareDAO.insertToBlacklist(
                domainId, userId, firmwareId);

        FirmwareVO firmwareVO = getFirmware(domainId, userId, firmwareId, languageCode);

        updateStatusHelper.updateUpdateStatus(domainId, userId, firmwareVO.getModel(), firmwareVO.getSalesCode());

        activityHistoryInserter.insertVersionHistoryOfMark(
                domainId,
                userId,
                ZeusHistoryConstants.Action.ADD_TO_BLACKLIST,
                firmwareVO.getFirmwareVersion());
        return firmwareVO;
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public FirmwareVO unblacklisted(
            String domainId, String userId, Integer firmwareId, String languageCode)
            throws ZeusException {
        licenseEvaluator.checkActiveLicense(domainId);

        firmwareDAO.deleteFromBlacklist(domainId, userId, firmwareId);

        FirmwareVO firmwareVO = getFirmware(domainId, userId, firmwareId, languageCode);

        updateStatusHelper.updateUpdateStatus(domainId, userId, firmwareVO.getModel(), firmwareVO.getSalesCode());

        activityHistoryInserter.insertVersionHistoryOfMark(
                domainId,
                userId,
                ZeusHistoryConstants.Action.REMOVE_FROM_BLACKLIST,
                firmwareVO.getFirmwareVersion());
        return firmwareVO;
    }
}
