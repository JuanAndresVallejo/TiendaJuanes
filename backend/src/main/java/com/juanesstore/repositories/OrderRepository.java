package com.juanesstore.repositories;

import com.juanesstore.models.Order;
import com.juanesstore.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByUserOrderByCreatedAtDesc(User user);
}
