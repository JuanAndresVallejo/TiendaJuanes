package com.juanesstore.controllers;

import com.juanesstore.dto.AdminOrderResponse;
import com.juanesstore.dto.AdminCouponRequest;
import com.juanesstore.dto.AdminCouponResponse;
import com.juanesstore.dto.AdminUserResponse;
import com.juanesstore.dto.AnalyticsResponse;
import com.juanesstore.dto.BannerRequest;
import com.juanesstore.dto.BannerResponse;
import com.juanesstore.dto.DashboardStatsResponse;
import com.juanesstore.dto.InventoryItemResponse;
import com.juanesstore.dto.OrderDetailDTO;
import com.juanesstore.dto.ProductCreateRequest;
import com.juanesstore.dto.ProductResponse;
import com.juanesstore.dto.UpdateInventoryRequest;
import com.juanesstore.dto.UpdateOrderStatusRequest;
import com.juanesstore.models.Order;
import com.juanesstore.models.OrderStatus;
import com.juanesstore.models.Payment;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.repositories.ChartPointProjection;
import com.juanesstore.repositories.OrderRepository;
import com.juanesstore.repositories.PaymentRepository;
import com.juanesstore.repositories.ProductVariantRepository;
import com.juanesstore.repositories.UserRepository;
import com.juanesstore.services.AdminOrderService;
import com.juanesstore.services.BannerService;
import com.juanesstore.services.ProductService;
import com.juanesstore.services.AdminCouponService;
import com.juanesstore.services.EmailService;
import com.juanesstore.services.OrderTrackingService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

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
  private final AdminOrderService adminOrderService;
  private final BannerService bannerService;

  public AdminController(ProductService productService,
                         OrderRepository orderRepository,
                         ProductVariantRepository productVariantRepository,
                         UserRepository userRepository,
                         PaymentRepository paymentRepository,
                         AdminCouponService adminCouponService,
                         OrderTrackingService orderTrackingService,
                         EmailService emailService,
                         AdminOrderService adminOrderService,
                         BannerService bannerService) {
    this.productService = productService;
    this.orderRepository = orderRepository;
    this.productVariantRepository = productVariantRepository;
    this.userRepository = userRepository;
    this.paymentRepository = paymentRepository;
    this.adminCouponService = adminCouponService;
    this.orderTrackingService = orderTrackingService;
    this.emailService = emailService;
    this.adminOrderService = adminOrderService;
    this.bannerService = bannerService;
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
  public ResponseEntity<List<AdminOrderResponse>> getOrders(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "20") int size) {
    List<Order> orders = orderRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
        .getContent();
    Map<Long, Payment> payments = paymentRepository.findByOrderIdIn(
            orders.stream().map(Order::getId).collect(Collectors.toList()))
        .stream()
        .collect(Collectors.toMap(payment -> payment.getOrder().getId(), payment -> payment));

    List<AdminOrderResponse> responses = orders.stream()
        .map(order -> {
          Payment payment = payments.get(order.getId());
          String customerName = order.getUser().getFirstName() + " " + order.getUser().getLastName();
          String paymentMethod = payment == null ? "" : payment.getPaymentMethod();
          java.time.Instant paymentDate = payment == null ? null : payment.getCreatedAt();
          return new AdminOrderResponse(
              order.getId(),
              customerName,
              order.getCreatedAt(),
              order.getTotalAmount(),
              order.getStatus().name(),
              paymentMethod,
              paymentDate,
              order.getShippingAddress(),
              order.getNotes()
          );
        })
        .collect(Collectors.toList());
    return ResponseEntity.ok(responses);
  }

  @GetMapping("/orders/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OrderDetailDTO> getOrderDetail(@PathVariable Long id) {
    return ResponseEntity.ok(adminOrderService.getOrderDetail(id));
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
            variant.getStock(),
            variant.getProduct().getImages().isEmpty()
                ? null
                : variant.getProduct().getImages().get(0).getImageUrl()
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
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
    return ResponseEntity.ok(buildStats());
  }

  @GetMapping("/analytics")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AnalyticsResponse> getAnalytics() {
    DashboardStatsResponse stats = buildStats();
    List<DashboardStatsResponse.ChartPoint> categories = orderRepository.getTopCategories().stream()
        .map(this::toChartPoint)
        .collect(Collectors.toList());

    long newCustomers = userRepository.count();

    return ResponseEntity.ok(new AnalyticsResponse(
        stats.getSalesByDay(),
        stats.getSalesByMonth(),
        stats.getTopProducts(),
        categories,
        newCustomers
    ));
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

  @GetMapping("/banners")
  public ResponseEntity<List<BannerResponse>> getBanners() {
    return ResponseEntity.ok(bannerService.getAll());
  }

  @PostMapping("/banners")
  public ResponseEntity<BannerResponse> createBanner(@Valid @RequestBody BannerRequest request) {
    return ResponseEntity.ok(bannerService.create(request));
  }

  @PutMapping("/banners/{id}")
  public ResponseEntity<BannerResponse> updateBanner(@PathVariable Long id,
                                                     @Valid @RequestBody BannerRequest request) {
    return ResponseEntity.ok(bannerService.update(id, request));
  }

  @DeleteMapping("/banners/{id}")
  public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
    bannerService.delete(id);
    return ResponseEntity.ok().build();
  }

  private DashboardStatsResponse buildStats() {
    BigDecimal salesToday = orderRepository.getSalesToday();
    BigDecimal salesMonth = orderRepository.getSalesMonth();
    long totalOrders = orderRepository.countAllOrders();
    long productsSold = orderRepository.getProductsSold();
    long totalCustomers = userRepository.count();

    List<DashboardStatsResponse.ChartPoint> daily = orderRepository.getSalesByDay().stream()
        .map(this::toChartPoint)
        .collect(Collectors.toList());

    List<DashboardStatsResponse.ChartPoint> monthly = orderRepository.getSalesByMonth().stream()
        .map(this::toChartPoint)
        .collect(Collectors.toList());

    List<DashboardStatsResponse.ChartPoint> top = orderRepository.getTopProducts().stream()
        .map(this::toChartPoint)
        .collect(Collectors.toList());

    return new DashboardStatsResponse(
        salesToday, salesMonth, totalOrders, productsSold, totalCustomers, daily, monthly, top
    );
  }

  private DashboardStatsResponse.ChartPoint toChartPoint(ChartPointProjection projection) {
    return new DashboardStatsResponse.ChartPoint(projection.getLabel(), projection.getValue());
  }
}
