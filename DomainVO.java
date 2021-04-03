package com.samsung.efota.zeus.core.vo.httpbody.common;

import com.samsung.efota.zeus.core.database.zeus.vo.DomainDVO;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.Objects;
import java.util.StringJoiner;

@ToString
@EqualsAndHashCode
public class DomainVO {
    String domainId;
    String customerName;
    String description;
    String modifier;
    Long createdAt;
    Long modifiedAt;

    public String getDomainId() {
        return domainId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getDescription() {
        return description;
    }

    public String getModifier() {
        return modifier;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public Long getModifiedAt() {
        return modifiedAt;
    }


    public static class Builder {
        String domainId;
        String customerName;
        String description;
        String modifier;
        Long createdAt;
        Long modifiedAt;

        public Builder withDomainDVO(DomainDVO domainDVO) {
            setDomainId(domainDVO.getDomainId());
            setCustomerName(domainDVO.getCustomerName());
            setDescription(domainDVO.getDescription());
            setModifier(domainDVO.getModifier());
            setCreatedAt(domainDVO.getCreatedTimestamp().getTime());
            setModifiedAt(domainDVO.getModifiedTimestamp().getTime());
            return this;
        }

        public Builder setDomainId(String domainId) {
            this.domainId = domainId;
            return this;
        }

        public Builder setCustomerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }

        public Builder setModifier(String modifier) {
            this.modifier = modifier;
            return this;
        }

        public Builder setCreatedAt(Long createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder setModifiedAt(Long modifiedAt) {
            this.modifiedAt = modifiedAt;
            return this;
        }

        public DomainVO build() {
            DomainVO domainVO = new DomainVO();
            domainVO.domainId = domainId;
            domainVO.customerName = customerName;
            domainVO.description = description;
            domainVO.modifier = modifier;
            domainVO.createdAt = createdAt;
            domainVO.modifiedAt = modifiedAt;

            return domainVO;
        }
    }
}
