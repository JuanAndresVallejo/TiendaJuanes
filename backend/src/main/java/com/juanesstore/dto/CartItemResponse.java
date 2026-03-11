package com.juanesstore.dto;

import java.math.BigDecimal;

public class CartItemResponse {
  private Long id;
  private Long productVariantId;
  private String productName;
  private String color;
  private String size;
  private Integer quantity;
  private BigDecimal price;
  private String imageUrl;

  public CartItemResponse(Long id, Long productVariantId, String productName, String color, String size,
                          Integer quantity, BigDecimal price, String imageUrl) {
    this.id = id;
    this.productVariantId = productVariantId;
    this.productName = productName;
    this.color = color;
    this.size = size;
    this.quantity = quantity;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  public Long getId() {
    return id;
  }

  public Long getProductVariantId() {
    return productVariantId;
  }

  public String getProductName() {
    return productName;
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

  public String getImageUrl() {
    return imageUrl;
  }
}
