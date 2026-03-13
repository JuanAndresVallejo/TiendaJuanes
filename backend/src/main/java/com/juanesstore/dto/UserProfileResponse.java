package com.juanesstore.dto;

public class UserProfileResponse {
  private Long id;
  private String fullName;
  private String email;
  private String phone;
  private String documentId;
  private String department;
  private String city;
  private String addressLine;

  public UserProfileResponse(Long id, String fullName, String email, String phone, String documentId,
                             String department, String city, String addressLine) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.documentId = documentId;
    this.department = department;
    this.city = city;
    this.addressLine = addressLine;
  }

  public Long getId() {
    return id;
  }

  public String getFullName() {
    return fullName;
  }

  public String getEmail() {
    return email;
  }

  public String getPhone() {
    return phone;
  }

  public String getDocumentId() {
    return documentId;
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
}
