package com.juanesstore.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class AdminUserDetailResponse {
  private Long id;
  private String fullName;
  private String email;
  private String phone;
  private String documentId;
  private Instant createdAt;
  private Long orderCount;
  private List<AddressResponse> addresses;
  private List<OrderSummary> recentOrders;

  public AdminUserDetailResponse(Long id, String fullName, String email, String phone, String documentId,
                                 Instant createdAt, Long orderCount, List<AddressResponse> addresses,
                                 List<OrderSummary> recentOrders) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.documentId = documentId;
    this.createdAt = createdAt;
    this.orderCount = orderCount;
    this.addresses = addresses;
    this.recentOrders = recentOrders;
  }

  public Long getId() {
    return id;
  }

  public String getFullName() {
    return fullName;
  }

  public String getEmail() {
    return email;
  }

  public String getPhone() {
    return phone;
  }

  public String getDocumentId() {
    return documentId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Long getOrderCount() {
    return orderCount;
  }

  public List<AddressResponse> getAddresses() {
    return addresses;
  }

  public List<OrderSummary> getRecentOrders() {
    return recentOrders;
  }

  public static class OrderSummary {
    private Long id;
    private Instant createdAt;
    private String status;
    private BigDecimal totalAmount;

    public OrderSummary(Long id, Instant createdAt, String status, BigDecimal totalAmount) {
      this.id = id;
      this.createdAt = createdAt;
      this.status = status;
      this.totalAmount = totalAmount;
    }

    public Long getId() {
      return id;
    }

    public Instant getCreatedAt() {
      return createdAt;
    }

    public String getStatus() {
      return status;
    }

    public BigDecimal getTotalAmount() {
      return totalAmount;
    }
  }
}
