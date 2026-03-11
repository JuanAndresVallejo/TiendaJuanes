package com.juanesstore.controllers;

import com.juanesstore.dto.CouponValidateRequest;
import com.juanesstore.dto.CouponValidateResponse;
import com.juanesstore.services.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {
  private final CouponService couponService;

  public CouponController(CouponService couponService) {
    this.couponService = couponService;
  }

  @PostMapping("/validate")
  public ResponseEntity<CouponValidateResponse> validate(@Valid @RequestBody CouponValidateRequest request) {
    return ResponseEntity.ok(couponService.validate(request));
  }
}
