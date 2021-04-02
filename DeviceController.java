package com.samsung.efota.zeus.core.controller.admin;

import com.samsung.efota.zeus.core.common.ApiSpecConstants;
import com.samsung.efota.zeus.core.common.CommonConstants;
import com.samsung.efota.zeus.core.common.DomainWorkspaceValidator;
import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.controller.DefaultExceptionController;
import com.samsung.efota.zeus.core.service.admin.DeviceService;
import com.samsung.efota.zeus.core.vo.httpbody.common.DeviceVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.*;
import com.samsung.efota.zeus.core.vo.httpbody.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(ApiSpecConstants.CONTEXT_ROOT_DFM_CORE + "/devices")
public class DeviceController extends DefaultExceptionController {

    @Autowired DeviceService deviceService;
    @Autowired DomainWorkspaceValidator domainWorkspaceValidator;

    @PostMapping(
            value = "/query",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public DevicesResponseBodyVO queryDeviceList(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,

            @RequestParam(value = ApiSpecConstants.PARAM_NAME_PAGETOKEN, required = false)
                    String pageToken,
            @RequestParam(
                            value = ApiSpecConstants.PARAM_NAME_LIMIT,
                            required = false,
                            defaultValue = ApiSpecConstants.DEFAULT_VALUE_DEVICE_QUERY_LIMIT)
                    Integer limit,
            @Valid @RequestBody DeviceQueryRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);


        return deviceService.query(domainId, workspaceId, userId, requestBodyVO, pageToken, limit);
    }

    @PostMapping(
            value = "/trash/query",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public DeletedDevicesResponseBodyVO queryInTrash(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @RequestParam(value = ApiSpecConstants.PARAM_NAME_PAGETOKEN, required = false)
                    String pageToken,
            @RequestParam(
                            value = ApiSpecConstants.PARAM_NAME_LIMIT,
                            required = false,
                            defaultValue = ApiSpecConstants.DEFAULT_VALUE_DEVICE_QUERY_LIMIT)
                    Integer limit,
            @Valid @RequestBody QueryForDeletedDevicesRequestBodyVO requestBodyVO) {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        return deviceService.queryInTrash(
                domainId, workspaceId, userId, requestBodyVO, pageToken, limit);
    }

    @PostMapping(
            value = "/trash/valueGroups",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public ValueGroupInTrashResponseBodyVO valueGroupsInTrash(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        ValueGroupInTrashResponseBodyVO valueGroupInTrashResponseBodyVO =
                deviceService.listValueGroupsInTrash(domainId, workspaceId);
        return valueGroupInTrashResponseBodyVO;
    }

    @PostMapping(
            value = "/query",
            params = "include=deviceId,enrollmentStatus",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public DeviceIdResponseBodyVO deviceIdQuery(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody DeviceIdQueryRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);
        System.out.println("2  ===>");
        return deviceService.queryDeviceIds(domainId, workspaceId, userId, requestBodyVO);
    }

    @PostMapping(
            value = "/summarize",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public SummarizedDeviceInfoResponseBodyVO summarizeDevices(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        SummarizedDeviceInfoResponseBodyVO summarizedDeviceInfoResponseBodyVO =
                deviceService.summarize(domainId, workspaceId);

        return summarizedDeviceInfoResponseBodyVO;
    }

    @PostMapping("/enroll")
    public DevicesWithFailsResponseBodyVO enrollDevices(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody EnrollDeviceRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        return deviceService.enrollDevices(domainId, workspaceId, userId, requestBodyVO);
    }

    @PostMapping(
            value = "/unenroll",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public DevicesWithFailsResponseBodyVO unenrollDevices(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody UnenrollDeviceRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        return deviceService.unenrollDevices(domainId, workspaceId, userId, requestBodyVO);
    }

    @PostMapping(
            value = "/delete",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public DevicesWithFailsResponseBodyVO deleteDevices(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody DeleteDeviceRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        return deviceService.deleteDevices(domainId, workspaceId, userId, requestBodyVO);
    }

    @PostMapping(
            value = "/assignToCampaign",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public DevicesWithFailsResponseBodyVO assignDevicesToCampaign(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody AssignToCampaignRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        return deviceService.assignToCampaign(domainId, workspaceId, userId, requestBodyVO);
    }

    @PostMapping(
            value = "/manageTags",
            consumes = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON,
            produces = CommonConstants.HEADER_CONTENT_TYPE_APPLICATION_JSON)
    public void manageTags(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody ManageTagsRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        deviceService.manageTags(domainId, workspaceId, userId, requestBodyVO);
    }

    @GetMapping("/{deviceId}")
    public DeviceVO getDevice(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @PathVariable("deviceId") String deviceId)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        return deviceService.readDevice(domainId, workspaceId, userId, deviceId);
    }

    @PostMapping("/{deviceId}/histories/query")
    public HistoryResponseBodyVO getDeviceHistory(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @PathVariable("deviceId") String deviceId,
            @RequestParam(
                            value = ApiSpecConstants.PARAM_NAME_LIMIT,
                            required = false,
                            defaultValue = ApiSpecConstants.DEFAULT_VALUE_DEVICE_HISTORY_LIMIT)
                    Integer limit,
            @RequestParam(value = ApiSpecConstants.PARAM_NAME_PAGETOKEN, required = false)
                    String pageToken,
            @Valid @RequestBody DeviceHistoryRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);

        return deviceService.getDeviceHistory(
                domainId, workspaceId, userId, deviceId, limit, pageToken, requestBodyVO);
    }
}
