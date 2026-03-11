package com.juanesstore.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateOrderRequest {
  private Long addressId;

  @NotBlank
  private String department;

  @NotBlank
  private String city;

  @NotBlank
  private String addressLine;

  private Boolean express;

  public Long getAddressId() {
    return addressId;
  }

  public void setAddressId(Long addressId) {
    this.addressId = addressId;
  }

  public String getDepartment() {
    return department;
  }

  public void setDepartment(String department) {
    this.department = department;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getAddressLine() {
    return addressLine;
  }

  public void setAddressLine(String addressLine) {
    this.addressLine = addressLine;
  }

  public Boolean getExpress() {
    return express;
  }

  public void setExpress(Boolean express) {
    this.express = express;
  }
}
