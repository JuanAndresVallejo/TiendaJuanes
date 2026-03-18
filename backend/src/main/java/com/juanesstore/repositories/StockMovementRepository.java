package com.juanesstore.repositories;

import com.juanesstore.models.StockMovement;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
  @Query("""
      SELECT sm FROM StockMovement sm
      WHERE (:variantId IS NULL OR sm.productVariant.id = :variantId)
      ORDER BY sm.createdAt DESC
      """)
  List<StockMovement> findRecent(@Param("variantId") Long variantId, Pageable pageable);
}
