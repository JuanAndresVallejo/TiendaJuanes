package com.juanesstore.dto;

import jakarta.validation.constraints.NotBlank;

public class ImageUploadRequest {
  @NotBlank
  private String imageUrl;

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }
}
