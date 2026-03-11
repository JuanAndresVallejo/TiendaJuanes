package com.juanesstore.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class AdminCouponResponse {
  private Long id;
  private String code;
  private String description;
  private String discountType;
  private BigDecimal discountValue;
  private Integer usageLimit;
  private Integer usedCount;
  private Instant validFrom;
  private Instant validUntil;
  private Boolean active;

  public AdminCouponResponse(Long id, String code, String description, String discountType, BigDecimal discountValue,
                             Integer usageLimit, Integer usedCount, Instant validFrom, Instant validUntil, Boolean active) {
    this.id = id;
    this.code = code;
    this.description = description;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.usageLimit = usageLimit;
    this.usedCount = usedCount;
    this.validFrom = validFrom;
    this.validUntil = validUntil;
    this.active = active;
  }

  public Long getId() {
    return id;
  }

  public String getCode() {
    return code;
  }

  public String getDescription() {
    return description;
  }

  public String getDiscountType() {
    return discountType;
  }

  public BigDecimal getDiscountValue() {
    return discountValue;
  }

  public Integer getUsageLimit() {
    return usageLimit;
  }

  public Integer getUsedCount() {
    return usedCount;
  }

  public Instant getValidFrom() {
    return validFrom;
  }

  public Instant getValidUntil() {
    return validUntil;
  }

  public Boolean getActive() {
    return active;
  }
}
