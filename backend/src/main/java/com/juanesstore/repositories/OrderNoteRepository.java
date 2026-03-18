package com.juanesstore.repositories;

import com.juanesstore.models.OrderNote;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderNoteRepository extends JpaRepository<OrderNote, Long> {
  List<OrderNote> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
