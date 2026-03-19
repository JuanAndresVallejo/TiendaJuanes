package com.juanesstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
  @NotBlank
  @Size(min = 2, max = 20)
  @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")
  private String firstName;

  @NotBlank
  @Size(min = 2, max = 25)
  @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$")
  private String lastName;

  @NotBlank
  @Pattern(regexp = "\\d{6,15}")
  private String documentId;

  @NotBlank
  @Pattern(regexp = "\\d{10}")
  private String phone;

  @Email
  @NotBlank
  private String email;

  @NotBlank
  private String department;

  @NotBlank
  private String city;

  @NotBlank
  @Size(min = 8, max = 120)
  @Pattern(regexp = "^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ#.,\\- ]+$")
  private String addressLine;

  @NotBlank
  @Size(min = 8)
  private String password;

  @NotBlank
  @Size(min = 8)
  private String confirmPassword;

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

  public String getDocumentId() {
    return documentId;
  }

  public void setDocumentId(String documentId) {
    this.documentId = documentId;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
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

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getConfirmPassword() {
    return confirmPassword;
  }

  public void setConfirmPassword(String confirmPassword) {
    this.confirmPassword = confirmPassword;
  }
}
