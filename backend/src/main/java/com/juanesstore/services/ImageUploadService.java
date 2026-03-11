package com.juanesstore.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ImageUploadService {
  private final String cloudinaryUrl;

  public ImageUploadService(@Value("${app.cloudinary.url:}") String cloudinaryUrl) {
    this.cloudinaryUrl = cloudinaryUrl;
  }

  public String upload(String imageUrl) {
    // Placeholder: if Cloudinary is configured, integrate SDK here.
    return imageUrl;
  }
}
