package com.samsung.efota.zeus.core.database.dao;

import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.zeus.ZeusDBColumnValueConstants;
import com.samsung.efota.zeus.core.database.zeus.vo.CampaignTargetFirmwareDVO;
import com.samsung.efota.zeus.core.database.zeus.vo.CampaignTargetFirmwareJoinDVO;
import com.samsung.efota.zeus.core.log.LogElapsed;
import com.samsung.efota.zeus.core.util.ObjectUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CampaignTargetFirmwareDAO {

    @Qualifier("zeusSqlSessionTemplate")
    @Autowired
    SqlSessionTemplate zeusSqlSessionTemplate;




    @LogElapsed(methodName = "replaceCampaignTargetFirmwareDB")
    public void replaceCampaignTargetFirmware(
            String workspaceId,
            String campaignId,
            List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOList)
            throws ZeusException {

            deleteAllCampaignTargetFirmwares(workspaceId, campaignId);
            insertCampaignTargetFirmware(campaignTargetFirmwareDVOList);

    }

    @LogElapsed(methodName = "insertCampaignTargetFirmwareDB")
    public void insertCampaignTargetFirmware(
            List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOList) {
        if (ObjectUtil.nullOrZeroLength(campaignTargetFirmwareDVOList)) {
            return;
        }

        Map param = new HashMap();
        param.put("targets", campaignTargetFirmwareDVOList);
        Integer result =
                zeusSqlSessionTemplate.insert(
                        "zeusCampaignTargetFirmwareMapper.insertCampaignTargetFirmware",
                        campaignTargetFirmwareDVOList);
    }

    @LogElapsed(methodName = "listWorkspaceTargetFirmwareDB")
    public List<CampaignTargetFirmwareDVO> listWorkspaceTargetFirmware(String workspaceId) {

        List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOList =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignTargetFirmwareMapper.listWorkspaceTargetFirmware", workspaceId);

        if (ObjectUtil.nullOrZeroLength(campaignTargetFirmwareDVOList)) {
            return new ArrayList<>();
        }
        return campaignTargetFirmwareDVOList;
    }

    @LogElapsed(methodName = "listDomainTargetFirmwareWithFwDetailDB")
    public List<CampaignTargetFirmwareJoinDVO> listDomainTargetFirmwareWithFwDetail(
            String domainId, String workspaceId) {

        Map param = new HashMap();
        param.put("domainId", domainId);
        param.put("workspaceId", workspaceId);

        List<CampaignTargetFirmwareJoinDVO> campaignTargetFirmwareDVOList =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignTargetFirmwareMapper.listDomainTargetFirmwareWithFwDetail",
                        param);

        if (ObjectUtil.nullOrZeroLength(campaignTargetFirmwareDVOList)) {
            return new ArrayList<>();
        }

        return campaignTargetFirmwareDVOList;
    }

    @LogElapsed(methodName = "selectTargetFirmwareDB")
    public CampaignTargetFirmwareDVO selectTargetFirmware(
            String workspaceId, String campaignId, String model, String salesCode) {

        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        param.put("model", model);
        param.put("salesCode", salesCode);

        CampaignTargetFirmwareDVO campaignTargetFirmwareDVO =
                zeusSqlSessionTemplate.selectOne(
                        "zeusCampaignTargetFirmwareMapper.selectTargetFirmware", param);
        return campaignTargetFirmwareDVO;
    }

    @LogElapsed(methodName = "selectTargetFirmwareWithFwDetailDB")
    public CampaignTargetFirmwareJoinDVO selectTargetFirmwareWithFwDetail(
            String domainId, String workspaceId, String campaignId, String model, String salesCode) {

        if (campaignId == null
                || ZeusDBColumnValueConstants.DEVICE_CAMPAIGN_NOT_ASSIGNED.equals(campaignId)
                        == true) {
            return null;
        }

        Map param = new HashMap();
        param.put("domainId", domainId);
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        param.put("model", model);
        param.put("salesCode", salesCode);

        CampaignTargetFirmwareJoinDVO campaignTargetFirmwareJoinDVO =
                zeusSqlSessionTemplate.selectOne(
                        "zeusCampaignTargetFirmwareMapper.selectTargetFirmwareWithFwDetail", param);
        return campaignTargetFirmwareJoinDVO;
    }

    @LogElapsed(methodName = "selectAllTargetFirmwareWithTargetTypeDB")
    public List<CampaignTargetFirmwareDVO> selectAllTargetFirmware(
            String workspaceId, String model, String salesCode, String targetType) {

        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("model", model);
        param.put("salesCode", salesCode);
        param.put("targetType", targetType);

        List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOs =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignTargetFirmwareMapper.selectAllTargetFirmwareByModelSalesCodeTargetType",
                        param);
        return campaignTargetFirmwareDVOs;
    }

    @LogElapsed(methodName = "selectAllTargetFirmwareDB")
    public List<CampaignTargetFirmwareDVO> selectAllTargetFirmware(
            String workspaceId, String model, String salesCode) {

        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("model", model);
        param.put("salesCode", salesCode);

        List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOs =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignTargetFirmwareMapper.selectAllTargetFirmwareByModelSalesCode",
                        param);
        return campaignTargetFirmwareDVOs;
    }

    @LogElapsed(methodName = "selectAllCampaingTargetFirmwareDB")
    public List<CampaignTargetFirmwareDVO> selectAllCampaingTargetFirmware(
            String workspaceId, String campaignId) {

        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);

        List<CampaignTargetFirmwareDVO> campaignTargetFirmwareDVOList =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignTargetFirmwareMapper.selectAllCampaignTargetFirmware", param);
        return campaignTargetFirmwareDVOList;
    }

    @LogElapsed(methodName = "listCampaignTargetFirmwareWithFwDetailDB")
    public List<CampaignTargetFirmwareJoinDVO> listCampaignTargetFirmwareWithFwDetail(
            String domainId, String workspaceId, String campaignId) {

        Map param = new HashMap();
        param.put("domainId", domainId);
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);

        List<CampaignTargetFirmwareJoinDVO> campaignTargetFirmwareDVOList =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignTargetFirmwareMapper.listCampaignTargetFirmwareWithFwDetail",
                        param);
        return campaignTargetFirmwareDVOList;
    }

    @LogElapsed(methodName = "deleteAllCampaignTargetFirmwaresDB")
    public int deleteAllCampaignTargetFirmwares(String workspaceId, String campaignId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);

        int result =
                zeusSqlSessionTemplate.delete(
                        "zeusCampaignTargetFirmwareMapper.deleteAllCampaignTargetFirmwares", param);
        return result;
    }
}
