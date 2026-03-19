package com.juanesstore.dto;

import java.time.Instant;

public class AdminUserResponse {
  private Long id;
  private String fullName;
  private String email;
  private Long orderCount;
  private Instant createdAt;

  public AdminUserResponse(Long id, String fullName, String email, Long orderCount, Instant createdAt) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.orderCount = orderCount;
    this.createdAt = createdAt;
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

  public Long getOrderCount() {
    return orderCount;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
