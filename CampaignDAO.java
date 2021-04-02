package com.samsung.efota.zeus.core.database.dao;

import com.samsung.efota.zeus.core.common.ApiSpecConstants;
import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.ZeusDBValue;
import com.samsung.efota.zeus.core.database.zeus.vo.CampaignDVO;
import com.samsung.efota.zeus.core.database.zeus.vo.CampaignJoinDVO;
import com.samsung.efota.zeus.core.database.zeus.vo.DeviceDVO;
import com.samsung.efota.zeus.core.log.LogElapsed;
import com.samsung.efota.zeus.core.util.ObjectUtil;
import com.samsung.efota.zeus.core.vo.httpbody.request.CampaignIdQueryRequestBodyVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;

import java.lang.invoke.MethodHandles;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;

@Component
public class CampaignDAO {
    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private static String[] noCountDeviceStatus = {
        ApiSpecConstants.DEVICE_STATUS_DELETED, ApiSpecConstants.DEVICE_STATUS_DELETIONPENDING
    };
    @Qualifier("zeusSqlSessionTemplate")
    @Autowired
    SqlSessionTemplate zeusSqlSessionTemplate;

    @LogElapsed(methodName = "createCampaignDB")
    public CampaignDVO createCampaign(CampaignDVO campaignDVO) throws ZeusException {

        try {
            Integer result =
                    zeusSqlSessionTemplate.insert("zeusCampaignMapper.insertCampaign", campaignDVO);

            if (result != 1) {
                LOGGER.error("CreateCampaign Failed to insert, Data:{}", campaignDVO.toString());
                throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
            }
        } catch (DuplicateKeyException duplicateKeyException) {
            LOGGER.error(
                    "createCampaign - Duplicate key exception. Data:{}", campaignDVO.toString());
            throw new ZeusException(ZeusResultCode.CAMPAIGN_NAME_DUPLICATED);
        }

        return campaignDVO;
    }

    @LogElapsed(methodName = "updateCampaignDB")
    public CampaignDVO updateCampaign(String workspaceId, String campaignId, CampaignDVO campaignDVO)
            throws ZeusException {

        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        param.put("campaignDVO", campaignDVO);

        try {
            Integer result =
                    zeusSqlSessionTemplate.update("zeusCampaignMapper.updateCampaign", param);

            if (result != 1) {
                LOGGER.error("CreateCampaign Failed to insert, Data:{}", campaignDVO.toString());
                throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
            }
        } catch (DuplicateKeyException duplicateKeyException) {
            LOGGER.error(
                    "updateCampaign - Duplicate key exception. Data:{}", campaignDVO.toString());
            throw new ZeusException(ZeusResultCode.CAMPAIGN_NAME_DUPLICATED);
        }

        return campaignDVO;
    }

    @LogElapsed(methodName = "markCompletedPostProcessingDB")
    public boolean markCompletedPostProcessing(
            String workspaceId,
            String campaignId,
            String modifierId,
            LocalDate endDateCompletedPostProcessing)
            throws ZeusException {

        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        param.put("endDateCompletedPostProcessing", endDateCompletedPostProcessing);
        param.put("modifierId", modifierId);

        Integer result =
                zeusSqlSessionTemplate.update(
                        "zeusCampaignMapper.updateCompletedPostProcessing", param);

        return result == 1;
    }

    @LogElapsed(methodName = "listCampaignDB")
    public List<CampaignDVO> listCampaign(String workspaceId) {

        List<CampaignDVO> campaignDVO =
                zeusSqlSessionTemplate.selectList("zeusCampaignMapper.listCampaign", workspaceId);

        if (ObjectUtil.nullOrZeroLength(campaignDVO)) {
            return new ArrayList<>();
        }

        return campaignDVO;
    }

    @LogElapsed(methodName = "listCampaignWithDeviceCountDB")
    public List<CampaignJoinDVO> listCampaignWithDeviceCount(String workspaceId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("noCountDeviceStatusList", Arrays.asList(noCountDeviceStatus));
        List<CampaignJoinDVO> campaignDVO =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignMapper.listCampaignWithDeviceCount", param);

        if (ObjectUtil.nullOrZeroLength(campaignDVO)) {
            return new ArrayList<>();
        }
        return campaignDVO;
    }

    @LogElapsed(methodName = "selectCampaignDB")
    public CampaignDVO selectCampaign(String workspaceId, String campaignId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        CampaignDVO campaignDVO =
                zeusSqlSessionTemplate.selectOne("zeusCampaignMapper.selectCampaign", param);
        return campaignDVO;
    }

    @LogElapsed(methodName = "selectCampaignWithDeviceCountDB")
    public CampaignJoinDVO selectCampaignWithDeviceCount(String workspaceId, String campaignId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        param.put("noCountDeviceStatusList", Arrays.asList(noCountDeviceStatus));
        CampaignJoinDVO campaignDVO =
                zeusSqlSessionTemplate.selectOne(
                        "zeusCampaignMapper.selectCampaignWithDeviceCount", param);
        return campaignDVO;
    }

    @LogElapsed(methodName = "deleteCampaignDB")
    public int deleteCampaign(String workspaceId, String campaignId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        int result = zeusSqlSessionTemplate.delete("zeusCampaignMapper.deleteCampaign", param);
        return result;
    }

    @LogElapsed(methodName = "activateCampaignDB")
    public int activateCampaign(String workspaceId, String campaignId, String userId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        param.put(userId,userId);
        param.put("statusCode", ZeusDBValue.Campaign.Status.ACTIVE.getValue());
        int result =
                zeusSqlSessionTemplate.update("zeusCampaignMapper.updateCampaignStatusCode", param);
        return result;
    }

    @LogElapsed(methodName = "deactivateCampaignDB")
    public int deactivateCampaign(String workspaceId, String campaignId, String userId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        param.put(userId,userId);
        param.put("statusCode", ZeusDBValue.Campaign.Status.INACTIVE.getValue());
        int result =
                zeusSqlSessionTemplate.update("zeusCampaignMapper.updateCampaignStatusCode", param);
        return result;
    }

    public List<CampaignDVO> queryCampaignsReturningCampaignIdCampaignName(String workspaceId, CampaignIdQueryRequestBodyVO.Filters filters) {

        Map<String, Object> params = new HashMap<>();

        params.put("workspaceId", workspaceId);
        params.put("filter_names", filters.getNames());

        List<CampaignDVO> results =
                zeusSqlSessionTemplate.selectList("zeusCampaignMapper.queryCampaignsReturningCampaignIdCampaignName", params);

        return results;

    }
}
