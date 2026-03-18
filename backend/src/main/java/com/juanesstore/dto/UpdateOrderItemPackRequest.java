package com.juanesstore.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateOrderItemPackRequest {
  @NotNull
  private Boolean packed;

  public Boolean getPacked() {
    return packed;
  }

  public void setPacked(Boolean packed) {
    this.packed = packed;
  }
}
