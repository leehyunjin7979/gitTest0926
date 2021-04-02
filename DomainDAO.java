package com.samsung.efota.zeus.core.database.dao;

import com.samsung.efota.zeus.core.common.ZeusException;
import com.samsung.efota.zeus.core.common.ZeusResultCode;
import com.samsung.efota.zeus.core.database.zeus.vo.DomainDVO;
import com.samsung.efota.zeus.core.log.LogElapsed;
import com.samsung.efota.zeus.core.util.ObjectUtil;
import org.apache.ibatis.javassist.bytecode.stackmap.TypeData;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.validation.Valid;
import java.lang.invoke.MethodHandles;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DomainDAO {

    private static Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Qualifier("zeusSqlSessionTemplate")
    @Autowired
    SqlSessionTemplate zeusSqlSessionTemplate;

    public void insertDomain(DomainDVO domainDVO, String userId) throws ZeusException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domain", domainDVO);
        params.put("modifier", userId);

        Integer result = zeusSqlSessionTemplate.insert("zeusDomainMapper.insertDomain", params);

        if(result != 1){
            LOGGER.error("CreateDomain Failed to insert, Data:{}", domainDVO.toString());
            throw new ZeusException(ZeusResultCode.INTERNAL_SERVER_ERROR);
        }
    }

    @LogElapsed(methodName = "listDomainsDB")
    public List<DomainDVO> listDomains() {
        List<DomainDVO> domainDVOs = zeusSqlSessionTemplate.selectList("zeusDomainMapper.selectDomains");
        return domainDVOs;
    }

    @LogElapsed(methodName = "selectDomainDB")
    public DomainDVO selectDomain(String domainId) {
        DomainDVO domainDVO = zeusSqlSessionTemplate.selectOne("zeusDomainMapper.selectDomain", domainId);
        return domainDVO;
    }

    @LogElapsed(methodName = "deleteDomainDB")
    public void deleteDomain(String domainId, String userId) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("domainId", domainId);
        params.put("modifier", userId);

        zeusSqlSessionTemplate.update("zeusDomainMapper.deleteDomain", params);
    }
}
