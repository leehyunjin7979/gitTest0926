package com.samsung.efota.zeus.core.database.dao;

import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.zeus.vo.CampaignScheduleCustomDVO;
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

import java.util.*;

@Component
public class CampaignScheduleCustomDAO {

    @Qualifier("zeusSqlSessionTemplate")
    @Autowired
    SqlSessionTemplate zeusSqlSessionTemplate;

    @LogElapsed(methodName = "insertCampaignScheduleCustomDB")
    public Integer insertCampaignScheduleCustom(
            List<CampaignScheduleCustomDVO> scheduleExceptionDVOList) {
        if (ObjectUtil.nullOrZeroLength(scheduleExceptionDVOList)) {
            return 0;
        }
        return zeusSqlSessionTemplate.insert(
                "zeusCampaignScheduleCustomMapper.insertCampaignScheduleCustom",
                scheduleExceptionDVOList);
    }

    @LogElapsed(methodName = "listCampaignScheduleCustomDB")
    public List<CampaignScheduleCustomDVO> listCampaignScheduleCustom(
            String workspaceId, String campaignId) {

        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        List<CampaignScheduleCustomDVO> campaignScheduleCustomDVOList =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignScheduleCustomMapper.listCampaignScheduleCustoms", param);

        if (ObjectUtil.nullOrZeroLength(campaignScheduleCustomDVOList)) {
            return new ArrayList<>();
        }

        return campaignScheduleCustomDVOList;
    }

    @LogElapsed(methodName = "deleteAllCampaignScheduleCustomDB")
    public int deleteAllCampaignScheduleCustom(String workspaceId, String campaignId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);

        int result =
                zeusSqlSessionTemplate.delete(
                        "zeusCampaignScheduleCustomMapper.deleteAllCampaignScheduleCustoms", param);
        return result;
    }

    @LogElapsed(methodName = "listDomainScheduleCustomDB")
    public List<CampaignScheduleCustomDVO> listDomainScheduleCustom(String workspaceId) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        List<CampaignScheduleCustomDVO> campaignScheduleCustomDVOList =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignScheduleCustomMapper.listDomainScheduleCustoms", param);

        if (ObjectUtil.nullOrZeroLength(campaignScheduleCustomDVOList)) {
            return new ArrayList<>();
        }

        return campaignScheduleCustomDVOList;
    }

    @LogElapsed(methodName = "selectCustomScheduleDaysDB")
    public List<CampaignScheduleCustomDVO> selectCustomScheduleDays(
            String workspaceId, String campaignId, List<String> targetDates) {
        Map param = new HashMap();
        param.put("workspaceId", workspaceId);
        param.put("campaignId", campaignId);
        param.put("targetDates", targetDates);
        List<CampaignScheduleCustomDVO> campaignScheduleCustomDVOList =
                zeusSqlSessionTemplate.selectList(
                        "zeusCampaignScheduleCustomMapper.selectCampaignScheduleCustoms", param);

        if (ObjectUtil.nullOrZeroLength(campaignScheduleCustomDVOList)) {
            return Collections.EMPTY_LIST;
        }

        return campaignScheduleCustomDVOList;
    }
}
