package com.juanesstore.services;

import com.juanesstore.dto.AddressRequest;
import com.juanesstore.dto.AddressResponse;
import com.juanesstore.models.Address;
import com.juanesstore.models.User;
import com.juanesstore.repositories.AddressRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AddressService {
  private final AddressRepository addressRepository;

  public AddressService(AddressRepository addressRepository) {
    this.addressRepository = addressRepository;
  }

  @Transactional(readOnly = true)
  public List<AddressResponse> getAddresses(User user) {
    return addressRepository.findByUserOrderByCreatedAtDesc(user).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public AddressResponse addAddress(User user, AddressRequest request) {
    Address address = new Address();
    address.setUser(user);
    address.setDepartment(request.getDepartment());
    address.setCity(request.getCity());
    address.setAddressLine(request.getAddressLine());

    boolean makeDefault = request.getIsDefault() != null && request.getIsDefault();
    if (makeDefault) {
      clearDefault(user);
    } else if (addressRepository.findByUserAndIsDefaultTrue(user).isEmpty()) {
      makeDefault = true;
    }

    address.setIsDefault(makeDefault);
    return toResponse(addressRepository.save(address));
  }

  @Transactional
  public void setDefault(User user, Long addressId) {
    Address address = addressRepository.findById(addressId)
        .orElseThrow(() -> new IllegalArgumentException("Address not found"));
    if (!address.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Address not found");
    }
    clearDefault(user);
    address.setIsDefault(true);
    addressRepository.save(address);
  }

  @Transactional
  public AddressResponse updateAddress(User user, Long addressId, AddressRequest request) {
    Address address = addressRepository.findById(addressId)
        .orElseThrow(() -> new IllegalArgumentException("Address not found"));
    if (!address.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Address not found");
    }
    address.setDepartment(request.getDepartment());
    address.setCity(request.getCity());
    address.setAddressLine(request.getAddressLine());

    if (request.getIsDefault() != null && request.getIsDefault()) {
      clearDefault(user);
      address.setIsDefault(true);
    }

    return toResponse(addressRepository.save(address));
  }

  @Transactional
  public void deleteAddress(User user, Long addressId) {
    Address address = addressRepository.findById(addressId)
        .orElseThrow(() -> new IllegalArgumentException("Address not found"));
    if (!address.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Address not found");
    }
    boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
    addressRepository.delete(address);

    if (wasDefault) {
      addressRepository.findByUserOrderByCreatedAtDesc(user).stream()
          .findFirst()
          .ifPresent(next -> {
            next.setIsDefault(true);
            addressRepository.save(next);
          });
    }
  }

  private void clearDefault(User user) {
    addressRepository.findByUserOrderByCreatedAtDesc(user)
        .forEach(addr -> {
          if (Boolean.TRUE.equals(addr.getIsDefault())) {
            addr.setIsDefault(false);
            addressRepository.save(addr);
          }
        });
  }

  private AddressResponse toResponse(Address address) {
    return new AddressResponse(
        address.getId(),
        address.getDepartment(),
        address.getCity(),
        address.getAddressLine(),
        address.getIsDefault()
    );
  }
}
