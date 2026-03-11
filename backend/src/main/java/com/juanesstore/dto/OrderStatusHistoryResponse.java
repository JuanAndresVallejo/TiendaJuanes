package com.juanesstore.dto;

import java.time.Instant;

public class OrderStatusHistoryResponse {
  private String status;
  private Instant createdAt;

  public OrderStatusHistoryResponse(String status, Instant createdAt) {
    this.status = status;
    this.createdAt = createdAt;
  }

  public String getStatus() {
    return status;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
