package com.samsung.efota.zeus.core.service.admin;

import com.google.common.collect.Sets;
import com.samsung.efota.zeus.core.common.ApiSpecConstants;
import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.dao.*;
import com.samsung.efota.zeus.core.database.zeus.ZeusDBColumnValueConstants;
import com.samsung.efota.zeus.core.database.zeus.vo.*;
import com.samsung.efota.zeus.core.firmware.FirmwareCoordinator;
import com.samsung.efota.zeus.core.license.LicenseEvaluator;
import com.samsung.efota.zeus.core.serviceHistory.ActivityHistoryInserter;
import com.samsung.efota.zeus.core.serviceHistory.DeviceHistoryInserter;
import com.samsung.efota.zeus.core.serviceHistory.ZeusHistoryConstants;
import com.samsung.efota.zeus.core.util.OffsetUtil;
import com.samsung.efota.zeus.core.vo.httpbody.common.*;
import com.samsung.efota.zeus.core.vo.httpbody.request.*;
import com.samsung.efota.zeus.core.vo.httpbody.response.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.lang.invoke.MethodHandles;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.samsung.efota.zeus.core.database.zeus.ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED;
import static com.samsung.efota.zeus.core.filter.HttpLoggingFilter.THREAD_CONTEXT_REQUEST_ID;

@Service
public class DeviceService {
    private static final Integer GET_ALL_DEVICE_ID_MAX_LIMIT = 100000;
    public static Pattern allowedOrderKeys = Pattern.compile("^(imei|meid|serialNumber|registeredAt|modifiedAt|firmwareVersion)$");
    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    @Autowired
    LicenseEvaluator licenseEvaluator;
    @Autowired
    CampaignService campaignService;
    @Autowired
    DeviceDAO deviceDAO;
    @Autowired
    FirmwareDAO firmwareDAO;
    @Autowired
    CampaignTargetFirmwareDAO campaignTargetFirmwareDAO;
    @Autowired
    CampaignDAO campaignDAO;
    @Autowired
    DeviceHistoryDAO historyDAO;
    @Autowired
    TagDAO tagDAO;
    @Autowired
    FirmwareCoordinator firmwareCoordinator;
    @Autowired
    DeviceManagementService deviceManageService;
    @Autowired
    ActivityHistoryInserter activityHistoryInserter;
    @Autowired
    DeviceHistoryInserter deviceHistoryInserter;
    @Autowired
    DeviceHistoryDAO deviceHistoryDAO;



    public DeviceIdResponseBodyVO queryDeviceIds(String domainId, String workspaceId, String userId, @Valid DeviceIdQueryRequestBodyVO requestBodyVO) throws ZeusException {

        List<DeviceDVO> deviceDVOs = deviceDAO.queryDevicesReturningDeviceIdEnrollmentStatus(domainId, workspaceId, requestBodyVO.getFilters());

        DeviceIdResponseBodyVO deviceIdResponseBodyVO = new DeviceIdResponseBodyVO.Builder().withDeviceDVOs(deviceDVOs).build();

        return deviceIdResponseBodyVO;
    }

    public DevicesResponseBodyVO query(String domainId, String workspaceId, String userId, DeviceQueryRequestBodyVO requestBodyVO, String pageToken, int limit) throws ZeusException {

        if(false==onlyContainsAllowedOrderKeys(requestBodyVO.getOrderBy())){
            throw new ZeusException(ZeusResultCode.BODY_COLUMN_INVALID,"orderBy.key");
        }
        if(containsDuplicatedKeys(requestBodyVO.getOrderBy())){
            throw new ZeusException(ZeusResultCode.BODY_COLUMN_INVALID,"orderBy.key");
        }

        DevicesResponseBodyVO devicesResponseBodyVO = new DevicesResponseBodyVO();

        Integer offset = OffsetUtil.convertDeviceQueryPagetokenIntoOffset(pageToken);

        List<DeviceWithRelatedJoinDVO> deviceDVOs = deviceDAO.query(domainId, workspaceId, userId
                , requestBodyVO.getFilters()
                , requestBodyVO.getOrderBy()
                , limit + OffsetUtil.HAS_NEXT_CHECKER
                , offset);

        if(OffsetUtil.containsMoreResultsNotShownYet(deviceDVOs.size(), limit)){
            deviceDVOs.remove(deviceDVOs.size()-1);
            devicesResponseBodyVO.setNextPageToken(OffsetUtil.generateDeviceQueryNextPageToken(offset, limit));
        }

        if(pageToken!=null){
            devicesResponseBodyVO.setPrevPageToken(OffsetUtil.generateDeviceQueryPrevPageToken(offset, limit));
        }

        List<DeviceVO> devices = new LinkedList<DeviceVO>();
        for(DeviceWithRelatedJoinDVO dvo : deviceDVOs){
            devices.add(new DeviceVO.Builder().withDeviceQueryDJVO(dvo).build());
        }
        return devicesResponseBodyVO.setDevices(devices);
    }

    private boolean containsDuplicatedKeys(List<DeviceQueryRequestBodyVO.OrderBy> orderBy) {
        Set<String> keySet = new HashSet<>();
        if(orderBy!=null && orderBy.size()>0){
            for(DeviceQueryRequestBodyVO.OrderBy eachOrderBY : orderBy){
                if(keySet.contains(eachOrderBY.getKey())){
                    return true;
                }else{
                    keySet.add(eachOrderBY.getKey());
                }
            }
        }
        return false;
    }

    private boolean onlyContainsAllowedOrderKeys(List<DeviceQueryRequestBodyVO.OrderBy> orderBy) {
        if(orderBy!=null && orderBy.size()>0){
            for(DeviceQueryRequestBodyVO.OrderBy eachOrderBY : orderBy){
                if(false==allowedOrderKeys.matcher(eachOrderBY.getKey()).matches()){
                    return false;
                }
            }
        }
        return true;
    }

    public ValueGroupInTrashResponseBodyVO listValueGroupsInTrash(String domainId, String workspaceId) {
        List<ModelSalesCodeDeviceCountDVO> modelSalesCodeDVOs =
                deviceDAO.countDevicePerModelSalesCodeInTrash(workspaceId);

        int totalDevices = 0;
        List<ModelSalesCodeCountVO> modelSalesCodeDeviceCountVO = new ArrayList<>();
        for(ModelSalesCodeDeviceCountDVO each: modelSalesCodeDVOs) {
            ModelSalesCodeCountVO vo = new ModelSalesCodeCountVO();
            vo.setModel(each.getModel());
            vo.setSalesCode(each.getSalesCode());
            vo.setDeviceCount(each.getCount());
            totalDevices += each.getCount() == null ? 0 : each.getCount();

            modelSalesCodeDeviceCountVO.add(vo);
        }

        List<UserDeviceCountDVO> userDeviceCountDVOs =
                deviceDAO.countDevicePerDeleterInTrash(workspaceId);
        List<UserDeviceCountVO> deleterValueGroups = new ArrayList<>();
        for(UserDeviceCountDVO each : userDeviceCountDVOs){
            UserDeviceCountVO vo = new UserDeviceCountVO();
            vo.setUserId(each.getUserId());
            vo.setDeviceCount(each.getCount());

            deleterValueGroups.add(vo);
        }

        ValueGroupInTrashResponseBodyVO response = new ValueGroupInTrashResponseBodyVO();
        response.setModelValueGroups(modelSalesCodeDeviceCountVO);
        response.setDeleterValueGroups(deleterValueGroups);
        response.setDeviceCount(totalDevices);

        return response;
    }

    public DeletedDevicesResponseBodyVO queryInTrash(String domainId, String workspaceId, String userId, QueryForDeletedDevicesRequestBodyVO requestBodyVO, String pageToken, int limit) {

        DeletedDevicesResponseBodyVO devicesResponseBodyVO = new DeletedDevicesResponseBodyVO();

        Integer offset = OffsetUtil.convertDeviceQueryPagetokenIntoOffset(pageToken);

        List<DeletedDeviceDVO> deviceDVOs = deviceDAO.queryForDeletedDevices(workspaceId, userId
                , requestBodyVO.getFilters()
                , requestBodyVO.getOrderBy()
                , limit + OffsetUtil.HAS_NEXT_CHECKER
                , offset);

        if(OffsetUtil.containsMoreResultsNotShownYet(deviceDVOs.size(), limit)){
            deviceDVOs.remove(deviceDVOs.size()-1);
            devicesResponseBodyVO.setNextPageToken(OffsetUtil.generateDeviceQueryNextPageToken(offset, limit));
        }

        if(pageToken!=null){
            devicesResponseBodyVO.setPrevPageToken(OffsetUtil.generateDeviceQueryPrevPageToken(offset, limit));
        }

        List<DeletedDeviceVO> devices = new LinkedList<>();
        for(DeletedDeviceDVO dvo : deviceDVOs){
            devices.add(new DeletedDeviceVO.Builder().withDeletedDeviceQueryDVO(dvo).build());
        }

        return devicesResponseBodyVO.setDevices(devices);
    }

    public SummarizedDeviceInfoResponseBodyVO summarize(String domainId, String workspaceId) {

        List<SummarizedDeviceInfoResponseBodyVO.SummarizedDeviceInfo> devices = summarizedDevices(domainId, workspaceId);
        int totalCount = 0;
        for(SummarizedDeviceInfoResponseBodyVO.SummarizedDeviceInfo sDevice : devices){
            totalCount += sDevice.getDeviceCount();
        }


        List<SummarizedDeviceInfoResponseBodyVO.SummarizedRegisteredAtInfo> registrations = summarizedRegistrations(workspaceId);

        List<SummarizedDeviceInfoResponseBodyVO.SummarizedTagInfo> tags = summarizedTags(workspaceId);

        return new SummarizedDeviceInfoResponseBodyVO()
                .setDevices(devices)
                .setRegistrations(registrations)
                .setTags(tags)
                .setDeviceCount(totalCount);
    }

    private List<SummarizedDeviceInfoResponseBodyVO.SummarizedDeviceInfo> summarizedDevices(String domainId, String workspaceId) {
        List<SummarizedDeviceDVO> summarizedDeviceDVOs = deviceDAO.countDevicesPerModelSalesCodeFirmwareVersionByDomainIdWorkspaceId(domainId, workspaceId);
        if(summarizedDeviceDVOs == null) {
            return null;
        }

        Map<String, SummarizedDeviceInfoResponseBodyVO.SummarizedDeviceInfo> modelSalesCodeToSummarized = new HashMap<>();

        for (SummarizedDeviceDVO sDeviceDVO : summarizedDeviceDVOs){
            if(false == modelSalesCodeToSummarized.containsKey(sDeviceDVO.getModel() + sDeviceDVO.getSalesCode())){
                modelSalesCodeToSummarized.put(sDeviceDVO.getModel() + sDeviceDVO.getSalesCode(),
                        new SummarizedDeviceInfoResponseBodyVO.SummarizedDeviceInfo()
                        .setModel(sDeviceDVO.getModel())
                        .setSalesCode(sDeviceDVO.getSalesCode())
                        .setFirmwares(new ArrayList<>()));
            }
            modelSalesCodeToSummarized.get(sDeviceDVO.getModel() + sDeviceDVO.getSalesCode()).getFirmwares()
                    .add(new SummarizedDeviceInfoResponseBodyVO.SummarizedFirmwareInfo()
                            .setFirmwareId(sDeviceDVO.getFirmwareId())
                            .setFirmwareVersion(sDeviceDVO.getFirmwareVersion())
                            .setOsVersion(sDeviceDVO.getOsVersion())
                            .setSecurityPatchDate(sDeviceDVO.getSecurityPatchVersion())
                            .setDeviceCount(sDeviceDVO.getCount()));
        }
        List<SummarizedDeviceInfoResponseBodyVO.SummarizedDeviceInfo> summarizedDeviceInfoList = new ArrayList<>();

        for(SummarizedDeviceInfoResponseBodyVO.SummarizedDeviceInfo eachSummarizedDeviceInfo : modelSalesCodeToSummarized.values()) {
            int deviceCountOfThisHardware = 0;
            for(SummarizedDeviceInfoResponseBodyVO.SummarizedFirmwareInfo eachFirmwareInfoOfThisHardware : eachSummarizedDeviceInfo.getFirmwares() ){
                deviceCountOfThisHardware += eachFirmwareInfoOfThisHardware.getDeviceCount();
            }
            eachSummarizedDeviceInfo.setDeviceCount(deviceCountOfThisHardware);
            summarizedDeviceInfoList.add(eachSummarizedDeviceInfo);
        }

        return summarizedDeviceInfoList;
    }

    private List<SummarizedDeviceInfoResponseBodyVO.SummarizedRegisteredAtInfo> summarizedRegistrations(String workspaceId) {
        List<SummarizedDeviceInfoResponseBodyVO.SummarizedRegisteredAtInfo> registrations = new ArrayList<>();
        List<SummarizedRegisteredTimestampDVO> summarizedRegisteredTimestampDVOs = deviceDAO.countDevicesPerRegisteredTimeRegistrantByWorkspaceId(workspaceId);
        if(summarizedRegisteredTimestampDVOs != null){
            for(SummarizedRegisteredTimestampDVO sRegisteredTimestampDVO : summarizedRegisteredTimestampDVOs){
                registrations.add(new SummarizedDeviceInfoResponseBodyVO.SummarizedRegisteredAtInfo()
                        .setRegisterer(sRegisteredTimestampDVO.getRegisterer())
                        .setRegisteredAt(sRegisteredTimestampDVO.getRegisteredTimestamp().getTime())
                        .setDeviceCount(sRegisteredTimestampDVO.getCount()));
            }
        }

        return registrations;
    }

    private List<SummarizedDeviceInfoResponseBodyVO.SummarizedTagInfo> summarizedTags(String workspaceId) {
        List<SummarizedDeviceInfoResponseBodyVO.SummarizedTagInfo> tags = new ArrayList<>();
        List<SummarizedTagDVO> summarizedTagDVOs = deviceDAO.countDevicesPerTagByWorkspaceId(workspaceId);
        if(summarizedTagDVOs != null) {
            for (SummarizedTagDVO sTagDVO : summarizedTagDVOs) {
                tags.add(new SummarizedDeviceInfoResponseBodyVO.SummarizedTagInfo()
                        .setTag(sTagDVO.getTag())
                        .setDeviceCount(sTagDVO.getCount()));
            }
        }

        return tags;
    }

    /**
     * [Status Change]
     *  - Not enrolled -> Enrollment Pending
     * @param domainId
     * @param userId
     * @param requestBodyVO
     * @return
     */
    public DevicesWithFailsResponseBodyVO enrollDevices(String domainId, String workspaceId, String userId, EnrollDeviceRequestBodyVO requestBodyVO) throws ZeusException {
        licenseEvaluator.checkActiveLicense(domainId);

        List<FailedDeviceIdResponseVO> fails = new ArrayList<>();

        List<DeviceDVO> deviceDVOs = deviceDAO.getDevices(workspaceId, userId, requestBodyVO.getDeviceIds());
        fails.addAll(failsWhenDeviceNotExists(requestBodyVO.getDeviceIds(), deviceDVOs));

        Map<String, FailedResponseVO> failedToEnroll = deviceManageService.enroll(domainId, workspaceId, userId, deviceDVOs, false, DEVICE_CAMPAIGN_NOT_ASSIGNED);

        List<DeviceWithRelatedJoinDVO> resultDeviceDVOs = deviceDAO.getDevicesWithCampaignFirmwareTagInfo(domainId, workspaceId, userId, requestBodyVO.getDeviceIds());
        List<DeviceVO> devices = new LinkedList<DeviceVO>();
        for(DeviceWithRelatedJoinDVO dvo : resultDeviceDVOs){
            devices.add(new DeviceVO.Builder().withDeviceQueryDJVO(dvo).build());
        }

        for(Map.Entry<String, FailedResponseVO> entry : failedToEnroll.entrySet()){
            fails.add( (new FailedDeviceIdResponseVO()).setDeviceId(entry.getKey()).setFail(new FailedResponseVO()));
        }

        DevicesWithFailsResponseBodyVO response= new DevicesWithFailsResponseBodyVO().setDevices(devices).setFails(fails);

        activityHistoryInserter.insertDeviceHistories(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.ENROLL_DEVICE,
                getLoggedDetailListFromDevicesWithFailsResponseBodyVO(response));


        deviceHistoryInserter.insertConsoleHistoryWithEnrollmentStatus(MDC.get(THREAD_CONTEXT_REQUEST_ID), workspaceId, new ArrayList<>(Sets.difference(new HashSet<>(requestBodyVO.getDeviceIds()), failedToEnroll.keySet())),ZeusHistoryConstants.Action.ENROLL_DEVICE);


        return response;
    }

    private List<FailedDeviceIdResponseVO> failsWhenDeviceNotExists(List<String> deviceIds, List<DeviceDVO> existDevices) {
        if(existDevices.size() != deviceIds.size()){
            List<FailedDeviceIdResponseVO> fails = new ArrayList<>();

            Set<String> deviceIdsExists = existDevices.stream().map(v -> v.getDeviceId()).collect(Collectors.toSet());
            for(String deviceId : deviceIds) {
                if( deviceIdsExists.contains(deviceId) == false){
                    fails.add((new FailedDeviceIdResponseVO()).setDeviceId(deviceId).setFail(new FailedResponseVO()
                            .setFailCode(ApiSpecConstants.DEVICE_FAIL_CODE_INVALID_STATUS)
                            .setFailMessage(ApiSpecConstants.DEVICE_FAIL_MSG_INVALID_STATUS)));
                }
            }

            return fails;
        }

        return Collections.emptyList();
    }

    /**
     * [Status Change]
     *  - Enrolled -> Unenrollment Pending
     *  - Enrollment Pending -> Not enrolled
     * @param domainId
     * @param userId
     * @param requestBodyVO
     * @return
     * @throws ZeusException
     */
    public DevicesWithFailsResponseBodyVO unenrollDevices(String domainId, String workspaceId, String userId, UnenrollDeviceRequestBodyVO requestBodyVO) throws ZeusException {
        List<FailedDeviceIdResponseVO> fails = new ArrayList<>();

        List<DeviceDVO> deviceDVOs = deviceDAO.getDevices(workspaceId, userId, requestBodyVO.getDeviceIds());
        fails.addAll(failsWhenDeviceNotExists(requestBodyVO.getDeviceIds(), deviceDVOs));

        Map<String, FailedResponseVO> failedToUnenroll = deviceManageService.unenroll(workspaceId, userId, deviceDVOs);

        List<DeviceWithRelatedJoinDVO> resultDeviceDVOs = deviceDAO.getDevicesWithCampaignFirmwareTagInfo(domainId, workspaceId, userId, requestBodyVO.getDeviceIds());
        List<DeviceVO> devices = new LinkedList<DeviceVO>();
        for(DeviceWithRelatedJoinDVO dvo : resultDeviceDVOs){
            devices.add(new DeviceVO.Builder().withDeviceQueryDJVO(dvo).build());
        }

        for(Map.Entry<String, FailedResponseVO> entry : failedToUnenroll.entrySet()){
            fails.add( (new FailedDeviceIdResponseVO()).setDeviceId(entry.getKey()).setFail(new FailedResponseVO()));
        }

        DevicesWithFailsResponseBodyVO response= new DevicesWithFailsResponseBodyVO().setDevices(devices).setFails(fails);

        activityHistoryInserter.insertDeviceHistories(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.UNENROLL_DEVICE,
                getLoggedDetailListFromDevicesWithFailsResponseBodyVO(response));

        deviceHistoryInserter.insertConsoleHistoryWithEnrollmentStatus(
                MDC.get(THREAD_CONTEXT_REQUEST_ID),
                workspaceId,
                new ArrayList<>(Sets.difference(new HashSet<>(requestBodyVO.getDeviceIds()), response.getFails().stream().map(each->each.getDeviceId()).collect(Collectors.toSet()))),
                ZeusHistoryConstants.Action.UNENROLL_DEVICE);

        return response;
    }

    @Transactional(
            transactionManager = "zeusTransactionManager",
            propagation = Propagation.REQUIRED,
            isolation = Isolation.REPEATABLE_READ,
            rollbackFor = Exception.class)
    public void manageTags(
            String domainId, String workspaceId, String userId, ManageTagsRequestBodyVO requestBodyVO)
            throws ZeusException {

        List<DeviceDVO> successfulDeviceDVOs = deviceManageService.manageTags(domainId, workspaceId, userId, requestBodyVO);

        DevicesWithFailsResponseBodyVO devicesWithFailsResponseBodyVO = new DevicesWithFailsResponseBodyVO();
        successfulDeviceDVOs.forEach(eachDeviceDVO -> devicesWithFailsResponseBodyVO.getDevices().add(new DeviceVO.Builder().setDeviceId(eachDeviceDVO.getDeviceId()).setImei(eachDeviceDVO.getImei()).setMeid(eachDeviceDVO.getMeid()).setSerialNumber(eachDeviceDVO.getSerialNumber()).build()));

        activityHistoryInserter.insertDeviceHistoryOfManageTags(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.MANAGE_DEVICE_TAG,
                requestBodyVO.getTags(),
                requestBodyVO.getOverwrite(),
                getLoggedDetailListFromDevicesWithFailsResponseBodyVO(devicesWithFailsResponseBodyVO));

        deviceHistoryInserter.insertConsoleHistoryWithTags(
                MDC.get(THREAD_CONTEXT_REQUEST_ID),
                workspaceId,
                successfulDeviceDVOs.stream().map(DeviceDVO::getDeviceId).collect(Collectors.toList()),
                ZeusHistoryConstants.Action.MANAGE_DEVICE_TAG);

    }

    public DevicesWithFailsResponseBodyVO deleteDevices(String domainId, String workspaceId, String userId, DeleteDeviceRequestBodyVO requestBodyVO) throws ZeusException {
        List<DeviceDVO> deviceDVOs = deviceDAO.getDevices(workspaceId, userId, requestBodyVO.getDeviceIds());

        Map<String, FailedResponseVO> failedToUnenroll = deviceManageService.delete(workspaceId, userId, deviceDVOs);

        List<DeviceWithRelatedJoinDVO> resultDeviceDVOs = deviceDAO.getDevicesIncludingDeletedDevicesWithCampaignFirmwareTagInfo(domainId, workspaceId, userId, requestBodyVO.getDeviceIds());

        List<DeviceVO> devices = new LinkedList<>();
        for(DeviceWithRelatedJoinDVO dvo : resultDeviceDVOs){
            devices.add(new DeviceVO.Builder().withDeviceQueryDJVO(dvo).build());
        }

        List<FailedDeviceIdResponseVO> fails = new ArrayList<>();
        for(Map.Entry<String, FailedResponseVO> entry : failedToUnenroll.entrySet()){
            fails.add( (new FailedDeviceIdResponseVO()).setDeviceId(entry.getKey()).setFail(new FailedResponseVO()));
        }

        DevicesWithFailsResponseBodyVO response= new DevicesWithFailsResponseBodyVO().setDevices(devices).setFails(fails);

        activityHistoryInserter.insertDeviceHistories(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.DELETE_DEVICE,
                getLoggedDetailListFromDevicesWithFailsResponseBodyVO(response));

        deviceHistoryInserter.insertConsoleHistoryWithEnrollmentStatus(
                MDC.get(THREAD_CONTEXT_REQUEST_ID),
                workspaceId,
                new ArrayList<>(Sets.difference(new HashSet<>(requestBodyVO.getDeviceIds()), response.getFails().stream().map(each->each.getDeviceId()).collect(Collectors.toSet()))),
                ZeusHistoryConstants.Action.DELETE_DEVICE);


        return response;
    }

    public DevicesWithFailsResponseBodyVO assignToCampaign(String domainId, String workspaceId, String userId, AssignToCampaignRequestBodyVO requestBodyVO) throws ZeusException {

        licenseEvaluator.checkActiveLicense(domainId);

        List<FailedDeviceIdResponseVO> fails = new ArrayList<>();

        List<DeviceDVO> deviceDVOs = deviceDAO.getDevices(workspaceId, userId, requestBodyVO.getDeviceIds());
        fails.addAll(failsWhenDeviceNotExists(requestBodyVO.getDeviceIds(), deviceDVOs));

        CampaignDVO campaignDVO = campaignDAO.selectCampaign(workspaceId,requestBodyVO.getCampaignId());
        if (false == DEVICE_CAMPAIGN_NOT_ASSIGNED.equals(requestBodyVO.getCampaignId())) {

            if(campaignDVO ==null){
                throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND,"campaignId");
            }
        }

        Map<String, FailedResponseVO> failedToAssignToCampaign= deviceManageService.assignToCampaign(domainId, workspaceId, userId, deviceDVOs, requestBodyVO.getCampaignId());

        List<DeviceWithRelatedJoinDVO> resultDeviceDVOs = deviceDAO.getDevicesWithCampaignFirmwareTagInfo(domainId, workspaceId, userId, requestBodyVO.getDeviceIds());

        List<DeviceVO> devices = new LinkedList<>();
        for(DeviceWithRelatedJoinDVO dvo : resultDeviceDVOs){
            devices.add(new DeviceVO.Builder().withDeviceQueryDJVO(dvo).build());
        }

        for(Map.Entry<String, FailedResponseVO> entry : failedToAssignToCampaign.entrySet()){
            fails.add( (new FailedDeviceIdResponseVO()).setDeviceId(entry.getKey()).setFail(new FailedResponseVO()));
        }

        DevicesWithFailsResponseBodyVO response= new DevicesWithFailsResponseBodyVO().setDevices(devices).setFails(fails);

        activityHistoryInserter.insertDeviceHistoryOfAssignCampaign(
                workspaceId,
                userId,
                ZeusHistoryConstants.Action.ASSIGN_CAMPAIGN,
                requestBodyVO.getCampaignId(),
                campaignDVO != null ? campaignDVO.getCampaignName() : null,
                getLoggedDetailListFromDevicesWithFailsResponseBodyVO(response));

        deviceHistoryInserter.insertConsoleHistoryWithEnrollmentStatusCampaign(
                MDC.get(THREAD_CONTEXT_REQUEST_ID),
                workspaceId,
                new ArrayList<>(Sets.difference(new HashSet<>(requestBodyVO.getDeviceIds()), response.getFails().stream().map(each->each.getDeviceId()).collect(Collectors.toSet()))),
                ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED.equals(requestBodyVO.getCampaignId())?ZeusHistoryConstants.Action.UNASSIGN_CAMPAIGN:ZeusHistoryConstants.Action.ASSIGN_CAMPAIGN);

        return response;
    }

    public DeviceVO readDevice(String domainId, String workspaceId, String userId, String deviceId) throws ZeusException {
        DeviceWithRelatedJoinDVO deviceDVO = deviceDAO.getDeviceIncludingDeletedDevicesWithCampaignFirmwareTagInfo(domainId, deviceId);
        if(deviceDVO == null ){
            LOGGER.error("Does not exist!, deviceId:{}", deviceId);
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "Device");
        }

        return new DeviceVO.Builder().withDeviceQueryDJVO(deviceDVO).build();
    }

    public HistoryResponseBodyVO getDeviceHistory(
            String domainId,
            String workspaceId,
            String userId,
            String deviceId,
            Integer limit,
            String pageToken,
            DeviceHistoryRequestBodyVO requestBodyVO)
            throws ZeusException {

        DeviceDVO deviceDVO = deviceDAO.getDevice(deviceId);
        if (deviceDVO == null) {
            throw new ZeusException(ZeusResultCode.RESOURCE_NOT_FOUND, "deviceId");
        }

        Integer offset = OffsetUtil.convertHistoryPageTokenIntoOffset(pageToken);

        List<DeviceHistoryTempColumnAppendDVO> deviceHistoryDVOList =
                historyDAO.listDeviceHistoryWithActivityHistory(
                        workspaceId,
                        deviceId,
                        limit + OffsetUtil.HAS_NEXT_CHECKER,
                        offset,
                        requestBodyVO.getOrderBy());

        HistoryResponseBodyVO historyResponseBodyVO = new HistoryResponseBodyVO();

        if (OffsetUtil.containsMoreResultsNotShownYet(deviceHistoryDVOList.size(), limit)) {
            historyResponseBodyVO.setNextPageToken(
                    OffsetUtil.generateDeviceHistoryNextPagetoken(offset, limit));
            deviceHistoryDVOList.remove(deviceHistoryDVOList.size() - 1);
        }
        if (pageToken != null) {
            historyResponseBodyVO.setPrevPageToken(
                    OffsetUtil.generateDeviceQueryPrevPageToken(offset, limit));
        }

        for (DeviceHistoryTempColumnAppendDVO eachHistory : deviceHistoryDVOList) {
            historyResponseBodyVO.addHistory(
                    new HistoryVO.Builder().withHistoryTempColumnAppendDVO(eachHistory).build());
        }

        return historyResponseBodyVO;
    }

    private List<List<String>> getLoggedDetailListFromDevicesWithFailsResponseBodyVO(
            DevicesWithFailsResponseBodyVO devicesWithFailsResponseBodyVO) {
        if (devicesWithFailsResponseBodyVO.getDevices() == null) {
            return Collections.emptyList();
        }

        Map<String, List<String>> deviceInfos = new HashMap<>();
        for (DeviceVO deviceVO : devicesWithFailsResponseBodyVO.getDevices()) {
            deviceInfos.put(
                    deviceVO.getDeviceId(),
                    Arrays.asList(
                            deviceVO.getDeviceId(),
                            deviceVO.getSerialNumber(),
                            deviceVO.getImei(),
                            deviceVO.getMeid()));
        }

        if (devicesWithFailsResponseBodyVO.getFails() == null) {
            return new ArrayList<>(deviceInfos.values());
        }

        List<String> failedList =
                devicesWithFailsResponseBodyVO.getFails().stream()
                        .map(FailedDeviceIdResponseVO::getDeviceId)
                        .collect(Collectors.toList());
        for (String failedDevice : failedList) {
            deviceInfos.remove(failedDevice);
        }

        return new ArrayList<>(deviceInfos.values());
    }
}
