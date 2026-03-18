package com.juanesstore.dto;

import java.time.Instant;

public class OrderNoteResponse {
  private Long id;
  private String note;
  private String createdBy;
  private Instant createdAt;

  public OrderNoteResponse(Long id, String note, String createdBy, Instant createdAt) {
    this.id = id;
    this.note = note;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }

  public Long getId() {
    return id;
  }

  public String getNote() {
    return note;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
