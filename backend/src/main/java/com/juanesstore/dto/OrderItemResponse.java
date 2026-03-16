package com.juanesstore.dto;

import java.math.BigDecimal;

public class OrderItemResponse {
  private Long productVariantId;
  private String productName;
  private String productReference;
  private String color;
  private String size;
  private Integer quantity;
  private BigDecimal price;

  public OrderItemResponse(Long productVariantId, String productName, String productReference,
                           String color, String size,
                           Integer quantity, BigDecimal price) {
    this.productVariantId = productVariantId;
    this.productName = productName;
    this.productReference = productReference;
    this.color = color;
    this.size = size;
    this.quantity = quantity;
    this.price = price;
  }

  public Long getProductVariantId() {
    return productVariantId;
  }

  public String getProductName() {
    return productName;
  }

  public String getProductReference() {
    return productReference;
  }

  public String getColor() {
    return color;
  }

  public String getSize() {
    return size;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public BigDecimal getPrice() {
    return price;
  }
}
