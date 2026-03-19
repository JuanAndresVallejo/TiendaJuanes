package com.juanesstore.services;

import com.juanesstore.dto.AuthResponse;
import com.juanesstore.dto.ForgotPasswordRequest;
import com.juanesstore.dto.LoginRequest;
import com.juanesstore.dto.RegisterRequest;
import com.juanesstore.dto.ResetPasswordRequest;
import com.juanesstore.models.Address;
import com.juanesstore.models.PasswordResetToken;
import com.juanesstore.models.Role;
import com.juanesstore.models.User;
import com.juanesstore.repositories.AddressRepository;
import com.juanesstore.repositories.PasswordResetTokenRepository;
import com.juanesstore.repositories.UserRepository;
import java.time.Instant;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
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
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtils jwtUtils;
  private final AuthenticationManager authenticationManager;
  private final EmailService emailService;
  private final String frontendUrl;

  public AuthService(UserRepository userRepository,
                     AddressRepository addressRepository,
                     PasswordResetTokenRepository passwordResetTokenRepository,
                     PasswordEncoder passwordEncoder,
                     JwtUtils jwtUtils,
                     AuthenticationManager authenticationManager,
                     EmailService emailService,
                     @Value("${app.frontend.url:http://localhost:8088}") String frontendUrl) {
    this.userRepository = userRepository;
    this.addressRepository = addressRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtils = jwtUtils;
    this.authenticationManager = authenticationManager;
    this.emailService = emailService;
    this.frontendUrl = frontendUrl;
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

  public void forgotPassword(ForgotPasswordRequest request) {
    userRepository.findByEmail(request.getEmail().trim().toLowerCase())
        .ifPresent(user -> {
          PasswordResetToken token = new PasswordResetToken();
          token.setUser(user);
          token.setToken(UUID.randomUUID().toString().replace("-", ""));
          token.setExpiresAt(Instant.now().plusSeconds(60 * 30));
          token.setUsed(false);
          PasswordResetToken saved = passwordResetTokenRepository.save(token);

          String resetUrl = frontendUrl + "/recuperar-password?token=" + saved.getToken();
          emailService.sendPasswordReset(user.getEmail(), resetUrl);
        });
  }

  public void resetPassword(ResetPasswordRequest request) {
    if (!request.getNewPassword().equals(request.getConfirmPassword())) {
      throw new IllegalArgumentException("Las contraseñas no coinciden");
    }
    PasswordResetToken token = passwordResetTokenRepository.findByTokenAndUsedFalse(request.getToken())
        .orElseThrow(() -> new IllegalArgumentException("El enlace de recuperación no es válido"));
    if (token.getExpiresAt().isBefore(Instant.now())) {
      throw new IllegalArgumentException("El enlace de recuperación expiró");
    }
    User user = token.getUser();
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
    token.setUsed(true);
    passwordResetTokenRepository.save(token);
  }
}
