package com.juanesstore.repositories;

import com.juanesstore.models.Favorite;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
  List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
  Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);
  boolean existsByUserIdAndProductId(Long userId, Long productId);
  void deleteByUserIdAndProductId(Long userId, Long productId);
}
