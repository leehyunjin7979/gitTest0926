package com.samsung.efota.zeus.core.database.dao;

import com.samsung.efota.zeus.core.database.zeus.vo.*;
import com.samsung.efota.zeus.core.log.LogElapsed;
import com.samsung.efota.zeus.core.util.ObjectUtil;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.lang.invoke.MethodHandles;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class FirmwareDAO {

    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Qualifier("zeusSqlSessionTemplate")
    @Autowired
    SqlSessionTemplate zeusSqlSessionTemplate;

    @LogElapsed(methodName = "listFirmwaresByModelSalesCodeDB")
    public List<FirmwareDVO> listFirmwaresByModelSalesCode(String domainId, String model, String salesCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("model", model);
        params.put("salesCode", salesCode);

        List<FirmwareDVO> firmwareDVOs =
                zeusSqlSessionTemplate.selectList("zeusFirmwareMapper.listFirmwaresByModelSalesCode", params);

        return firmwareDVOs;
    }

    @LogElapsed(methodName = "selectFirmwareInternalTestResultListDB")
    public List<FirmwareInternalTestResultDVO> selectFirmwareInternalTestResultList(
            String domainId, List<Integer> firmwareIds) {
        Map<String, Object> params = new HashMap<>();
        params.put("domainId", domainId);
        params.put("firmwareIds", firmwareIds);
        List<FirmwareInternalTestResultDVO> firmwareInternalTestResultDVOS =
                zeusSqlSessionTemplate.selectList(
                        "zeusFirmwareMapper.selectFirmwareConfirmList", params);

        return firmwareInternalTestResultDVOS;
    }

    @LogElapsed(methodName = "selectFirmwareDescriptionListDB")
    public List<FirmwareDescriptionDVO> selectFirmwareDescriptionList(
            String domainId, String languageCode, List<Integer> firmwareIds) {

        if (CollectionUtils.isEmpty(firmwareIds)) {
            return Collections.emptyList();
        }

        Map<String, Object> params = new HashMap<>();
        params.put("domainId", domainId);
        params.put("firmwareIds", firmwareIds);
        params.put("languageCode", languageCode);

        List<FirmwareDescriptionDVO> firmwareDescriptionDVOs =
                zeusSqlSessionTemplate.selectList(
                        "zeusFirmwareMapper.selectFirmwareDescriptionList", params);

        return firmwareDescriptionDVOs;
    }

    @LogElapsed(methodName = "selectFirmwareDB")
    public FirmwareDVO selectFirmware(String domainId, Integer firmwareId) {
        Map<String, Object> params = new HashMap<String, Object>();

        params.put("firmwareId", firmwareId);
        params.put("domainId", domainId);

        FirmwareDVO firmwareDVO =
                zeusSqlSessionTemplate.selectOne("zeusFirmwareMapper.selectFirmware", params);
        return firmwareDVO;
    }

    @LogElapsed(methodName = "markTestedDB")
    public void markTested(
            String domainId, String userId, Integer firmwareId, String result, String note) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("firmwareId", firmwareId);
        params.put("userId", userId);
        params.put("internalTestResult", result);
        params.put("note", note);

        zeusSqlSessionTemplate.update("zeusFirmwareMapper.markTested", params);
    }

    @LogElapsed(methodName = "deleteMarkTestedDB")
    public void deleteMarkTested(String domainId, String userId, Integer firmwareId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("firmwareId", firmwareId);
        params.put("userId", userId);

        zeusSqlSessionTemplate.update("zeusFirmwareMapper.deleteMarkTested", params);
    }

    @LogElapsed(methodName = "selectFirmwaresInBlacklistDB")
    public List<Integer> selectFirmwaresInBlacklist(String domainId, List<Integer> firmwareIds) {
        if (CollectionUtils.isEmpty(firmwareIds)) {
            return Collections.emptyList();
        }

        Map<String, Object> params = new HashMap<String, Object>();

        params.put("domainId", domainId);
        params.put("firmwareIds", firmwareIds);

        return zeusSqlSessionTemplate.selectList(
                "zeusFirmwareMapper.selectFirmwareIdsInBlackList", params);
    }

    @LogElapsed(methodName = "insertToBlacklistDB")
    public void insertToBlacklist(String domainId, String userId, Integer firmwareId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("firmwareId", firmwareId);
        params.put("userId", userId);

        zeusSqlSessionTemplate.update("zeusFirmwareMapper.insertToBlacklist", params);
    }

    @LogElapsed(methodName = "deleteFromBlacklistDB")
    public void deleteFromBlacklist(String domainId, String userId, Integer firmwareId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("firmwareId", firmwareId);
        params.put("userId", userId);

        zeusSqlSessionTemplate.update("zeusFirmwareMapper.deleteFromBlacklist", params);
    }

    @LogElapsed(methodName = "selectFirmwareByVersionNameDB")
    public FirmwareDVO selectFirmwareByVersionName(
            String domainId, String model, String salesCode, String firmwareVersion) {
        Map<String, Object> params = new HashMap<String, Object>();

        params.put("domainId", domainId);
        params.put("model", model);
        params.put("salesCode", salesCode);
        params.put("firmwareVersion", firmwareVersion);

        FirmwareDVO firmwareDVO =
                zeusSqlSessionTemplate.selectOne(
                        "zeusFirmwareMapper.selectFirmwareByVersionName", params);
        return firmwareDVO;
    }

    @LogElapsed(methodName = "selectLatestUserTypeFirmwareDB")
    public FirmwareDVO selectLatestUserTypeFirmware(
            String domainId, String model, String salesCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("model", model);
        params.put("salesCode", salesCode);

        FirmwareDVO firmwareDVO =
                zeusSqlSessionTemplate.selectOne(
                        "zeusFirmwareMapper.selectLatestUserTypeFirmware", params);
        return firmwareDVO;
    }

    @LogElapsed(methodName = "selectLatestInTestedUserTypeFirmwareDB")
    public FirmwareDVO selectLatestInTestedUserTypeFirmware(
            String domainId, String model, String salesCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("model", model);
        params.put("salesCode", salesCode);

        FirmwareDVO firmwareDVO =
                zeusSqlSessionTemplate.selectOne(
                        "zeusFirmwareMapper.selectLatestInTestedUserTypeFirmware", params);
        return firmwareDVO;
    }

    @LogElapsed(methodName = "selectFirmwareScenarioDB")
    public List<FirmwareScenarioDVO> selectFirmwareScenario(
            String domainId, String model, String salesCode) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("model", model);
        params.put("salesCode", salesCode);

        List<FirmwareScenarioDVO> firmwareScenarioDVOs =
                zeusSqlSessionTemplate.selectList(
                        "zeusFirmwareMapper.selectFirmwareScenarioList", params);
        return firmwareScenarioDVOs;
    }

    @LogElapsed(methodName = "insertFirmwaresDB")
    public int insertFirmwares(String domainId, List<FirmwareDVO> firmwares) {
        if (ObjectUtil.nullOrZeroLength(firmwares)) {
            return 0;
        }

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("firmwareList", firmwares);

        return zeusSqlSessionTemplate.insert("zeusFirmwareMapper.insertFirmwares", params);
    }

    //    @LogElapsed(methodName = "insertFirmwareScenariosDB")
    //    public int insertFirmwareScenarios(String domainId, List<FirmwareScenarioDVO>
    // firmwareScenarios) {
    //        Map<String, Object> params = new HashMap<String, Object>();
    //        params.put("domainId", domainId);
    //        params.put("firmwareScenarioList", firmwareScenarios);
    //        return zeusSqlSessionTemplate.insert("zeusFirmwareMapper.insertFirmwareScenarios",
    // params);
    //    }

    @LogElapsed(methodName = "insertFirmwareScenariosWithLogDB")
    public int insertFirmwareScenariosWithLog(
            String domainId, List<FirmwareScenarioDVO> firmwareScenarios) {
        if (ObjectUtil.nullOrZeroLength(firmwareScenarios)) {
            return 0;
        }

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("firmwareScenarioList", firmwareScenarios);

        try {
            return zeusSqlSessionTemplate.insert(
                    "zeusFirmwareMapper.insertFirmwareScenarios", params);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
        }
        return 0;
    }

    @LogElapsed(methodName = "insertFirmwareDescriptionsDB")
    public int insertFirmwareDescriptions(
            String domainId, List<FirmwareDescriptionDVO> firmwareDescriptions) {
        if (firmwareDescriptions == null || firmwareDescriptions.size() == 0) {
            return 0;
        }
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("firmwareDescriptionList", firmwareDescriptions);

        try {
            return zeusSqlSessionTemplate.insert(
                    "zeusFirmwareMapper.insertFirmwareDescription", params);
        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
        }
        return 0;
    }

    @LogElapsed(methodName = "listModelSalesCodesDB")
    public List<ModelSalesCodeDVO> listModelSalesCodes(String domainId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);

        List<ModelSalesCodeDVO> modelSalesCodeDVOs =
                zeusSqlSessionTemplate.selectList("zeusFirmwareMapper.listModelSalesCodes", params);
        return modelSalesCodeDVOs;
    }

    @LogElapsed(methodName = "deleteFirmwareScenarios")
    public int deleteFirmwareScenarios(String domainId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        int result =
                zeusSqlSessionTemplate.insert("zeusFirmwareMapper.deleteFirmwareScenarios", params);
        return result;
    }

    @LogElapsed(methodName = "deleteFirmwares")
    public int deleteFirmwares(String domainId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        int result = zeusSqlSessionTemplate.insert("zeusFirmwareMapper.deleteFirmwares", params);
        return result;
    }

    @LogElapsed(methodName = "deleteFirmwareDescriptions")
    public int deleteFirmwareDescriptions(String domainId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        int result =
                zeusSqlSessionTemplate.insert(
                        "zeusFirmwareMapper.deleteFirmwareDescriptions", params);
        return result;
    }
}
