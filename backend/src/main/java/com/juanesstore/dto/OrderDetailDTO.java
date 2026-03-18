package com.juanesstore.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderDetailDTO {
  private Long orderId;
  private String customer;
  private String email;
  private String phone;
  private String address;
  private String paymentMethod;
  private String status;
  private BigDecimal total;
  private Instant createdAt;
  private List<OrderDetailItemDTO> items;

  public OrderDetailDTO(Long orderId, String customer, String email, String phone, String address,
                        String paymentMethod, String status, BigDecimal total, Instant createdAt,
                        List<OrderDetailItemDTO> items) {
    this.orderId = orderId;
    this.customer = customer;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.paymentMethod = paymentMethod;
    this.status = status;
    this.total = total;
    this.createdAt = createdAt;
    this.items = items;
  }

  public Long getOrderId() {
    return orderId;
  }

  public String getCustomer() {
    return customer;
  }

  public String getEmail() {
    return email;
  }

  public String getPhone() {
    return phone;
  }

  public String getAddress() {
    return address;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }

  public String getStatus() {
    return status;
  }

  public BigDecimal getTotal() {
    return total;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public List<OrderDetailItemDTO> getItems() {
    return items;
  }

  public static class OrderDetailItemDTO {
    private Long itemId;
    private String productName;
    private String productReference;
    private String variantSize;
    private String variantColor;
    private Integer quantity;
    private BigDecimal unitPrice;
    private String imageUrl;
    private boolean packed;

    public OrderDetailItemDTO(Long itemId, String productName, String productReference, String variantSize,
                              String variantColor, Integer quantity, BigDecimal unitPrice, String imageUrl,
                              boolean packed) {
      this.itemId = itemId;
      this.productName = productName;
      this.productReference = productReference;
      this.variantSize = variantSize;
      this.variantColor = variantColor;
      this.quantity = quantity;
      this.unitPrice = unitPrice;
      this.imageUrl = imageUrl;
      this.packed = packed;
    }

    public Long getItemId() {
      return itemId;
    }

    public String getProductName() {
      return productName;
    }

    public String getProductReference() {
      return productReference;
    }

    public String getVariantSize() {
      return variantSize;
    }

    public String getVariantColor() {
      return variantColor;
    }

    public Integer getQuantity() {
      return quantity;
    }

    public BigDecimal getUnitPrice() {
      return unitPrice;
    }

    public String getImageUrl() {
      return imageUrl;
    }

    public boolean isPacked() {
      return packed;
    }
  }
}
