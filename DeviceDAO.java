package com.samsung.efota.zeus.core.database.dao;

import com.samsung.efota.zeus.core.common.ApiSpecConstants;
import com.samsung.efota.zeus.core.common.ZeusApiSpec;
import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.zeus.ZeusDBColumnValueConstants;
import com.samsung.efota.zeus.core.database.zeus.vo.*;
import com.samsung.efota.zeus.core.log.LogElapsed;
import com.samsung.efota.zeus.core.util.DeviceUniqueStringUtil;
import com.samsung.efota.zeus.core.util.ObjectUtil;
import com.samsung.efota.zeus.core.vo.httpbody.request.DeviceIdQueryRequestBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.DeviceQueryRequestBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.QueryForDeletedDevicesRequestBodyVO;
import org.apache.commons.collections4.CollectionUtils;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.lang.invoke.MethodHandles;
import java.sql.Timestamp;
import java.util.*;

@Component
public class DeviceDAO {
    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Qualifier("zeusSqlSessionTemplate")
    @Autowired
    SqlSessionTemplate zeusSqlSessionTemplate;

    @LogElapsed(methodName = "insertDevicesDB")
    public void insertDevices(Collection<DeviceDVO> deviceDVOs) throws ZeusException {
        if (CollectionUtils.isEmpty(deviceDVOs)) {
            return;
        }

        try {
            Map<String, Object> params = new HashMap<>();
            params.put("deviceDVOs", deviceDVOs);
            zeusSqlSessionTemplate.insert("zeusDeviceMapper.insertDevices", params);
        } catch (DuplicateKeyException ex) {
            LOGGER.error("Duplicated Exception in enrollDevice : {}", ex.getMessage());
            throw new ZeusException(ZeusResultCode.DEVICE_IS_ALREADY_EXIST_ON_UPLOAD_ACTION);
        }
    }

    //    public DeviceDVO enrollDevice(DeviceDVO deviceDVO) {
    //        deviceDVO.setEnrollmentStatus(ApiSpecConstants.DEVICE_STATUS_ENROLLMENTPENDING);
    //        if(deviceDVO.getModel() == null){
    //            deviceDVO.setModel(ZeusDBColumnValueConstants.DEVICE_MODEL_NOT_SYNCED);
    //            deviceDVO.setSalesCode(ZeusDBColumnValueConstants.DEVICE_SALESCODE_NOT_SYNCED);
    //        }
    //
    //        try {
    //            Integer result =
    // zeusSqlSessionTemplate.insert("zeusDeviceMapper.insertDeviceAndReadRelatedInfo", deviceDVO);
    //            if (result == 0) {
    //                return null;
    //            }
    //        }catch(DuplicateKeyException ex){
    //            LOGGER.error("Duplicated Exception in enrollDevice : {}", ex.getMessage());
    //            return null;
    //        }
    //
    //        return deviceDVO;
    //    }

    // [NO NEED TO LOG ELAPSED]
    public List<DeviceDVO> getDevicesByUniqueString(
            String imei, String meid, String serialNumber) throws ZeusException {
        if (imei == null && meid == null && serialNumber == null) {
            return Collections.emptyList();
        }

        List<String> imeis =
                (imei == null || imei.isEmpty() ? Collections.emptyList() : Arrays.asList(imei));

        List<String> meids =
                (meid == null || meid.isEmpty() ? Collections.emptyList() : Arrays.asList(meid));

        List<String> serialNumbers =
                (serialNumber == null || serialNumber.isEmpty()
                        ? Collections.emptyList()
                        : Arrays.asList(serialNumber));

        return getDevicesByUniqueStrings(null, imeis, meids, serialNumbers);
    }

    @LogElapsed(methodName = "getDevicesByUniqueStringDB")
    public List<DeviceDVO> getDevicesByUniqueStrings(
            String workspaceId, List<String> imeis, List<String> meids, List<String> serialNumbers)
            throws ZeusException {
        if (imeis == null && meids == null && serialNumbers == null) {
            return Collections.emptyList();
        }

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("workspaceId", workspaceId);
        params.put("imeis", imeis);
        params.put("meids", meids);
        params.put("serialNumbers", serialNumbers);

        List<DeviceDVO> deviceDVO =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.getDevicesByUniqueString", params);

        return deviceDVO;
    }

    @LogElapsed(methodName = "updateCampaignIdEnrollmentStatusUpdateStatusDB")
    public void updateCampaignIdEnrollmentStatusUpdateStatus(
            String workspaceId,
            String userId,
            List<String> deviceIds,
            String campaignId,
            String enrollmentStatus,
            String updateStatus)
            throws ZeusException {
        if (deviceIds == null || deviceIds.size() == 0) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("modifier", userId);
        params.put("deviceIds", deviceIds);
        params.put("campaignId", campaignId);
        params.put("enrollmentStatus", enrollmentStatus);
        params.put("updateStatus", updateStatus);
        int result =
                zeusSqlSessionTemplate.update("zeusDeviceMapper.updateCampaignIdEnrollmentStatusUpdateStatus", params);
        if (result != deviceIds.size()) {
            LOGGER.error(
                    "deleteDevices Failed, WorkspaceId:{}, Data:{}",
                    workspaceId,
                    deviceIds.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "updateEnrollmentStatusUpdateStatusDB")
    public void updateEnrollmentStatusUpdateStatus(
            String workspaceId,
            String userId,
            List<String> deviceIds,
            String enrollmentStatus,
            String updateStatus)
            throws ZeusException {
        if (deviceIds == null || deviceIds.size() == 0) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("modifier", userId);
        params.put("deviceIds", deviceIds);
        params.put("enrollmentStatus", enrollmentStatus);
        params.put("updateStatus", updateStatus);
        int result = zeusSqlSessionTemplate.update("zeusDeviceMapper.updateEnrollmentStatusUpdateStatus", params);
        if (result != deviceIds.size()) {
            LOGGER.error(
                    "deleteDevices Failed, WorkspaceId:{}, Data:{}",
                    workspaceId,
                    deviceIds.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "updateEnrollmentStatusAsUnenrollmentPendingDB")
    public void updateEnrollmentStatusAsUnenrollmentPending(
            String workspaceId, String userId, List<String> deviceIds) throws ZeusException {
        if (deviceIds == null || deviceIds.size() == 0) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("modifier", userId);
        params.put("deviceIds", deviceIds);
        params.put("enrollmentStatus", ApiSpecConstants.DEVICE_STATUS_UNENROLLMENTPENDING);
        params.put("updateStatus", ZeusApiSpec.Device.UpdateStatus.NOT_READY.getValue());
        int result =
                zeusSqlSessionTemplate.update(
                        "zeusDeviceMapper.unenrollmentPendingDevices", params);
        if (result != deviceIds.size()) {
            LOGGER.error(
                    "deleteDevices Failed, WorkspaceId:{}, Data:{}",
                    workspaceId,
                    deviceIds.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "updateEnrollmentStatusAsNotEnrolledDB")
    public void updateEnrollmentStatusAsNotEnrolled(String workspaceId, String userId, List<String> deviceIds)
            throws ZeusException {
        if (deviceIds == null || deviceIds.size() == 0) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("modifier", userId);
        params.put("deviceIds", deviceIds);
        params.put("enrollmentStatus", ApiSpecConstants.DEVICE_STATUS_NOTENROLLED);
        params.put("updateStatus", ZeusApiSpec.Device.UpdateStatus.DELETED.getValue());
        params.put("campaignId", ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED);

        int result = zeusSqlSessionTemplate.update("zeusDeviceMapper.notEnrolledDevices", params);
        if (result != deviceIds.size()) {
            LOGGER.error(
                    "deleteDevices Failed, WorkspaceId:{}, Data:{}",
                    workspaceId,
                    deviceIds.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "notEnrolledDeviceDB")
    public void updateEnrollmentStatusAsNotEnrolled(String deviceId) throws ZeusException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("enrollmentStatus", ApiSpecConstants.DEVICE_STATUS_NOTENROLLED);
        params.put("updateStatus", ZeusApiSpec.Device.UpdateStatus.DELETED.getValue());
        params.put("campaignId", ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED);

        int result = zeusSqlSessionTemplate.update("zeusDeviceMapper.updateEnrollmentStatusUpdateStatusCampaignId", params);
        if (result != 1) {
            LOGGER.error("unregisterDevice Failed, deviceId:{}", deviceId);
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "deletedDevicesDB")
    public void updateEnrollmentStatusAsDeleted(
            String workspaceId, String userId, List<String> deviceIds, long deletionTimeMillis)
            throws ZeusException {
        if (deviceIds == null || deviceIds.size() == 0) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("modifier", userId);
        params.put("deviceIds", deviceIds);
        params.put("enrollmentStatus", ApiSpecConstants.DEVICE_STATUS_DELETED);
        params.put("deletedFlag", "Y" + deletionTimeMillis);
        params.put("deletedTimestamp", new Timestamp(deletionTimeMillis));
        params.put("updateStatus", ZeusApiSpec.Device.UpdateStatus.DELETED.getValue());
        params.put("campaignId", ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED);

        int result = zeusSqlSessionTemplate.update("zeusDeviceMapper.updateDevicesAsDeleted", params);
        if (result != deviceIds.size()) {
            LOGGER.error(
                    "deleteDevices Failed, WorkspaceId:{}, Data:{}",
                    workspaceId,
                    deviceIds.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "deletionPendingDevicesDB")
    public void updateEnrollmentStatusAsDeletionPending(
            String workspaceId, String userId, List<String> deviceIds, long deletionTimeMillis)
            throws ZeusException {
        if (deviceIds == null || deviceIds.size() == 0) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("modifier", userId);
        params.put("deviceIds", deviceIds);
        params.put("enrollmentStatus", ApiSpecConstants.DEVICE_STATUS_DELETIONPENDING);
        params.put("deletedFlag", "Y" + deletionTimeMillis);
        params.put("deletedTimestamp", new Timestamp(deletionTimeMillis));
        params.put("updateStatus", ZeusApiSpec.Device.UpdateStatus.DELETED.getValue());
        params.put("campaignId", ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED);

        int result = zeusSqlSessionTemplate.update("zeusDeviceMapper.updateDevicesAsDeleted", params);
        if (result != deviceIds.size()) {
            LOGGER.error(
                    "deleteDevices Failed, WorkspaceId:{}, Data:{}",
                    workspaceId,
                    deviceIds.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "updateEnrollmentStatusAsDeletedNotAffectingFlagsDB")
    public void updateEnrollmentStatusAsDeletedNotAffectingFlags(String deviceId) throws ZeusException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("enrollmentStatus", ApiSpecConstants.DEVICE_STATUS_DELETED);
        params.put("updateStatus", ZeusApiSpec.Device.UpdateStatus.DELETED.getValue());
        params.put("campaignId", ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED);

        int result = zeusSqlSessionTemplate.update("zeusDeviceMapper.updateEnrollmentStatusUpdateStatusCampaignId", params);
        if (result != 1) {
            LOGGER.error("unregisterDevice Failed, deviceId:{}", deviceId);
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "updateCampaignAndStatusDB")
    public void updateCampaignAndStatus(
            String workspaceId, String userId, List<DeviceDVO> deviceDVOs, String campaignId)
            throws ZeusException {
        if (deviceDVOs == null || deviceDVOs.size() == 0) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("modifier", userId);
        params.put("campaignId", campaignId);
        params.put("deviceDVOs", deviceDVOs);
        zeusSqlSessionTemplate.insert("zeusDeviceMapper.updateCampaignAndStatus", params);
    }

    @LogElapsed(methodName = "updateEnrollmentAndUpdateStatusDB")
    public void updateEnrollmentAndUpdateStatus(
            String workspaceId, String userId, List<DeviceDVO> deviceDVOs) throws ZeusException {
        if (deviceDVOs == null || deviceDVOs.size() == 0) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("modifier", userId);
        params.put("deviceDVOs", deviceDVOs);
        zeusSqlSessionTemplate.insert("zeusDeviceMapper.updateEnrollmentAndUpdateStatus", params);
    }

    @LogElapsed(methodName = "getDevice")
    public DeviceDVO getDevice(String deviceId) {
        DeviceDVO deviceDVO =
                zeusSqlSessionTemplate.selectOne("zeusDeviceMapper.getDevice", deviceId);
        return deviceDVO;
    }

    @LogElapsed(methodName = "getDevicesDB")
    public List<DeviceDVO> getDevices(String workspaceId, String userId, List<String> deviceIds) {
        if (deviceIds == null || deviceIds.size() == 0) {
            return Collections.emptyList();
        }
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("workspaceId", workspaceId);
        params.put("deviceIds", deviceIds);
        List<DeviceDVO> devices =
                zeusSqlSessionTemplate.selectList("zeusDeviceMapper.getDevices", params);

        if (devices == null) {
            return Collections.emptyList();
        }

        return devices;
    }

    @LogElapsed(methodName = "listDevicesByCampaignIdDB")
    public List<DeviceDVO> listDevicesByCampaignId(String workspaceId, String campaignId) {

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("workspaceId", workspaceId);
        params.put("campaignId", campaignId);
        List<DeviceDVO> devices =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.listDevicesByCampaignId", params);

        if (devices == null) {
            return Collections.emptyList();
        }

        return devices;
    }

    @LogElapsed(methodName = "listDevicesByCampaignIdModelSalesCodeDB")
    public List<DeviceDVO> listDevicesByCampaignIdModelSalesCode(
            String workspaceId, String campaignId, String model, String salesCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("workspaceId", workspaceId);
        params.put("campaignId", campaignId);
        params.put("model", model);
        params.put("salesCode", salesCode);
        List<DeviceDVO> devices =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.listDevicesByCampaignIdModelSalesCode", params);

        if (devices == null) {
            return Collections.emptyList();
        }

        return devices;
    }

    @LogElapsed(methodName = "listDevicesByWorkspaceIdDB")
    public List<DeviceDVO> listDevicesByWorkspaceId(String workspaceId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("workspaceId", workspaceId);
        List<DeviceDVO> devices =
                zeusSqlSessionTemplate.selectList("zeusDeviceMapper.listDevicesByWorkspaceId", params);

        if (devices == null) {
            return Collections.emptyList();
        }

        return devices;
    }

    @LogElapsed(methodName = "getDevicesWithCampaignFirmwareTagDB")
    public List<DeviceWithRelatedJoinDVO> getDevicesWithCampaignFirmwareTagInfo(
            String domainId, String workspaceId, String userId, List<String> deviceIds) {
        if (deviceIds == null || deviceIds.size() == 0) {
            return Collections.emptyList();
        }
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("workspaceId", workspaceId);
        params.put("deviceIds", deviceIds);
        List<DeviceWithRelatedJoinDVO> devices =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.getDevicesWithCampaignFirmwareTagInfo", params);
        return devices;
    }

    @LogElapsed(methodName = "getDevicesIncludingDeletedDevicesWithCampaignFirmwareTagInfoDB")
    public List<DeviceWithRelatedJoinDVO> getDevicesIncludingDeletedDevicesWithCampaignFirmwareTagInfo(
            String domainId, String workspaceId, String userId, List<String> deviceIds) {
        if (deviceIds == null || deviceIds.size() == 0) {
            return Collections.emptyList();
        }
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("workspaceId", workspaceId);
        params.put("deviceIds", deviceIds);
        List<DeviceWithRelatedJoinDVO> devices =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.getDevicesIncludingDeletedDevicesWithCampaignFirmwareTagInfo", params);
        return devices;
    }

    @LogElapsed(methodName = "getDeviceIncludingDeletedDevicesWithCampaignFirmwareTagInfoDB")
    public DeviceWithRelatedJoinDVO getDeviceIncludingDeletedDevicesWithCampaignFirmwareTagInfo(
            String domainId, String deviceId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("deviceId", deviceId);
        DeviceWithRelatedJoinDVO deviceDVO =
                zeusSqlSessionTemplate.selectOne(
                        "zeusDeviceMapper.getDeviceIncludingDeletedDevicesWithCampaignFirmwareTagInfo", params);
        return deviceDVO;
    }

    @LogElapsed(methodName = "registerDeviceDB")
    public void updateAgentDependentsUniqueStringsEnrollmentStatusAsEnrolled(String deviceId, AndroidMobileDVO androidMobileDVO) throws ZeusException {

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("enrollmentStatus", ApiSpecConstants.DEVICE_STATUS_ENROLLED);
        params.put("androidMobile", androidMobileDVO);

        int result = zeusSqlSessionTemplate.update("zeusDeviceMapper.updateAgentDependentsUniqueStringsEnrollmentStatus", params);
        if (result != 1) {
            LOGGER.error(
                    "registerDevice Failed, deviceId:{}, agent:{}", deviceId, androidMobileDVO.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "updateAgentDependentsDB")
    public void updateAgentDependents(String deviceId, AndroidMobileDVO androidMobileDVO) throws ZeusException {

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("androidMobile", androidMobileDVO);

        int result = zeusSqlSessionTemplate.update("zeusDeviceMapper.updateAgentDependents", params);
        if (result != 1) {
            LOGGER.error(
                    "updateDevice Failed, deviceId:{}, agent:{}", deviceId, androidMobileDVO.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "queryDB")
    public List<DeviceWithRelatedJoinDVO> query(
            String domainId,
            String workspaceId,
            String userId,
            DeviceQueryRequestBodyVO.Filters filters,
            List<DeviceQueryRequestBodyVO.OrderBy> orderBy,
            int limit,
            @Nullable Integer offset) {
        Map<String, Object> params = new HashMap<>();

        List<String> imeis = new ArrayList<>();
        List<String> meids = new ArrayList<>();
        List<String> sns = new ArrayList<>();

        if (filters.getDeviceUniqueStrings() != null) {
            for (String dus : filters.getDeviceUniqueStrings()) {
                if (DeviceUniqueStringUtil.isIMEIFormat(dus) == true) {
                    imeis.add(dus);
                } else if (DeviceUniqueStringUtil.isMEIDFormat(dus) == true) {
                    meids.add(dus);
                } else {
                    sns.add(dus);
                }
            }
        }

        List<Timestamp> registeredDates = new ArrayList<>();
        if (filters.getRegisteredAts() != null) {
            for (Long registeredDateVal : filters.getRegisteredAts()) {
                registeredDates.add(new Timestamp(registeredDateVal));
            }
        }

        List<String> updateStatuses = new ArrayList<>();
        if (filters.getUpdateStatuses() != null) {
            for (String updateStatus : filters.getUpdateStatuses()) {
                updateStatuses.add(updateStatus);
            }
        }

        params.put("domainId", domainId);
        params.put("workspaceId", workspaceId);
        params.put("filter_modelSalesCodes", filters.getModels());
        params.put("filter_DUS_imeis", imeis);
        params.put("filter_DUS_meids", meids);
        params.put("filter_DUS_sns", sns);
        params.put("filter_enrollmentStatuses", filters.getEnrollmentStatuses());
        params.put("filter_campaignIds", filters.getCampaignIds());
        params.put("filter_firmwareVersions", filters.getFirmwareVersions());
        params.put("filter_tags", filters.getTags());
        params.put("filter_sources", filters.getSources());
        params.put("filter_registeredDates", registeredDates);
        params.put("filter_updateStatuses", updateStatuses);
        params.put("orderBys", orderBy);
        params.put("offset", offset == null ? 0 : offset);
        params.put("limit", limit);

        List<DeviceWithRelatedJoinDVO> results =
                zeusSqlSessionTemplate.selectList("zeusDeviceMapper.queryWithRelatedInfo", params);

        return results;
    }

    @LogElapsed(methodName = "queryForDeletedDevicesDB")
    public List<DeletedDeviceDVO> queryForDeletedDevices(
            String workspaceId,
            String userId,
            QueryForDeletedDevicesRequestBodyVO.Filters filters,
            List<DeviceQueryRequestBodyVO.OrderBy> orderBy,
            int limit,
            @Nullable Integer offset) {
        Map<String, Object> params = new HashMap<>();

        List<String> imeis = new ArrayList<>();
        List<String> meids = new ArrayList<>();
        List<String> sns = new ArrayList<>();
        if (filters.getDeviceUniqueStrings() != null) {
            for (String dus : filters.getDeviceUniqueStrings()) {
                if (DeviceUniqueStringUtil.isIMEIFormat(dus) == true) {
                    imeis.add(dus);
                } else if (DeviceUniqueStringUtil.isMEIDFormat(dus) == true) {
                    meids.add(dus);
                } else {
                    sns.add(dus);
                }
            }
        }

        params.put("workspaceId", workspaceId);
        params.put("filter_modelSalesCodes", filters.getModels());
        params.put("filter_DUS_imeis", imeis);
        params.put("filter_DUS_meids", meids);
        params.put("filter_DUS_sns", sns);
        params.put("filter_enrollmentStatuses", filters.getStatuses());
        params.put("filter_deleters", filters.getDeleters());
        params.put("orderBys", orderBy);
        params.put("offset", offset == null ? 0 : offset);
        params.put("limit", limit);

        List<DeletedDeviceDVO> results =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.queryForDeletedDevices", params);

        return results;
    }

    @LogElapsed(methodName = "getAllDeviceIdDB")
    public List<DeviceDVO> queryDevicesReturningDeviceIdEnrollmentStatus(
            String domainId, String workspaceId, DeviceIdQueryRequestBodyVO.Filters filters) {
        Map<String, Object> params = new HashMap<>();
        List<Timestamp> registeredDates = new ArrayList<>();

        params.put("domainId", domainId);
        params.put("workspaceId", workspaceId);
        params.put("filter_modelSalesCodes", filters.getModels());
        params.put("filter_campaignIds", filters.getCampaignIds());
        params.put("filter_enrollmentStatuses", filters.getEnrollmentStatuses());
        params.put("filter_firmwareVersions", filters.getFirmwareVersions());
        params.put("filter_tags", filters.getTags());
        params.put("filter_updateStatuses", filters.getUpdateStatuses());

        List<String> imeis = new ArrayList<>();
        List<String> meids = new ArrayList<>();
        List<String> sns = new ArrayList<>();
        if (filters.getDeviceUniqueStrings() != null) {
            for (String dus : filters.getDeviceUniqueStrings()) {
                if (DeviceUniqueStringUtil.isIMEIFormat(dus) == true) {
                    imeis.add(dus);
                } else if (DeviceUniqueStringUtil.isMEIDFormat(dus) == true) {
                    meids.add(dus);
                } else {
                    sns.add(dus);
                }
            }
        }
        params.put("filter_DUS_imeis", imeis);
        params.put("filter_DUS_meids", meids);
        params.put("filter_DUS_sns", sns);

        List<DeviceDVO> results =
                zeusSqlSessionTemplate.selectList("zeusDeviceMapper.getAllDeviceId", params);

        return results;
    }

    @LogElapsed(methodName = "countDevicesPerModelSalesCodeFirmwareVersionByDomainIdWorkspaceIdDB")
    public List<SummarizedDeviceDVO> countDevicesPerModelSalesCodeFirmwareVersionByDomainIdWorkspaceId(String domainId, String workspaceId) {
        Map<String, Object> params = new HashMap<>();
        params.put("domainId", domainId);
        params.put("workspaceId", workspaceId);

        List<SummarizedDeviceDVO> results =
                zeusSqlSessionTemplate.selectList("zeusDeviceMapper.countDevicesPerModelSalesCodeFirmwareVersionByDomainIdWorkspaceIdDB", params);
        if (ObjectUtil.nullOrZeroLength(results)) {
            return new ArrayList<>();
        }

        return results;
    }

    @LogElapsed(methodName = "countDevicesPerTagByWorkspaceIdDB")
    public List<SummarizedTagDVO> countDevicesPerTagByWorkspaceId(String workspaceId) {
        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);

        List<SummarizedTagDVO> results =
                zeusSqlSessionTemplate.selectList("zeusDeviceMapper.countDevicesPerTagByWorkspaceId", params);
        if (ObjectUtil.nullOrZeroLength(results)) {
            return new ArrayList<>();
        }
        return results;
    }

    @LogElapsed(methodName = "countDevicesPerRegisteredTimeRegistrantByWorkspaceIdDB")
    public List<SummarizedRegisteredTimestampDVO> countDevicesPerRegisteredTimeRegistrantByWorkspaceId(String workspaceId) {
        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);

        List<SummarizedRegisteredTimestampDVO> results =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.countDevicesPerRegisteredTimeRegistrantByWorkspaceIdDB", params);
        if (ObjectUtil.nullOrZeroLength(results)) {
            return new ArrayList<>();
        }
        return results;
    }

    @LogElapsed(methodName = "countDevicePerSingleCampaignTargetDB")
    public List<CampaignTargetDeviceCountDVO> countDevicePerSingleCampaignTarget(
            String workspaceId, String campaignId) {
        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("campaignId", campaignId);

        List<CampaignTargetDeviceCountDVO> results =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.countDevicePerSingleCampaignTarget", params);
        if (ObjectUtil.nullOrZeroLength(results)) {
            return new ArrayList<>();
        }
        return results;
    }

    @LogElapsed(methodName = "countDevicePerDomainCampaignTargetDB")
    public List<CampaignTargetDeviceCountDVO> countDevicePerDomainCampaignTarget(
            String workspaceId) {

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);

        List<CampaignTargetDeviceCountDVO> results =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.countDevicePerDomainCampaignTarget", params);
        if (ObjectUtil.nullOrZeroLength(results)) {
            return new ArrayList<>();
        }
        return results;
    }

    @LogElapsed(methodName = "countDevicesByWorkspaceIds")
    public int countDevicesByWorkspaceIds(List<String> workspaceIds) {

        if(CollectionUtils.isEmpty(workspaceIds)){
            return 0;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("workspaceIds", workspaceIds);

        int totalCount =
                zeusSqlSessionTemplate.selectOne(
                        "zeusDeviceMapper.countDevicesByWorkspaceIds", params);

        return totalCount;
    }

    @LogElapsed(methodName = "updateAgentProgressCodeDB")
    public void updateAgentProgressCode(String deviceId, String progressCode, String updateStatus)
            throws ZeusException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("deviceId", deviceId);
        params.put("progressCode", progressCode);
        params.put("updateStatus", updateStatus);

        int result =
                zeusSqlSessionTemplate.update("zeusDeviceMapper.updateAgentProgressCode", params);
        if (result != 1) {
            LOGGER.error("unregisterDevice Failed, deviceId:{}", deviceId);
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "countDevicePerModelSalesCodeInTrashDB")
    public List<ModelSalesCodeDeviceCountDVO> countDevicePerModelSalesCodeInTrash(
            String workspaceId) {
        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);

        List<ModelSalesCodeDeviceCountDVO> results =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.countDevicePerModelSalesCodeInTrash", params);
        if (ObjectUtil.nullOrZeroLength(results)) {
            return new ArrayList<>();
        }
        return results;
    }

    @LogElapsed(methodName = "countDevicePerDeleterInTrashDB")
    public List<UserDeviceCountDVO> countDevicePerDeleterInTrash(String workspaceId) {
        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);

        List<UserDeviceCountDVO> results =
                zeusSqlSessionTemplate.selectList(
                        "zeusDeviceMapper.countDevicePerDeleterInTrash", params);
        if (ObjectUtil.nullOrZeroLength(results)) {
            return new ArrayList<>();
        }
        return results;
    }




    public List<DeviceWithRelatedJoinDVO> getDevicesReturningEnrollmentStatusWithCampaignTagInfo(List<String> deviceIds) {
        if(CollectionUtils.isEmpty(deviceIds)){
            return Collections.emptyList();
        }

        Map<String, Object> params = new HashMap<>();
        params.put("deviceIds", deviceIds);
        List<DeviceWithRelatedJoinDVO> deviceDVOList =
                zeusSqlSessionTemplate.selectList("zeusDeviceMapper.getDevicesReturningEnrollmentStatusWithCampaignTagInfo", params);
        return deviceDVOList;
    }
}
