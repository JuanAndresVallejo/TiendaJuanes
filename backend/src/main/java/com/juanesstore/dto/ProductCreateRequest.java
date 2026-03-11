package com.juanesstore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class ProductCreateRequest {
  @NotBlank
  private String name;

  @NotBlank
  private String refCode;

  @NotBlank
  private String description;

  private String brand;

  private String category;

  @NotNull
  private BigDecimal basePrice;

  @Valid
  private List<ProductVariantRequest> variants;

  @Valid
  private List<ProductImageRequest> images;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getRefCode() {
    return refCode;
  }

  public void setRefCode(String refCode) {
    this.refCode = refCode;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public BigDecimal getBasePrice() {
    return basePrice;
  }

  public void setBasePrice(BigDecimal basePrice) {
    this.basePrice = basePrice;
  }

  public List<ProductVariantRequest> getVariants() {
    return variants;
  }

  public void setVariants(List<ProductVariantRequest> variants) {
    this.variants = variants;
  }

  public List<ProductImageRequest> getImages() {
    return images;
  }

  public void setImages(List<ProductImageRequest> images) {
    this.images = images;
  }
}
