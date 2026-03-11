package com.juanesstore.services;

import com.juanesstore.dto.AdminCouponRequest;
import com.juanesstore.dto.AdminCouponResponse;
import com.juanesstore.models.Coupon;
import com.juanesstore.models.DiscountType;
import com.juanesstore.repositories.CouponRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class AdminCouponService {
  private final CouponRepository couponRepository;

  public AdminCouponService(CouponRepository couponRepository) {
    this.couponRepository = couponRepository;
  }

  public List<AdminCouponResponse> list() {
    return couponRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
  }

  public AdminCouponResponse create(AdminCouponRequest request) {
    Coupon coupon = new Coupon();
    map(coupon, request);
    coupon.setUsedCount(0);
    return toResponse(couponRepository.save(coupon));
  }

  public AdminCouponResponse update(Long id, AdminCouponRequest request) {
    Coupon coupon = couponRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
    map(coupon, request);
    return toResponse(couponRepository.save(coupon));
  }

  public void deactivate(Long id) {
    Coupon coupon = couponRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
    coupon.setActive(false);
    couponRepository.save(coupon);
  }

  private void map(Coupon coupon, AdminCouponRequest request) {
    coupon.setCode(request.getCode());
    coupon.setDescription(request.getDescription());
    coupon.setDiscountType(DiscountType.valueOf(request.getDiscountType()));
    coupon.setDiscountValue(request.getDiscountValue());
    coupon.setMinimumOrderAmount(request.getMinimumOrderAmount());
    coupon.setUsageLimit(request.getUsageLimit());
    coupon.setValidFrom(request.getValidFrom());
    coupon.setValidUntil(request.getValidUntil());
    coupon.setActive(request.getActive());
  }

  private AdminCouponResponse toResponse(Coupon coupon) {
    return new AdminCouponResponse(
        coupon.getId(),
        coupon.getCode(),
        coupon.getDescription(),
        coupon.getDiscountType().name(),
        coupon.getDiscountValue(),
        coupon.getUsageLimit(),
        coupon.getUsedCount(),
        coupon.getValidFrom(),
        coupon.getValidUntil(),
        coupon.getActive()
    );
  }
}
