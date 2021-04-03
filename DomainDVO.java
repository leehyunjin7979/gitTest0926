package com.samsung.efota.zeus.core.database.zeus.vo;

import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.Objects;
import java.util.StringJoiner;

@ToString
@EqualsAndHashCode
public class DomainDVO {

    private String domainId;
    private String customerName;
    private String description;
    private String modifier;
    private Timestamp createdTimestamp;
    private Timestamp modifiedTimestamp;

    public String getDomainId() {
        return domainId;
    }

    public DomainDVO setDomainId(String domainId) {
        this.domainId = domainId;
        return this;
    }

    public String getCustomerName() {
        return customerName;
    }

    public DomainDVO setCustomerName(String customerName) {
        this.customerName = customerName;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public DomainDVO setDescription(String description) {
        this.description = description;
        return this;
    }

    public String getModifier() {
        return modifier;
    }

    public DomainDVO setModifier(String modifier) {
        this.modifier = modifier;
        return this;
    }

    public Timestamp getCreatedTimestamp() {
        return createdTimestamp;
    }

    public DomainDVO setCreatedTimestamp(Timestamp createdTimestamp) {
        this.createdTimestamp = createdTimestamp;
        return this;
    }

    public Timestamp getModifiedTimestamp() {
        return modifiedTimestamp;
    }

    public DomainDVO setModifiedTimestamp(Timestamp modifiedTimestamp) {
        this.modifiedTimestamp = modifiedTimestamp;
        return this;
    }

}
