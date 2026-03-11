package com.juanesstore.config;

import com.juanesstore.models.Role;
import com.juanesstore.models.User;
import com.juanesstore.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SeedUsersRunner implements CommandLineRunner {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public SeedUsersRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    createIfMissing("cliente@tiendajuanes.com", "Cliente", "Demo", Role.CUSTOMER);
    createIfMissing("admin@tiendajuanes.com", "Admin", "Demo", Role.ADMIN);
  }

  private void createIfMissing(String email, String firstName, String lastName, Role role) {
    if (userRepository.existsByEmail(email)) {
      return;
    }
    User user = new User();
    user.setFirstName(firstName);
    user.setLastName(lastName);
    user.setDocumentId("000000");
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(role == Role.ADMIN ? "Admin1234" : "Cliente1234"));
    user.setPhone("3000000000");
    user.setRole(role);
    userRepository.save(user);
  }
}
