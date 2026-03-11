package com.juanesstore.repositories;

import com.juanesstore.models.CartItem;
import com.juanesstore.models.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  List<CartItem> findByUser(User user);
  Optional<CartItem> findByUserIdAndProductVariantId(Long userId, Long productVariantId);
  void deleteByUser(User user);
}
