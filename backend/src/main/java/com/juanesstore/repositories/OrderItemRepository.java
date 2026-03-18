package com.juanesstore.repositories;

import com.juanesstore.models.OrderItem;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
  Optional<OrderItem> findByIdAndOrderId(Long id, Long orderId);
}
