package com.juanesstore.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateInventoryRequest {
  @NotNull
  private Long productVariantId;

  private Integer newStock;

  private Integer delta;

  public Long getProductVariantId() {
    return productVariantId;
  }

  public void setProductVariantId(Long productVariantId) {
    this.productVariantId = productVariantId;
  }

  public Integer getNewStock() {
    return newStock;
  }

  public void setNewStock(Integer newStock) {
    this.newStock = newStock;
  }

  public Integer getDelta() {
    return delta;
  }

  public void setDelta(Integer delta) {
    this.delta = delta;
  }
}
