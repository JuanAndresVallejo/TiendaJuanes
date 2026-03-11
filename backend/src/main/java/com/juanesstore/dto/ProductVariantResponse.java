package com.juanesstore.dto;

import java.math.BigDecimal;

public class ProductVariantResponse {
  private Long id;
  private String color;
  private String size;
  private String sku;
  private BigDecimal price;
  private Integer stock;

  public Integer getStock() {
    return stock;
  }

  public ProductVariantResponse(Long id, String color, String size, String sku, BigDecimal price, Integer stock) {
    this.id = id;
    this.color = color;
    this.size = size;
    this.sku = sku;
    this.price = price;
    this.stock = stock;
  }

  public Long getId() {
    return id;
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

  public BigDecimal getPrice() {
    return price;
  }

}
