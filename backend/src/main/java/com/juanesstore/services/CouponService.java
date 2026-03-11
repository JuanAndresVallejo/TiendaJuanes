package com.juanesstore.services;

import com.juanesstore.dto.CouponValidateRequest;
import com.juanesstore.dto.CouponValidateResponse;
import com.juanesstore.models.Coupon;
import com.juanesstore.models.DiscountType;
import com.juanesstore.repositories.CouponRepository;
import java.math.BigDecimal;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class CouponService {
  private final CouponRepository couponRepository;

  public CouponService(CouponRepository couponRepository) {
    this.couponRepository = couponRepository;
  }

  public CouponValidateResponse validate(CouponValidateRequest request) {
    Coupon coupon = couponRepository.findByCodeIgnoreCase(request.getCode())
        .orElse(null);

    if (coupon == null || !Boolean.TRUE.equals(coupon.getActive())) {
      return new CouponValidateResponse(false, "El cupón no es válido", BigDecimal.ZERO, null);
    }

    Instant now = Instant.now();
    if (now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
      return new CouponValidateResponse(false, "El cupón no está vigente", BigDecimal.ZERO, null);
    }

    if (coupon.getUsedCount() >= coupon.getUsageLimit()) {
      return new CouponValidateResponse(false, "El cupón ya no tiene usos disponibles", BigDecimal.ZERO, null);
    }

    if (request.getOrderAmount().compareTo(coupon.getMinimumOrderAmount()) < 0) {
      return new CouponValidateResponse(false, "El cupón no aplica para este monto", BigDecimal.ZERO, null);
    }

    BigDecimal discount;
    if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
      discount = request.getOrderAmount()
          .multiply(coupon.getDiscountValue())
          .divide(BigDecimal.valueOf(100));
    } else {
      discount = coupon.getDiscountValue();
    }

    return new CouponValidateResponse(true, "Cupón aplicado", discount, coupon.getDiscountType().name());
  }

  public void markUsed(Coupon coupon) {
    coupon.setUsedCount(coupon.getUsedCount() + 1);
    couponRepository.save(coupon);
  }
}
