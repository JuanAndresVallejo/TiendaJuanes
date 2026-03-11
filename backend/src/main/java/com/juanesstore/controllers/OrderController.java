package com.juanesstore.controllers;

import com.juanesstore.dto.CreateOrderRequest;
import com.juanesstore.dto.OrderResponse;
import com.juanesstore.dto.OrderStatusHistoryResponse;
import com.juanesstore.models.Order;
import com.juanesstore.models.User;
import com.juanesstore.repositories.OrderRepository;
import com.juanesstore.repositories.OrderStatusHistoryRepository;
import com.juanesstore.services.OrderService;
import com.juanesstore.utils.SecurityUtils;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
  private final OrderService orderService;
  private final SecurityUtils securityUtils;
  private final OrderStatusHistoryRepository historyRepository;
  private final OrderRepository orderRepository;

  public OrderController(OrderService orderService,
                         SecurityUtils securityUtils,
                         OrderStatusHistoryRepository historyRepository,
                         OrderRepository orderRepository) {
    this.orderService = orderService;
    this.securityUtils = securityUtils;
    this.historyRepository = historyRepository;
    this.orderRepository = orderRepository;
  }

  @PostMapping("/create")
  public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request) {
    User user = securityUtils.getCurrentUser();
    return ResponseEntity.ok(orderService.createOrder(user, request));
  }

  @GetMapping("/my-orders")
  public ResponseEntity<List<OrderResponse>> myOrders() {
    User user = securityUtils.getCurrentUser();
    return ResponseEntity.ok(orderService.getMyOrders(user));
  }

  @GetMapping("/{id}/tracking")
  public ResponseEntity<List<OrderStatusHistoryResponse>> tracking(@PathVariable Long id) {
    User user = securityUtils.getCurrentUser();
    Order order = orderRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    if (!order.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Order not found");
    }
    return ResponseEntity.ok(historyRepository.findByOrderIdOrderByCreatedAtAsc(id).stream()
        .map(h -> new OrderStatusHistoryResponse(h.getStatus().name(), h.getCreatedAt()))
        .collect(Collectors.toList()));
  }
}
