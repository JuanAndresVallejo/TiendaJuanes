package com.juanesstore.dto;

public class InventoryItemResponse {
  private Long productId;
  private String productName;
  private String refCode;
  private Long productVariantId;
  private String color;
  private String size;
  private String sku;
  private Integer stock;

  public InventoryItemResponse(Long productId, String productName, String refCode,
                               Long productVariantId, String color, String size, String sku, Integer stock) {
    this.productId = productId;
    this.productName = productName;
    this.refCode = refCode;
    this.productVariantId = productVariantId;
    this.color = color;
    this.size = size;
    this.sku = sku;
    this.stock = stock;
  }

  public Long getProductId() {
    return productId;
  }

  public String getProductName() {
    return productName;
  }

  public String getRefCode() {
    return refCode;
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

  public Integer getStock() {
    return stock;
  }
}
