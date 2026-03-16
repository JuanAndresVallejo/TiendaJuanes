package com.juanesstore.repositories;

import com.juanesstore.models.Payment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
  Optional<Payment> findByOrderId(Long orderId);

  List<Payment> findByOrderIdIn(List<Long> orderIds);
}
