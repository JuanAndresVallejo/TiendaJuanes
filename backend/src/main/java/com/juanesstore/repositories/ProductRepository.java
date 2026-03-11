package com.juanesstore.repositories;

import com.juanesstore.models.Product;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
  @Query("""
      SELECT DISTINCT p FROM Product p
      LEFT JOIN p.variants v
      WHERE lower(p.name) LIKE lower(concat('%', :q, '%'))
         OR lower(p.refCode) LIKE lower(concat('%', :q, '%'))
         OR lower(p.category) LIKE lower(concat('%', :q, '%'))
         OR lower(p.brand) LIKE lower(concat('%', :q, '%'))
      """)
  List<Product> search(@Param("q") String q);

  @Query("""
      SELECT DISTINCT p FROM Product p
      LEFT JOIN p.variants v
      WHERE (:category IS NULL OR lower(p.category) = lower(:category))
        AND (:brand IS NULL OR lower(p.brand) = lower(:brand))
        AND (:size IS NULL OR lower(v.size) = lower(:size))
        AND (:color IS NULL OR lower(v.color) = lower(:color))
        AND (:minPrice IS NULL OR p.basePrice >= :minPrice)
        AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice)
      """)
  List<Product> filter(@Param("category") String category,
                       @Param("brand") String brand,
                       @Param("size") String size,
                       @Param("color") String color,
                       @Param("minPrice") BigDecimal minPrice,
                       @Param("maxPrice") BigDecimal maxPrice);
}
