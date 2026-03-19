package com.juanesstore.controllers;

import com.juanesstore.dto.AdminOrderResponse;
import com.juanesstore.dto.AdminCouponRequest;
import com.juanesstore.dto.AdminCouponResponse;
import com.juanesstore.dto.AdminUserDetailResponse;
import com.juanesstore.dto.AdminUserResponse;
import com.juanesstore.dto.AnalyticsResponse;
import com.juanesstore.dto.AddressResponse;
import com.juanesstore.dto.BannerRequest;
import com.juanesstore.dto.BannerResponse;
import com.juanesstore.dto.DashboardStatsResponse;
import com.juanesstore.dto.InventoryItemResponse;
import com.juanesstore.dto.OrderDetailDTO;
import com.juanesstore.dto.OrderNoteRequest;
import com.juanesstore.dto.OrderNoteResponse;
import com.juanesstore.dto.ProductCreateRequest;
import com.juanesstore.dto.ProductResponse;
import com.juanesstore.dto.StockMovementResponse;
import com.juanesstore.dto.UpdateInventoryRequest;
import com.juanesstore.dto.UpdateOrderItemPackRequest;
import com.juanesstore.dto.UpdateOrderStatusRequest;
import com.juanesstore.models.Order;
import com.juanesstore.models.OrderItem;
import com.juanesstore.models.OrderNote;
import com.juanesstore.models.OrderStatus;
import com.juanesstore.models.Payment;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.models.StockMovement;
import com.juanesstore.models.User;
import com.juanesstore.repositories.ChartPointProjection;
import com.juanesstore.repositories.AddressRepository;
import com.juanesstore.repositories.OrderItemRepository;
import com.juanesstore.repositories.OrderNoteRepository;
import com.juanesstore.repositories.OrderRepository;
import com.juanesstore.repositories.PaymentRepository;
import com.juanesstore.repositories.ProductVariantRepository;
import com.juanesstore.repositories.StockMovementRepository;
import com.juanesstore.repositories.UserRepository;
import com.juanesstore.services.AdminOrderService;
import com.juanesstore.services.BannerService;
import com.juanesstore.services.ProductService;
import com.juanesstore.services.AdminCouponService;
import com.juanesstore.services.EmailService;
import com.juanesstore.services.OrderTrackingService;
import com.juanesstore.services.AutomationWebhookService;
import com.juanesstore.utils.SecurityUtils;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpHeaders;
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
  private final OrderItemRepository orderItemRepository;
  private final AddressRepository addressRepository;
  private final StockMovementRepository stockMovementRepository;
  private final OrderNoteRepository orderNoteRepository;
  private final SecurityUtils securityUtils;
  private final AdminCouponService adminCouponService;
  private final OrderTrackingService orderTrackingService;
  private final EmailService emailService;
  private final AutomationWebhookService automationWebhookService;
  private final AdminOrderService adminOrderService;
  private final BannerService bannerService;

  public AdminController(ProductService productService,
                         OrderRepository orderRepository,
                         ProductVariantRepository productVariantRepository,
                         UserRepository userRepository,
                         PaymentRepository paymentRepository,
                         OrderItemRepository orderItemRepository,
                         AddressRepository addressRepository,
                         StockMovementRepository stockMovementRepository,
                         OrderNoteRepository orderNoteRepository,
                         AdminCouponService adminCouponService,
                         OrderTrackingService orderTrackingService,
                         EmailService emailService,
                         AutomationWebhookService automationWebhookService,
                         AdminOrderService adminOrderService,
                         BannerService bannerService,
                         SecurityUtils securityUtils) {
    this.productService = productService;
    this.orderRepository = orderRepository;
    this.productVariantRepository = productVariantRepository;
    this.userRepository = userRepository;
    this.paymentRepository = paymentRepository;
    this.orderItemRepository = orderItemRepository;
    this.addressRepository = addressRepository;
    this.stockMovementRepository = stockMovementRepository;
    this.orderNoteRepository = orderNoteRepository;
    this.adminCouponService = adminCouponService;
    this.orderTrackingService = orderTrackingService;
    this.emailService = emailService;
    this.automationWebhookService = automationWebhookService;
    this.adminOrderService = adminOrderService;
    this.bannerService = bannerService;
    this.securityUtils = securityUtils;
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

  @GetMapping("/orders/{id}/notes")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<OrderNoteResponse>> getOrderNotes(@PathVariable Long id) {
    List<OrderNoteResponse> notes = orderNoteRepository.findByOrderIdOrderByCreatedAtDesc(id)
        .stream()
        .map(note -> new OrderNoteResponse(
            note.getId(),
            note.getNote(),
            note.getCreatedBy(),
            note.getCreatedAt()
        ))
        .collect(Collectors.toList());
    return ResponseEntity.ok(notes);
  }

  @PostMapping("/orders/{id}/notes")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<OrderNoteResponse> addOrderNote(@PathVariable Long id,
                                                        @Valid @RequestBody OrderNoteRequest request) {
    Order order = orderRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    OrderNote note = new OrderNote();
    note.setOrder(order);
    note.setNote(request.getNote());
    note.setCreatedBy(securityUtils.getCurrentUser().getEmail());
    OrderNote saved = orderNoteRepository.save(note);
    return ResponseEntity.ok(new OrderNoteResponse(
        saved.getId(),
        saved.getNote(),
        saved.getCreatedBy(),
        saved.getCreatedAt()
    ));
  }

  @PutMapping("/orders/update-status")
  public ResponseEntity<Void> updateOrderStatus(@Valid @RequestBody UpdateOrderStatusRequest request) {
    Order order = orderRepository.findById(request.getOrderId())
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    OrderStatus status = OrderStatus.valueOf(request.getStatus());
    order.setStatus(status);
    orderRepository.save(order);
    orderTrackingService.recordStatus(order, status);
    automationWebhookService.sendOrderStatusUpdated(order);
    if (status == OrderStatus.SHIPPED) {
      emailService.sendOrderShipped(order);
    }
    return ResponseEntity.ok().build();
  }

  @PatchMapping("/orders/{orderId}/items/{itemId}/pack")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> updateOrderItemPacked(@PathVariable Long orderId,
                                                    @PathVariable Long itemId,
                                                    @Valid @RequestBody UpdateOrderItemPackRequest request) {
    OrderItem item = orderItemRepository.findByIdAndOrderId(itemId, orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order item not found"));
    item.setPacked(request.getPacked());
    orderItemRepository.save(item);
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

    int previousStock = variant.getStock();
    if (request.getNewStock() != null) {
      variant.setStock(Math.max(0, request.getNewStock()));
    } else if (request.getDelta() != null) {
      variant.setStock(Math.max(0, variant.getStock() + request.getDelta()));
    }

    productVariantRepository.save(variant);
    int newStock = variant.getStock();
    if (previousStock != newStock) {
      StockMovement movement = new StockMovement();
      movement.setProductVariant(variant);
      movement.setPreviousStock(previousStock);
      movement.setNewStock(newStock);
      movement.setDelta(newStock - previousStock);
      movement.setReason("ADMIN_ADJUSTMENT");
      stockMovementRepository.save(movement);
    }
    return ResponseEntity.ok().build();
  }

  @GetMapping("/inventory/history")
  public ResponseEntity<List<StockMovementResponse>> getInventoryHistory(
      @RequestParam(required = false) Long productVariantId,
      @RequestParam(defaultValue = "50") int limit) {
    List<StockMovementResponse> items = stockMovementRepository
        .findRecent(productVariantId, PageRequest.of(0, Math.max(1, limit)))
        .stream()
        .map(movement -> new StockMovementResponse(
            movement.getId(),
            movement.getProductVariant().getProduct().getId(),
            movement.getProductVariant().getProduct().getName(),
            movement.getProductVariant().getId(),
            movement.getProductVariant().getColor(),
            movement.getProductVariant().getSize(),
            movement.getProductVariant().getSku(),
            movement.getDelta(),
            movement.getPreviousStock(),
            movement.getNewStock(),
            movement.getReason(),
            movement.getCreatedAt()
        ))
        .collect(Collectors.toList());
    return ResponseEntity.ok(items);
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
        .filter(user -> "CUSTOMER".equalsIgnoreCase(user.getRole().name()))
        .map(user -> new AdminUserResponse(
            user.getId(),
            user.getFirstName() + " " + user.getLastName(),
            user.getEmail(),
            orderRepository.countByUserId(user.getId()),
            user.getCreatedAt()
        ))
        .collect(Collectors.toList());
    return ResponseEntity.ok(users);
  }

  @GetMapping("/users/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AdminUserDetailResponse> getUserDetail(@PathVariable Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
    if (!"CUSTOMER".equalsIgnoreCase(user.getRole().name())) {
      throw new IllegalArgumentException("User not found");
    }

    List<AddressResponse> addresses = addressRepository.findByUserOrderByCreatedAtDesc(user).stream()
        .map(address -> new AddressResponse(
            address.getId(),
            address.getDepartment(),
            address.getCity(),
            address.getAddressLine(),
            address.getIsDefault()
        ))
        .collect(Collectors.toList());

    List<AdminUserDetailResponse.OrderSummary> recentOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(id)
        .stream()
        .limit(10)
        .map(order -> new AdminUserDetailResponse.OrderSummary(
            order.getId(),
            order.getCreatedAt(),
            order.getStatus().name(),
            order.getTotalAmount()
        ))
        .collect(Collectors.toList());

    AdminUserDetailResponse response = new AdminUserDetailResponse(
        user.getId(),
        user.getFirstName() + " " + user.getLastName(),
        user.getEmail(),
        user.getPhone(),
        user.getDocumentId(),
        user.getCreatedAt(),
        orderRepository.countByUserId(id),
        addresses,
        recentOrders
    );
    return ResponseEntity.ok(response);
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

  @GetMapping("/reports/sales/export")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<byte[]> exportSalesCsv() {
    List<Order> orders = orderRepository.findAll(Sort.by("createdAt").descending());
    Map<Long, Payment> payments = paymentRepository.findByOrderIdIn(
            orders.stream().map(Order::getId).collect(Collectors.toList()))
        .stream()
        .collect(Collectors.toMap(payment -> payment.getOrder().getId(), payment -> payment));

    StringBuilder csv = new StringBuilder();
    csv.append("order_id,created_at,customer,email,total,status,payment_method,payment_date\n");
    for (Order order : orders) {
      Payment payment = payments.get(order.getId());
      String customerName = order.getUser().getFirstName() + " " + order.getUser().getLastName();
      String paymentMethod = payment == null ? "" : payment.getPaymentMethod();
      String paymentDate = payment == null ? "" : payment.getCreatedAt().toString();
      csv.append(order.getId()).append(",");
      csv.append(csvEscape(order.getCreatedAt().toString())).append(",");
      csv.append(csvEscape(customerName)).append(",");
      csv.append(csvEscape(order.getUser().getEmail())).append(",");
      csv.append(order.getTotalAmount()).append(",");
      csv.append(csvEscape(order.getStatus().name())).append(",");
      csv.append(csvEscape(paymentMethod)).append(",");
      csv.append(csvEscape(paymentDate)).append("\n");
    }

    byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);
    HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaders.CONTENT_TYPE, "text/csv; charset=utf-8");
    headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"sales-report.csv\"");
    return ResponseEntity.ok().headers(headers).body(bytes);
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

  private String csvEscape(String value) {
    if (value == null) return "";
    String escaped = value.replace("\"", "\"\"");
    return "\"" + escaped + "\"";
  }
}
