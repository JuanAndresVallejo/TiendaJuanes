package com.juanesstore.controllers;

import com.juanesstore.dto.AddressRequest;
import com.juanesstore.dto.AddressResponse;
import com.juanesstore.models.User;
import com.juanesstore.services.AddressService;
import com.juanesstore.utils.SecurityUtils;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
  private final AddressService addressService;
  private final SecurityUtils securityUtils;

  public AddressController(AddressService addressService, SecurityUtils securityUtils) {
    this.addressService = addressService;
    this.securityUtils = securityUtils;
  }

  @GetMapping
  public ResponseEntity<List<AddressResponse>> getAddresses() {
    User user = securityUtils.getCurrentUser();
    return ResponseEntity.ok(addressService.getAddresses(user));
  }

  @PostMapping
  public ResponseEntity<AddressResponse> addAddress(@Valid @RequestBody AddressRequest request) {
    User user = securityUtils.getCurrentUser();
    return ResponseEntity.ok(addressService.addAddress(user, request));
  }

  @PutMapping("/{id}/default")
  public ResponseEntity<Void> setDefault(@PathVariable Long id) {
    User user = securityUtils.getCurrentUser();
    addressService.setDefault(user, id);
    return ResponseEntity.ok().build();
  }
}
