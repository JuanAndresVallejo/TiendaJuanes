package com.juanesstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AddressRequest {
  @NotBlank
  private String department;

  @NotBlank
  private String city;

  @NotBlank
  @Size(min = 8, max = 120)
  @Pattern(regexp = "^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ#.,\\- ]+$")
  private String addressLine;

  private Boolean isDefault;

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

  public Boolean getIsDefault() {
    return isDefault;
  }

  public void setIsDefault(Boolean isDefault) {
    this.isDefault = isDefault;
  }
}
