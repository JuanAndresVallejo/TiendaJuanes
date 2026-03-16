package com.juanesstore.repositories;

import com.juanesstore.models.ProductVariant;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
  @EntityGraph(attributePaths = "product")
  List<ProductVariant> findAll();
}
