package com.juanesstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
  @NotBlank
  @Size(max = 20)
  @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")
  private String firstName;

  @NotBlank
  @Size(max = 25)
  @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")
  private String lastName;

  @NotBlank
  @Pattern(regexp = "\\d{10}")
  private String phone;

  @NotBlank
  @Pattern(regexp = "\\d{6,15}")
  private String documentId;

  @NotBlank
  private String department;

  @NotBlank
  private String city;

  @NotBlank
  @Size(min = 8, max = 120)
  @Pattern(regexp = "^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ#.,\\- ]+$")
  private String addressLine;

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getDocumentId() {
    return documentId;
  }

  public void setDocumentId(String documentId) {
    this.documentId = documentId;
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
}
