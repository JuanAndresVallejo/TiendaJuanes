package com.juanesstore.controllers;

import com.juanesstore.dto.AdminOrderResponse;
import com.juanesstore.dto.AdminCouponRequest;
import com.juanesstore.dto.AdminCouponResponse;
import com.juanesstore.dto.AdminUserResponse;
import com.juanesstore.dto.AnalyticsResponse;
import com.juanesstore.dto.DashboardStatsResponse;
import com.juanesstore.dto.InventoryItemResponse;
import com.juanesstore.dto.ProductCreateRequest;
import com.juanesstore.dto.ProductResponse;
import com.juanesstore.dto.UpdateInventoryRequest;
import com.juanesstore.dto.UpdateOrderStatusRequest;
import com.juanesstore.models.Order;
import com.juanesstore.models.OrderItem;
import com.juanesstore.models.OrderStatus;
import com.juanesstore.models.Payment;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.repositories.OrderRepository;
import com.juanesstore.repositories.PaymentRepository;
import com.juanesstore.repositories.ProductVariantRepository;
import com.juanesstore.repositories.UserRepository;
import com.juanesstore.services.ProductService;
import com.juanesstore.services.AdminCouponService;
import com.juanesstore.services.EmailService;
import com.juanesstore.services.OrderTrackingService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final ProductService productService;
  private final OrderRepository orderRepository;
  private final ProductVariantRepository productVariantRepository;
  private final UserRepository userRepository;
  private final PaymentRepository paymentRepository;
  private final AdminCouponService adminCouponService;
  private final OrderTrackingService orderTrackingService;
  private final EmailService emailService;

  public AdminController(ProductService productService,
                         OrderRepository orderRepository,
                         ProductVariantRepository productVariantRepository,
                         UserRepository userRepository,
                         PaymentRepository paymentRepository,
                         AdminCouponService adminCouponService,
                         OrderTrackingService orderTrackingService,
                         EmailService emailService) {
    this.productService = productService;
    this.orderRepository = orderRepository;
    this.productVariantRepository = productVariantRepository;
    this.userRepository = userRepository;
    this.paymentRepository = paymentRepository;
    this.adminCouponService = adminCouponService;
    this.orderTrackingService = orderTrackingService;
    this.emailService = emailService;
  }

  @PostMapping("/products")
  public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
    return ResponseEntity.ok(productService.create(request));
  }

  @PutMapping("/products/{id}")
  public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                       @Valid @RequestBody ProductCreateRequest request) {
    return ResponseEntity.ok(productService.update(id, request));
  }

  @DeleteMapping("/products/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    productService.delete(id);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/products")
  public ResponseEntity<List<ProductResponse>> getAdminProducts() {
    return ResponseEntity.ok(productService.getAll());
  }

  @GetMapping("/orders")
  @Transactional(readOnly = true)
  public ResponseEntity<List<AdminOrderResponse>> getOrders() {
    List<Order> orders = orderRepository.findAll();
    List<AdminOrderResponse> responses = orders.stream()
        .map(order -> {
          Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
          String customerName = order.getUser().getFirstName() + " " + order.getUser().getLastName();
          String paymentMethod = payment == null ? "" : payment.getPaymentMethod();
          return new AdminOrderResponse(
              order.getId(),
              customerName,
              order.getCreatedAt(),
              order.getTotalAmount(),
              order.getStatus().name(),
              paymentMethod,
              order.getShippingAddress(),
              order.getNotes()
          );
        })
        .collect(Collectors.toList());
    return ResponseEntity.ok(responses);
  }

  @PutMapping("/orders/update-status")
  public ResponseEntity<Void> updateOrderStatus(@Valid @RequestBody UpdateOrderStatusRequest request) {
    Order order = orderRepository.findById(request.getOrderId())
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    OrderStatus status = OrderStatus.valueOf(request.getStatus());
    order.setStatus(status);
    orderRepository.save(order);
    orderTrackingService.recordStatus(order, status);
    if (status == OrderStatus.SHIPPED) {
      emailService.sendOrderShipped(order);
    }
    return ResponseEntity.ok().build();
  }

  @GetMapping("/inventory")
  public ResponseEntity<List<InventoryItemResponse>> getInventory() {
    List<InventoryItemResponse> items = productVariantRepository.findAll().stream()
        .map(variant -> new InventoryItemResponse(
            variant.getProduct().getId(),
            variant.getProduct().getName(),
            variant.getProduct().getRefCode(),
            variant.getId(),
            variant.getColor(),
            variant.getSize(),
            variant.getSku(),
            variant.getStock()
        ))
        .collect(Collectors.toList());
    return ResponseEntity.ok(items);
  }

  @PutMapping("/inventory/update")
  public ResponseEntity<Void> updateInventory(@Valid @RequestBody UpdateInventoryRequest request) {
    ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
        .orElseThrow(() -> new IllegalArgumentException("Variant not found"));

    if (request.getNewStock() != null) {
      variant.setStock(Math.max(0, request.getNewStock()));
    } else if (request.getDelta() != null) {
      variant.setStock(Math.max(0, variant.getStock() + request.getDelta()));
    }

    productVariantRepository.save(variant);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/dashboard/stats")
  public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
    return ResponseEntity.ok(buildStats(orderRepository.findAll()));
  }

  @GetMapping("/analytics")
  public ResponseEntity<AnalyticsResponse> getAnalytics() {
    List<Order> orders = orderRepository.findAll();
    DashboardStatsResponse stats = buildStats(orders);

    Map<String, Long> topCategories = orders.stream()
        .flatMap(o -> o.getItems().stream())
        .collect(Collectors.groupingBy(item -> item.getProductVariant().getProduct().getCategory(),
            Collectors.summingLong(OrderItem::getQuantity)));

    List<DashboardStatsResponse.ChartPoint> categories = topCategories.entrySet().stream()
        .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
        .limit(5)
        .map(e -> new DashboardStatsResponse.ChartPoint(e.getKey(), BigDecimal.valueOf(e.getValue())))
        .collect(Collectors.toList());

    long newCustomers = userRepository.count();

    AnalyticsResponse response = new AnalyticsResponse(
        stats.getSalesByDay(),
        stats.getSalesByMonth(),
        stats.getTopProducts(),
        categories,
        newCustomers
    );

    return ResponseEntity.ok(response);
  }

  @GetMapping("/coupons")
  public ResponseEntity<List<AdminCouponResponse>> listCoupons() {
    return ResponseEntity.ok(adminCouponService.list());
  }

  @GetMapping("/users")
  public ResponseEntity<List<AdminUserResponse>> listUsers() {
    List<AdminUserResponse> users = userRepository.findAll().stream()
        .map(user -> new AdminUserResponse(
            user.getId(),
            user.getFirstName() + " " + user.getLastName(),
            user.getEmail(),
            user.getRole().name(),
            user.getCreatedAt()
        ))
        .collect(Collectors.toList());
    return ResponseEntity.ok(users);
  }

  @PostMapping("/coupons")
  public ResponseEntity<AdminCouponResponse> createCoupon(@Valid @RequestBody AdminCouponRequest request) {
    return ResponseEntity.ok(adminCouponService.create(request));
  }

  @PutMapping("/coupons/{id}")
  public ResponseEntity<AdminCouponResponse> updateCoupon(@PathVariable Long id,
                                                          @Valid @RequestBody AdminCouponRequest request) {
    return ResponseEntity.ok(adminCouponService.update(id, request));
  }

  @DeleteMapping("/coupons/{id}")
  public ResponseEntity<Void> deactivateCoupon(@PathVariable Long id) {
    adminCouponService.deactivate(id);
    return ResponseEntity.ok().build();
  }

  private DashboardStatsResponse buildStats(List<Order> orders) {
    LocalDate today = LocalDate.now(ZoneId.systemDefault());
    BigDecimal salesToday = orders.stream()
        .filter(o -> o.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate().equals(today))
        .map(Order::getTotalAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    LocalDate monthStart = today.withDayOfMonth(1);
    BigDecimal salesMonth = orders.stream()
        .filter(o -> !o.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate().isBefore(monthStart))
        .map(Order::getTotalAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    long totalOrders = orders.size();
    long productsSold = orders.stream()
        .flatMap(o -> o.getItems().stream())
        .mapToLong(OrderItem::getQuantity)
        .sum();
    long totalCustomers = userRepository.count();

    Map<LocalDate, BigDecimal> salesByDay = orders.stream()
        .collect(Collectors.groupingBy(
            o -> o.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate(),
            Collectors.mapping(Order::getTotalAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
        ));

    List<DashboardStatsResponse.ChartPoint> daily = salesByDay.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .map(e -> new DashboardStatsResponse.ChartPoint(e.getKey().toString(), e.getValue()))
        .collect(Collectors.toList());

    Map<String, BigDecimal> salesByMonth = orders.stream()
        .collect(Collectors.groupingBy(
            o -> o.getCreatedAt().atZone(ZoneId.systemDefault()).getYear() + "-" +
                String.format("%02d", o.getCreatedAt().atZone(ZoneId.systemDefault()).getMonthValue()),
            Collectors.mapping(Order::getTotalAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
        ));

    List<DashboardStatsResponse.ChartPoint> monthly = salesByMonth.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .map(e -> new DashboardStatsResponse.ChartPoint(e.getKey(), e.getValue()))
        .collect(Collectors.toList());

    Map<String, Long> topProducts = orders.stream()
        .flatMap(o -> o.getItems().stream())
        .collect(Collectors.groupingBy(item -> item.getProductVariant().getProduct().getName(),
            Collectors.summingLong(OrderItem::getQuantity)));

    List<DashboardStatsResponse.ChartPoint> top = topProducts.entrySet().stream()
        .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
        .limit(5)
        .map(e -> new DashboardStatsResponse.ChartPoint(e.getKey(), BigDecimal.valueOf(e.getValue())))
        .collect(Collectors.toList());

    return new DashboardStatsResponse(
        salesToday, salesMonth, totalOrders, productsSold, totalCustomers, daily, monthly, top
    );
  }
}
