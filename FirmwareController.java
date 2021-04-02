package com.samsung.efota.zeus.core.controller.admin;

import com.samsung.efota.zeus.core.common.ApiSpecConstants;
import com.samsung.efota.zeus.core.common.DomainWorkspaceValidator;
import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.controller.DefaultExceptionController;
import com.samsung.efota.zeus.core.service.admin.FirmwareService;
import com.samsung.efota.zeus.core.service.admin.VersionService;
import com.samsung.efota.zeus.core.vo.httpbody.common.FirmwareVO;
import com.samsung.efota.zeus.core.vo.httpbody.common.ScenarioListVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.FirmwareUpdateRequestBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.MarkTestedRequestBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;


@RestController
@RequestMapping(ApiSpecConstants.CONTEXT_ROOT_DFM_CORE +"/firmwares")
public class FirmwareController extends DefaultExceptionController {

    @Autowired
    FirmwareService firmwareService;
    @Autowired
    DomainWorkspaceValidator domainWorkspaceValidator;
    @Autowired
    VersionService versionService;

    @GetMapping()
    public FirmwareListResponseBodyVO getFirmwareList(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @RequestParam(ApiSpecConstants.PARAM_NAME_MODEL) String model,
            @RequestParam(ApiSpecConstants.PARAM_NAME_SALESCODE) String salesCode,
            @RequestParam(value = ApiSpecConstants.PARAM_NAME_LANGUAGECODE, required = false,defaultValue = ApiSpecConstants.PARAM_VALUE_LANGUAGECODE_ENGLISH) String languageCode
//            @RequestParam(value = ApiSpecConstants.PARAM_NAME_MINIMUM_FIRMWARE_VERSION, required = false) String minFirmwareVersion
    ) throws ZeusException {

        domainWorkspaceValidator.validateDomain(domainId);

        return firmwareService.getFirmwareList(domainId, userId, model, salesCode, languageCode);
    }

    @GetMapping("/{firmwareId}")
    public FirmwareVO getFirmware(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @RequestParam(value = ApiSpecConstants.PARAM_NAME_LANGUAGECODE, required = false,defaultValue = ApiSpecConstants.PARAM_VALUE_LANGUAGECODE_ENGLISH) String languageCode,
            @PathVariable("firmwareId") Integer firmwareId
            ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return firmwareService.getFirmware(domainId, userId, firmwareId, languageCode);
    }

    @PutMapping("/{firmwareId}/tested")
    public FirmwareVO markTestedFirmware(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody MarkTestedRequestBodyVO markTestedRequestBodyVO,
            @RequestParam(value = ApiSpecConstants.PARAM_NAME_LANGUAGECODE, required = false,defaultValue = ApiSpecConstants.PARAM_VALUE_LANGUAGECODE_ENGLISH) String languageCode,
            @PathVariable("firmwareId") Integer firmwareId
            ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return firmwareService.markTested(domainId, userId, firmwareId, markTestedRequestBodyVO, languageCode);
    }

    @DeleteMapping("/{firmwareId}/tested")
    public FirmwareVO unmarkTestedFirmware(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @RequestParam(value = ApiSpecConstants.PARAM_NAME_LANGUAGECODE, required = false,defaultValue = ApiSpecConstants.PARAM_VALUE_LANGUAGECODE_ENGLISH) String languageCode,
            @PathVariable("firmwareId") Integer firmwareId
    ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return firmwareService.unmarkTested(domainId, userId, firmwareId, languageCode);
    }

    @GetMapping("/scenarios")
    public ScenarioListResponseBodyVO getScenarioList(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId
    ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return versionService.getScenarioList(domainId, userId);
    }

    @PostMapping("/generateSignedUrls")
    public GenerateSignedUrlResponseBodyVO generateSignedUrls(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody ScenarioListVO scenarioList
    ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return versionService.generateSignedUrls(scenarioList);
    }

    @PostMapping("/uploadFirmwareMeta")
    public Map uploadFirmwareMeta(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody FirmwareUpdateRequestBodyVO firmwareUpdateRequestBodyVO
    ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return versionService.uploadFirmwareMeta(domainId, userId, firmwareUpdateRequestBodyVO);
    }

    @GetMapping("/modelSalesCodes")
    public ModelSalesCodesResponseBodyVO getModelSalesCodes(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId
    ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return versionService.getModelSalesCodes(domainId, userId);
    }


    @PutMapping("/{firmwareId}/blocklisted")
    public FirmwareVO block(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @RequestParam(value = ApiSpecConstants.PARAM_NAME_LANGUAGECODE, required = false,defaultValue = ApiSpecConstants.PARAM_VALUE_LANGUAGECODE_ENGLISH) String languageCode,
            @PathVariable("firmwareId") Integer firmwareId
    ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return firmwareService.blacklisted(domainId, userId, firmwareId, languageCode);
    }

    @DeleteMapping("/{firmwareId}/blocklisted")
    public FirmwareVO unblock(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @RequestParam(value = ApiSpecConstants.PARAM_NAME_LANGUAGECODE, required = false,defaultValue = ApiSpecConstants.PARAM_VALUE_LANGUAGECODE_ENGLISH) String languageCode,
            @PathVariable("firmwareId") Integer firmwareId
    ) throws ZeusException {
        domainWorkspaceValidator.validateDomain(domainId);
        return firmwareService.unblacklisted(domainId, userId, firmwareId, languageCode);
    }
}
