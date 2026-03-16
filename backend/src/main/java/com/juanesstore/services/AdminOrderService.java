package com.juanesstore.services;

import com.juanesstore.dto.OrderDetailDTO;
import com.juanesstore.models.Order;
import com.juanesstore.models.OrderItem;
import com.juanesstore.models.Payment;
import com.juanesstore.models.Product;
import com.juanesstore.models.ProductImage;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.repositories.OrderRepository;
import com.juanesstore.repositories.PaymentRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminOrderService {
  private final OrderRepository orderRepository;
  private final PaymentRepository paymentRepository;

  public AdminOrderService(OrderRepository orderRepository, PaymentRepository paymentRepository) {
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
  }

  @Transactional(readOnly = true)
  public OrderDetailDTO getOrderDetail(Long orderId) {
    Order order = orderRepository.findOrderWithItems(orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
    String customer = order.getUser().getFirstName() + " " + order.getUser().getLastName();
    String paymentMethod = payment == null ? "" : payment.getPaymentMethod();

    List<OrderDetailDTO.OrderDetailItemDTO> items = order.getItems().stream()
        .map(this::mapItem)
        .collect(Collectors.toList());

    return new OrderDetailDTO(
        order.getId(),
        customer,
        order.getUser().getEmail(),
        order.getUser().getPhone(),
        order.getShippingAddress(),
        paymentMethod,
        order.getStatus().name(),
        order.getTotalAmount(),
        order.getCreatedAt(),
        items
    );
  }

  private OrderDetailDTO.OrderDetailItemDTO mapItem(OrderItem item) {
    ProductVariant variant = item.getProductVariant();
    Product product = variant.getProduct();
    Optional<ProductImage> firstImage = product.getImages().stream().findFirst();
    String imageUrl = firstImage.map(ProductImage::getImageUrl).orElse(null);
    return new OrderDetailDTO.OrderDetailItemDTO(
        product.getName(),
        product.getRefCode(),
        variant.getSize(),
        variant.getColor(),
        item.getQuantity(),
        item.getPrice(),
        imageUrl
    );
  }
}
