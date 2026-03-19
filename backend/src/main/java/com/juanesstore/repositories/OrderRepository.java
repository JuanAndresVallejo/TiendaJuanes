package com.juanesstore.repositories;

import com.juanesstore.models.Order;
import com.juanesstore.models.User;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByUserOrderByCreatedAtDesc(User user);
  List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
  long countByUserId(Long userId);

  @Query("""
      SELECT DISTINCT o
      FROM Order o
      LEFT JOIN FETCH o.items i
      LEFT JOIN FETCH i.productVariant pv
      LEFT JOIN FETCH pv.product p
      LEFT JOIN FETCH o.user u
      WHERE o.id = :orderId
      """)
  Optional<Order> findOrderWithItems(@Param("orderId") Long orderId);

  @Query("""
      SELECT DISTINCT o
      FROM Order o
      LEFT JOIN FETCH o.items i
      LEFT JOIN FETCH i.productVariant pv
      LEFT JOIN FETCH pv.product p
      WHERE o.user = :user
      ORDER BY o.createdAt DESC
      """)
  List<Order> findByUserWithItems(@Param("user") User user);

  @EntityGraph(attributePaths = "user")
  Page<Order> findAll(Pageable pageable);

  @Query("SELECT COUNT(o) FROM Order o")
  long countAllOrders();

  @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE",
      nativeQuery = true)
  BigDecimal getSalesToday();

  @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)",
      nativeQuery = true)
  BigDecimal getSalesMonth();

  @Query(value = "SELECT COALESCE(SUM(quantity), 0) FROM order_items", nativeQuery = true)
  long getProductsSold();

  @Query(value = """
      SELECT to_char(created_at, 'YYYY-MM-DD') AS label,
             COALESCE(SUM(total_amount), 0) AS value
      FROM orders
      GROUP BY label
      ORDER BY label
      """, nativeQuery = true)
  List<ChartPointProjection> getSalesByDay();

  @Query(value = """
      SELECT to_char(created_at, 'YYYY-MM') AS label,
             COALESCE(SUM(total_amount), 0) AS value
      FROM orders
      GROUP BY label
      ORDER BY label
      """, nativeQuery = true)
  List<ChartPointProjection> getSalesByMonth();

  @Query(value = """
      SELECT p.name AS label,
             COALESCE(SUM(oi.quantity), 0) AS value
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.product_variant_id
      JOIN products p ON p.id = pv.product_id
      GROUP BY p.name
      ORDER BY value DESC
      LIMIT 5
      """, nativeQuery = true)
  List<ChartPointProjection> getTopProducts();

  @Query(value = """
      SELECT COALESCE(p.category, 'Sin categoria') AS label,
             COALESCE(SUM(oi.quantity), 0) AS value
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.product_variant_id
      JOIN products p ON p.id = pv.product_id
      GROUP BY p.category
      ORDER BY value DESC
      LIMIT 5
      """, nativeQuery = true)
  List<ChartPointProjection> getTopCategories();
}
