package com.samsung.efota.zeus.core.database.dao;

import com.samsung.efota.zeus.core.database.zeus.vo.ScenarioInfoDVO;
import com.samsung.efota.zeus.core.log.LogElapsed;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.lang.invoke.MethodHandles;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ScenarioListDAO {

    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Qualifier("zeusSqlSessionTemplate")
    @Autowired
    SqlSessionTemplate zeusSqlSessionTemplate;

    @LogElapsed(methodName = "selectScenarioListDB")
    public List<ScenarioInfoDVO> selectScenarioList(String domainId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);

        List<ScenarioInfoDVO> scenarioInfoDVOs =
                zeusSqlSessionTemplate.selectList("zeusScenarioMapper.selectScenarioList", params);

        return scenarioInfoDVOs;
    }

    @LogElapsed(methodName = "selectScenarioInfoDB")
    public ScenarioInfoDVO selectScenarioInfo(String domainId, String scenarioId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("scenarioId", scenarioId);

        return zeusSqlSessionTemplate.selectOne("zeusScenarioMapper.selectScenarioInfo", params);
    }

    @LogElapsed(methodName = "truncateScenarioTableDB")
    public void truncateScenarioTable() {
        zeusSqlSessionTemplate.delete("zeusScenarioMapper.truncateScenarioTable");
    }

    @LogElapsed(methodName = "truncateFirmwareTableDB")
    public void truncateFirmwareTable() {
        zeusSqlSessionTemplate.delete("zeusScenarioMapper.truncateFirmwareTable");
    }

    @LogElapsed(methodName = "truncateFirmwareDescriptionTableDB")
    public void truncateFirmwareDescriptionTable() {
        zeusSqlSessionTemplate.delete("zeusScenarioMapper.truncateFirmwareDescriptionTable");
    }
}
