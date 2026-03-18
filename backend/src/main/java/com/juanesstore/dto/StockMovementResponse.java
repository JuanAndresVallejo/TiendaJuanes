package com.juanesstore.dto;

import java.time.Instant;

public class StockMovementResponse {
  private Long id;
  private Long productId;
  private String productName;
  private Long productVariantId;
  private String color;
  private String size;
  private String sku;
  private Integer delta;
  private Integer previousStock;
  private Integer newStock;
  private String reason;
  private Instant createdAt;

  public StockMovementResponse(Long id, Long productId, String productName, Long productVariantId,
                               String color, String size, String sku, Integer delta, Integer previousStock,
                               Integer newStock, String reason, Instant createdAt) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.productVariantId = productVariantId;
    this.color = color;
    this.size = size;
    this.sku = sku;
    this.delta = delta;
    this.previousStock = previousStock;
    this.newStock = newStock;
    this.reason = reason;
    this.createdAt = createdAt;
  }

  public Long getId() {
    return id;
  }

  public Long getProductId() {
    return productId;
  }

  public String getProductName() {
    return productName;
  }

  public Long getProductVariantId() {
    return productVariantId;
  }

  public String getColor() {
    return color;
  }

  public String getSize() {
    return size;
  }

  public String getSku() {
    return sku;
  }

  public Integer getDelta() {
    return delta;
  }

  public Integer getPreviousStock() {
    return previousStock;
  }

  public Integer getNewStock() {
    return newStock;
  }

  public String getReason() {
    return reason;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
