package com.juanesstore.dto;

public class CreatePreferenceResponse {
  private String preferenceId;
  private String initPoint;

  public CreatePreferenceResponse(String preferenceId, String initPoint) {
    this.preferenceId = preferenceId;
    this.initPoint = initPoint;
  }

  public String getPreferenceId() {
    return preferenceId;
  }

  public String getInitPoint() {
    return initPoint;
  }
}
