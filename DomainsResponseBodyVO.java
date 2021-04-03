package com.samsung.efota.zeus.core.vo.httpbody.response;

import com.samsung.efota.zeus.core.vo.httpbody.common.DomainVO;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@ToString
@EqualsAndHashCode
public class DomainsResponseBodyVO {
    List<DomainVO> devices;

    public List<DomainVO> getDomains() {
        return devices;
    }

    public DomainsResponseBodyVO setDomains(List<DomainVO> devices) {
        this.devices = devices;
        return this;
    }
}
