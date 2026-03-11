package com.juanesstore.utils;

import com.juanesstore.models.User;
import com.juanesstore.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
  private final UserRepository userRepository;

  public SecurityUtils(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || authentication.getName() == null) {
      throw new IllegalStateException("User not authenticated");
    }
    return userRepository.findByEmail(authentication.getName())
        .orElseThrow(() -> new IllegalStateException("User not found"));
  }
}
