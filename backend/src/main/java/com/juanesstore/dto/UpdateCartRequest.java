package com.juanesstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UpdateCartRequest {
  @NotNull
  private Long productVariantId;

  @Min(1)
  private Integer quantity;

  public Long getProductVariantId() {
    return productVariantId;
  }

  public void setProductVariantId(Long productVariantId) {
    this.productVariantId = productVariantId;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }
}
