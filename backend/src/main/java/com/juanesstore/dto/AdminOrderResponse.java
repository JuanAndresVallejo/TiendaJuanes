package com.juanesstore.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class AdminOrderResponse {
  private Long id;
  private String customerName;
  private Instant createdAt;
  private BigDecimal totalAmount;
  private String status;
  private String paymentMethod;

  public AdminOrderResponse(Long id, String customerName, Instant createdAt, BigDecimal totalAmount,
                            String status, String paymentMethod) {
    this.id = id;
    this.customerName = customerName;
    this.createdAt = createdAt;
    this.totalAmount = totalAmount;
    this.status = status;
    this.paymentMethod = paymentMethod;
  }

  public Long getId() {
    return id;
  }

  public String getCustomerName() {
    return customerName;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  public String getStatus() {
    return status;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }
}
