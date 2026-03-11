package com.juanesstore.services;

import com.juanesstore.dto.AuthResponse;
import com.juanesstore.dto.LoginRequest;
import com.juanesstore.dto.RegisterRequest;
import com.juanesstore.models.Address;
import com.juanesstore.models.Role;
import com.juanesstore.models.User;
import com.juanesstore.repositories.AddressRepository;
import com.juanesstore.repositories.UserRepository;
import com.juanesstore.security.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
  private final UserRepository userRepository;
  private final AddressRepository addressRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtils jwtUtils;
  private final AuthenticationManager authenticationManager;

  public AuthService(UserRepository userRepository,
                     AddressRepository addressRepository,
                     PasswordEncoder passwordEncoder,
                     JwtUtils jwtUtils,
                     AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.addressRepository = addressRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtils = jwtUtils;
    this.authenticationManager = authenticationManager;
  }

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      logger.warn("Register attempt for existing email={}", request.getEmail());
      throw new IllegalArgumentException("Email already registered");
    }
    if (!request.getPassword().equals(request.getConfirmPassword())) {
      throw new IllegalArgumentException("Passwords do not match");
    }
    User user = new User();
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setDocumentId(request.getDocumentId());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setPhone(request.getPhone());
    user.setRole(Role.CUSTOMER);
    userRepository.save(user);

    Address address = new Address();
    address.setUser(user);
    address.setDepartment(request.getDepartment());
    address.setCity(request.getCity());
    address.setAddressLine(request.getAddressLine());
    address.setIsDefault(true);
    addressRepository.save(address);

    String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
    String fullName = user.getFirstName() + " " + user.getLastName();
    return new AuthResponse(token, fullName, user.getEmail(), user.getRole().name());
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );
    logger.info("Login success for email={}", request.getEmail());
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
    String fullName = user.getFirstName() + " " + user.getLastName();
    return new AuthResponse(token, fullName, user.getEmail(), user.getRole().name());
  }
}
