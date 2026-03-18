package com.juanesstore.repositories;

import com.juanesstore.models.Product;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
  Page<Product> search(@Param("q") String q, Pageable pageable);

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
  Page<Product> filter(@Param("category") String category,
                       @Param("brand") String brand,
                       @Param("size") String size,
                       @Param("color") String color,
                       @Param("minPrice") BigDecimal minPrice,
                       @Param("maxPrice") BigDecimal maxPrice,
                       Pageable pageable);

  @Query("""
      SELECT DISTINCT p FROM Product p
      LEFT JOIN p.variants v
      WHERE (:q IS NULL OR :q = '' OR
             lower(p.name) LIKE lower(concat('%', :q, '%')) OR
             lower(p.refCode) LIKE lower(concat('%', :q, '%')) OR
             lower(p.category) LIKE lower(concat('%', :q, '%')) OR
             lower(p.brand) LIKE lower(concat('%', :q, '%')))
        AND (:category IS NULL OR lower(p.category) = lower(:category))
        AND (:brand IS NULL OR lower(p.brand) = lower(:brand))
        AND (:size IS NULL OR lower(v.size) = lower(:size))
        AND (:color IS NULL OR lower(v.color) = lower(:color))
        AND (:minPrice IS NULL OR p.basePrice >= :minPrice)
        AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice)
      """)
  Page<Product> searchAndFilter(@Param("q") String q,
                                @Param("category") String category,
                                @Param("brand") String brand,
                                @Param("size") String size,
                                @Param("color") String color,
                                @Param("minPrice") BigDecimal minPrice,
                                @Param("maxPrice") BigDecimal maxPrice,
                                Pageable pageable);

  Page<Product> findByFeaturedTrue(Pageable pageable);

  @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
  Page<Product> findNewest(Pageable pageable);

  @Query(value = """
      SELECT p.* FROM products p
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      LEFT JOIN order_items oi ON oi.product_variant_id = pv.id
      LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'PAID'
      GROUP BY p.id
      ORDER BY COALESCE(SUM(CASE WHEN o.status = 'PAID' THEN oi.quantity ELSE 0 END), 0) DESC
      """,
      countQuery = "SELECT COUNT(*) FROM products",
      nativeQuery = true)
  Page<Product> findBestSellers(Pageable pageable);

  @Query("""
      SELECT p FROM Product p
      WHERE lower(p.category) = lower(:category)
        AND p.id <> :productId
      """)
  Page<Product> findRelated(@Param("category") String category,
                            @Param("productId") Long productId,
                            Pageable pageable);

  List<Product> findByIdIn(List<Long> ids);
}
