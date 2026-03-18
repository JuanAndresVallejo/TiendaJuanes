package com.juanesstore.models;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "stock_movements")
public class StockMovement {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_variant_id", nullable = false)
  private ProductVariant productVariant;

  @Column(nullable = false)
  private Integer delta;

  @Column(name = "previous_stock", nullable = false)
  private Integer previousStock;

  @Column(name = "new_stock", nullable = false)
  private Integer newStock;

  @Column(nullable = false)
  private String reason;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public ProductVariant getProductVariant() {
    return productVariant;
  }

  public void setProductVariant(ProductVariant productVariant) {
    this.productVariant = productVariant;
  }

  public Integer getDelta() {
    return delta;
  }

  public void setDelta(Integer delta) {
    this.delta = delta;
  }

  public Integer getPreviousStock() {
    return previousStock;
  }

  public void setPreviousStock(Integer previousStock) {
    this.previousStock = previousStock;
  }

  public Integer getNewStock() {
    return newStock;
  }

  public void setNewStock(Integer newStock) {
    this.newStock = newStock;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
