package com.juanesstore.dto;

import jakarta.validation.constraints.NotBlank;

public class OrderNoteRequest {
  @NotBlank
  private String note;

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }
}
