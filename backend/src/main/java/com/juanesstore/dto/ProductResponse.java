package com.juanesstore.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class ProductResponse {
  private Long id;
  private String name;
  private String refCode;
  private String description;
  private String brand;
  private String category;
  private Boolean featured;
  private String tags;
  private Integer discountPercentage;
  private BigDecimal basePrice;
  private Instant createdAt;
  private List<ProductVariantResponse> variants;
  private List<ProductImageResponse> images;

  public ProductResponse(Long id, String name, String refCode, String description, String brand, String category,
                         Boolean featured, String tags, Integer discountPercentage,
                         BigDecimal basePrice, Instant createdAt,
                         List<ProductVariantResponse> variants, List<ProductImageResponse> images) {
    this.id = id;
    this.name = name;
    this.refCode = refCode;
    this.description = description;
    this.brand = brand;
    this.category = category;
    this.featured = featured;
    this.tags = tags;
    this.discountPercentage = discountPercentage;
    this.basePrice = basePrice;
    this.createdAt = createdAt;
    this.variants = variants;
    this.images = images;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getRefCode() {
    return refCode;
  }

  public String getDescription() {
    return description;
  }

  public String getBrand() {
    return brand;
  }

  public String getCategory() {
    return category;
  }

  public Boolean getFeatured() {
    return featured;
  }

  public String getTags() {
    return tags;
  }

  public Integer getDiscountPercentage() {
    return discountPercentage;
  }

  public BigDecimal getBasePrice() {
    return basePrice;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public List<ProductVariantResponse> getVariants() {
    return variants;
  }

  public List<ProductImageResponse> getImages() {
    return images;
  }
}
