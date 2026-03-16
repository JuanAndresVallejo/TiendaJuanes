package com.juanesstore.controllers;

import com.juanesstore.dto.UserProfileResponse;
import com.juanesstore.dto.UpdatePasswordRequest;
import com.juanesstore.dto.UpdateProfileRequest;
import com.juanesstore.models.Address;
import com.juanesstore.models.User;
import com.juanesstore.repositories.AddressRepository;
import com.juanesstore.repositories.UserRepository;
import com.juanesstore.utils.SecurityUtils;
import java.util.Comparator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final SecurityUtils securityUtils;
  private final AddressRepository addressRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public UserController(SecurityUtils securityUtils,
                        AddressRepository addressRepository,
                        PasswordEncoder passwordEncoder,
                        UserRepository userRepository) {
    this.securityUtils = securityUtils;
    this.addressRepository = addressRepository;
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;
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

  @PutMapping("/me")
  public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
    User user = securityUtils.getCurrentUser();
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setPhone(request.getPhone());
    user.setDocumentId(request.getDocumentId());
    userRepository.save(user);

    Address address = addressRepository.findByUserAndIsDefaultTrue(user)
        .orElseGet(() -> addressRepository.findByUserOrderByCreatedAtDesc(user).stream()
            .findFirst()
            .orElseGet(() -> {
              Address created = new Address();
              created.setUser(user);
              created.setIsDefault(true);
              return created;
            }));
    address.setDepartment(request.getDepartment());
    address.setCity(request.getCity());
    address.setAddressLine(request.getAddressLine());

    addressRepository.save(address);
    UserProfileResponse response = new UserProfileResponse(
        user.getId(),
        user.getFirstName() + " " + user.getLastName(),
        user.getEmail(),
        user.getPhone(),
        user.getDocumentId(),
        address.getDepartment(),
        address.getCity(),
        address.getAddressLine()
    );
    return ResponseEntity.ok(response);
  }

  @PutMapping("/me/password")
  public ResponseEntity<Void> updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
    User user = securityUtils.getCurrentUser();
    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
      throw new IllegalArgumentException("La contraseña actual no es válida");
    }
    if (!request.getNewPassword().equals(request.getConfirmPassword())) {
      throw new IllegalArgumentException("Las contraseñas no coinciden");
    }
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
    return ResponseEntity.ok().build();
  }
}
