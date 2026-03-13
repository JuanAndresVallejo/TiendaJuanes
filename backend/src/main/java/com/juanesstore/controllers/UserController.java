package com.juanesstore.controllers;

import com.juanesstore.dto.UserProfileResponse;
import com.juanesstore.models.Address;
import com.juanesstore.models.User;
import com.juanesstore.repositories.AddressRepository;
import com.juanesstore.utils.SecurityUtils;
import java.util.Comparator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final SecurityUtils securityUtils;
  private final AddressRepository addressRepository;

  public UserController(SecurityUtils securityUtils, AddressRepository addressRepository) {
    this.securityUtils = securityUtils;
    this.addressRepository = addressRepository;
  }

  @GetMapping("/me")
  public ResponseEntity<UserProfileResponse> getProfile() {
    User user = securityUtils.getCurrentUser();
    Address address = addressRepository.findByUserAndIsDefaultTrue(user)
        .orElseGet(() -> addressRepository.findByUserOrderByCreatedAtDesc(user).stream()
            .sorted(Comparator.comparing(Address::getIsDefault).reversed())
            .findFirst()
            .orElse(null));

    String department = address != null ? address.getDepartment() : "";
    String city = address != null ? address.getCity() : "";
    String addressLine = address != null ? address.getAddressLine() : "";

    UserProfileResponse response = new UserProfileResponse(
        user.getId(),
        user.getFirstName() + " " + user.getLastName(),
        user.getEmail(),
        user.getPhone(),
        user.getDocumentId(),
        department,
        city,
        addressLine
    );
    return ResponseEntity.ok(response);
  }
}
