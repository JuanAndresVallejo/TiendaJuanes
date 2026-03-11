package com.juanesstore.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderResponse {
  private Long id;
  private BigDecimal totalAmount;
  private String status;
  private String paymentStatus;
  private String shippingAddress;
  private String shippingType;
  private Instant createdAt;
  private List<OrderItemResponse> items;

  public OrderResponse(Long id, BigDecimal totalAmount, String status, String paymentStatus,
                       String shippingAddress, String shippingType, Instant createdAt,
                       List<OrderItemResponse> items) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.shippingAddress = shippingAddress;
    this.shippingType = shippingType;
    this.createdAt = createdAt;
    this.items = items;
  }

  public Long getId() {
    return id;
  }

  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  public String getStatus() {
    return status;
  }

  public String getPaymentStatus() {
    return paymentStatus;
  }

  public String getShippingAddress() {
    return shippingAddress;
  }

  public String getShippingType() {
    return shippingType;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public List<OrderItemResponse> getItems() {
    return items;
  }
}
