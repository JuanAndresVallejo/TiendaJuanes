package com.juanesstore.dto;

import java.math.BigDecimal;

public class CouponValidateResponse {
  private boolean valid;
  private String message;
  private BigDecimal discount;
  private String discountType;

  public CouponValidateResponse(boolean valid, String message, BigDecimal discount, String discountType) {
    this.valid = valid;
    this.message = message;
    this.discount = discount;
    this.discountType = discountType;
  }

  public boolean isValid() {
    return valid;
  }

  public String getMessage() {
    return message;
  }

  public BigDecimal getDiscount() {
    return discount;
  }

  public String getDiscountType() {
    return discountType;
  }
}
