package com.juanesstore.dto;

public class AddressResponse {
  private Long id;
  private String department;
  private String city;
  private String addressLine;
  private Boolean isDefault;

  public AddressResponse(Long id, String department, String city, String addressLine, Boolean isDefault) {
    this.id = id;
    this.department = department;
    this.city = city;
    this.addressLine = addressLine;
    this.isDefault = isDefault;
  }

  public Long getId() {
    return id;
  }

  public String getDepartment() {
    return department;
  }

  public String getCity() {
    return city;
  }

  public String getAddressLine() {
    return addressLine;
  }

  public Boolean getIsDefault() {
    return isDefault;
  }
}
