package com.samsung.efota.zeus.core.controller.admin;

import com.samsung.efota.zeus.core.common.ApiSpecConstants;
import com.samsung.efota.zeus.core.common.CommonConstants;
import com.samsung.efota.zeus.core.common.DomainWorkspaceValidator;
import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.controller.DefaultExceptionController;
import com.samsung.efota.zeus.core.service.admin.CampaignService;
import com.samsung.efota.zeus.core.vo.httpbody.common.CampaignVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.CampaignIdQueryRequestBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.request.CampaignRequestBodyVONew;
import com.samsung.efota.zeus.core.vo.httpbody.request.CampaignWithActivateRequestBodyVONew;
import com.samsung.efota.zeus.core.vo.httpbody.response.CampaignIdResponseBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.CampaignListResponseBodyVO;
import com.samsung.efota.zeus.core.vo.httpbody.response.ModelSalesCodesWithCountResponseBodyVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.lang.invoke.MethodHandles;

@RestController
@RequestMapping(ApiSpecConstants.CONTEXT_ROOT_DFM_CORE + "/campaigns")
public class CampaignController extends DefaultExceptionController {
    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    final CampaignService campaignService;
    @Autowired DomainWorkspaceValidator domainWorkspaceValidator;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public CampaignListResponseBodyVO getCampaignList(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId) {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId,workspaceId);
        CampaignListResponseBodyVO campaignListResponseBodyVOList =
                campaignService.listCampaigns(domainId, workspaceId);
        return campaignListResponseBodyVOList;
    }

    @PostMapping()
    public CampaignVO createCampaign(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @Valid @RequestBody CampaignWithActivateRequestBodyVONew campaignRequestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId,workspaceId);
        return campaignService.createCampaign(domainId, workspaceId, userId, campaignRequestBodyVO);
    }

    @PatchMapping("/{campaignId}")
    public CampaignVO modifyCampaign(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @PathVariable("campaignId") String campaignId,
            @Valid @RequestBody CampaignRequestBodyVONew campaignRequestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId,workspaceId);
        return campaignService.updateCampaign(
                domainId, workspaceId, userId, campaignId, campaignRequestBodyVO);
    }

    @GetMapping("/{campaignId}")
    public CampaignVO getCampaign(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @PathVariable("campaignId") String campaignId)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId,workspaceId);
        return campaignService.getCampaign(domainId, workspaceId, campaignId);
    }

    @DeleteMapping("/{campaignId}")
    public void deleteCampaign(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @PathVariable("campaignId") String campaignId,
            @RequestParam(
                            value = ApiSpecConstants.PARAM_NAME_FORCE,
                            required = false,
                            defaultValue = "false")
                    boolean force)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId,workspaceId);
        campaignService.deleteCampaign(domainId, workspaceId, userId, campaignId, force);
    }

    @PostMapping("/{campaignId}/activate")
    public CampaignVO activateCampaign(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @PathVariable("campaignId") String campaignId)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId,workspaceId);
        CampaignVO campaignVO =
                campaignService.activateCampaign(domainId, workspaceId, userId, campaignId);
        return campaignVO;
    }

    @PostMapping("/{campaignId}/deactivate")
    public CampaignVO deactivateCampaign(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @PathVariable("campaignId") String campaignId)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId,workspaceId);
        CampaignVO campaignVO =
                campaignService.deactivateCampaign(domainId, workspaceId, userId, campaignId);
        return campaignVO;
    }

    @GetMapping("/{campaignId}/modelSalesCodes")
    public ModelSalesCodesWithCountResponseBodyVO getModelSalesCodes(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @PathVariable("campaignId") String campaignId)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId,workspaceId);
        ModelSalesCodesWithCountResponseBodyVO modelSalesCodesResponseVO =
                campaignService.getModelSalesCodes(domainId, workspaceId, campaignId);
        return modelSalesCodesResponseVO;
    }


    @PostMapping(
            value = "/query",
            params = "include=campaignId,name")
    public CampaignIdResponseBodyVO campaignIdQuery(
            @RequestHeader(ApiSpecConstants.HEADER_NAME_DOMAIN_ID) String domainId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_WORKSPACE_ID) String workspaceId,
            @RequestHeader(ApiSpecConstants.HEADER_NAME_USER_ID) String userId,
            @RequestBody CampaignIdQueryRequestBodyVO requestBodyVO)
            throws ZeusException {
        domainWorkspaceValidator.validateDomainAndWorkspace(domainId, workspaceId);
        return campaignService.queryCampaignId(workspaceId,requestBodyVO);
    }
}
