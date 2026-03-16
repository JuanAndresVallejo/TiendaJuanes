package com.juanesstore.controllers;

import com.juanesstore.dto.BannerResponse;
import com.juanesstore.services.BannerService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/banners")
public class BannerController {
  private final BannerService bannerService;

  public BannerController(BannerService bannerService) {
    this.bannerService = bannerService;
  }

  @GetMapping
  public ResponseEntity<List<BannerResponse>> getActive() {
    return ResponseEntity.ok(bannerService.getActive());
  }
}
