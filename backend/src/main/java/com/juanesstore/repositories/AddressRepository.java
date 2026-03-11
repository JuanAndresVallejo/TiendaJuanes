package com.juanesstore.repositories;

import com.juanesstore.models.Address;
import com.juanesstore.models.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
  List<Address> findByUserOrderByCreatedAtDesc(User user);
  Optional<Address> findByUserAndIsDefaultTrue(User user);
}
