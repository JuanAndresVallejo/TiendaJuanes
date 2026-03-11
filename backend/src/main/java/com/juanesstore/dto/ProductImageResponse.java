package com.juanesstore.dto;

public class ProductImageResponse {
  private Long id;
  private String imageUrl;

  public ProductImageResponse(Long id, String imageUrl) {
    this.id = id;
    this.imageUrl = imageUrl;
  }

  public Long getId() {
    return id;
  }

  public String getImageUrl() {
    return imageUrl;
  }
}
