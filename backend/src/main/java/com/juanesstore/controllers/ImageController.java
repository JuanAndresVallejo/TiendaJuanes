package com.juanesstore.controllers;

import com.juanesstore.dto.ImageUploadRequest;
import com.juanesstore.services.ImageUploadService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/images")
public class ImageController {
  private final ImageUploadService imageUploadService;

  public ImageController(ImageUploadService imageUploadService) {
    this.imageUploadService = imageUploadService;
  }

  @PostMapping("/upload")
  public ResponseEntity<Map<String, String>> upload(@Valid @RequestBody ImageUploadRequest request) {
    String url = imageUploadService.upload(request.getImageUrl());
    return ResponseEntity.ok(Map.of("url", url));
  }
}
