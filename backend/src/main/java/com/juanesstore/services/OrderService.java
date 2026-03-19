package com.juanesstore.services;

import com.juanesstore.dto.CreateOrderRequest;
import com.juanesstore.dto.OrderItemResponse;
import com.juanesstore.dto.OrderResponse;
import com.juanesstore.models.Address;
import com.juanesstore.models.CartItem;
import com.juanesstore.models.Coupon;
import com.juanesstore.models.Order;
import com.juanesstore.models.OrderItem;
import com.juanesstore.models.OrderStatus;
import com.juanesstore.models.Payment;
import com.juanesstore.models.PaymentStatus;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.models.User;
import com.juanesstore.repositories.AddressRepository;
import com.juanesstore.repositories.CartItemRepository;
import com.juanesstore.repositories.CouponRepository;
import com.juanesstore.repositories.OrderRepository;
import com.juanesstore.repositories.PaymentRepository;
import com.juanesstore.repositories.ProductVariantRepository;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
  private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
  private final OrderRepository orderRepository;
  private final CartItemRepository cartItemRepository;
  private final AddressRepository addressRepository;
  private final ProductVariantRepository productVariantRepository;
  private final CouponService couponService;
  private final CouponRepository couponRepository;
  private final PaymentRepository paymentRepository;
  private final EmailService emailService;
  private final OrderTrackingService orderTrackingService;
  private final AutomationWebhookService automationWebhookService;

  public OrderService(OrderRepository orderRepository,
                      CartItemRepository cartItemRepository,
                      AddressRepository addressRepository,
                      ProductVariantRepository productVariantRepository,
                      CouponService couponService,
                      CouponRepository couponRepository,
                      PaymentRepository paymentRepository,
                      EmailService emailService,
                      OrderTrackingService orderTrackingService,
                      AutomationWebhookService automationWebhookService) {
    this.orderRepository = orderRepository;
    this.cartItemRepository = cartItemRepository;
    this.addressRepository = addressRepository;
    this.productVariantRepository = productVariantRepository;
    this.couponService = couponService;
    this.couponRepository = couponRepository;
    this.paymentRepository = paymentRepository;
    this.emailService = emailService;
    this.orderTrackingService = orderTrackingService;
    this.automationWebhookService = automationWebhookService;
  }

  @Transactional
  public OrderResponse createOrder(User user, CreateOrderRequest request) {
    List<CartItem> cartItems = cartItemRepository.findByUser(user);
    if (cartItems.isEmpty()) {
      throw new IllegalArgumentException("Cart is empty");
    }

    if (request.getAddressId() == null) {
      if (isBlank(request.getDepartment()) || isBlank(request.getCity()) || isBlank(request.getAddressLine())) {
        throw new IllegalArgumentException("Address information is required");
      }
    }

    Address address = resolveAddress(user, request);
    Shipping shipping = calculateShipping(address.getDepartment(), address.getCity(), request.getExpress());

    Order order = new Order();
    order.setUser(user);
    order.setStatus(OrderStatus.PENDING);
    order.setPaymentStatus(PaymentStatus.PENDING);
    order.setShippingAddress(address.getDepartment() + ", " + address.getCity() + " - " + address.getAddressLine());
    order.setShippingType(shipping.type);
    order.setNotes(request.getNotes());

    BigDecimal total = BigDecimal.ZERO;
    for (CartItem cartItem : cartItems) {
      ProductVariant variant = cartItem.getProductVariant();
      if (variant.getStock() < cartItem.getQuantity()) {
        throw new IllegalArgumentException("Insufficient stock for variant " + variant.getId());
      }
      variant.setStock(variant.getStock() - cartItem.getQuantity());
      productVariantRepository.save(variant);
      BigDecimal price = variant.getPrice();
      BigDecimal line = price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
      total = total.add(line);

      OrderItem orderItem = new OrderItem();
      orderItem.setOrder(order);
      orderItem.setProductVariant(variant);
      orderItem.setQuantity(cartItem.getQuantity());
      orderItem.setPrice(price);
      orderItem.setPacked(false);
      order.getItems().add(orderItem);
    }

    BigDecimal orderSubtotal = total.add(shipping.cost);
    BigDecimal discount = BigDecimal.ZERO;
    if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
      var validation = couponService.validate(
          new com.juanesstore.dto.CouponValidateRequest(request.getCouponCode(), orderSubtotal)
      );
      if (!validation.isValid()) {
        throw new IllegalArgumentException(validation.getMessage());
      }
      discount = validation.getDiscount();
      Coupon coupon = couponRepository.findByCodeIgnoreCase(request.getCouponCode())
          .orElseThrow(() -> new IllegalArgumentException("El cupón no es válido"));
      couponService.markUsed(coupon);
    }

    order.setTotalAmount(orderSubtotal.subtract(discount));
    Order saved = orderRepository.save(order);
    cartItemRepository.deleteByUser(user);
    orderTrackingService.recordStatus(saved, OrderStatus.PENDING);
    logger.info("Order created id={} user={}", saved.getId(), user.getEmail());
    emailService.sendOrderConfirmation(saved);
    automationWebhookService.sendOrderCreated(saved);

    String paymentMethod = request.getPaymentMethod() == null ? "MERCADOPAGO" : request.getPaymentMethod();
    if (!"MERCADOPAGO".equalsIgnoreCase(paymentMethod)) {
      Payment payment = new Payment();
      payment.setOrder(saved);
      payment.setPaymentMethod(paymentMethod.toUpperCase());
      payment.setStatus(PaymentStatus.PENDING);
      paymentRepository.save(payment);
    }

    return toResponse(saved);
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> getMyOrders(User user) {
    return orderRepository.findByUserWithItems(user).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public OrderResponse getOrderById(User user, Long id) {
    Order order = orderRepository.findOrderWithItems(id)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    if (!order.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Order not found");
    }
    return toResponse(order);
  }

  @Transactional
  public void reorder(User user, Long orderId) {
    Order order = orderRepository.findOrderWithItems(orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    if (!order.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Order not found");
    }
    for (OrderItem item : order.getItems()) {
      ProductVariant variant = item.getProductVariant();
      if (variant.getStock() < item.getQuantity()) {
        throw new IllegalArgumentException("Insufficient stock for variant " + variant.getId());
      }
      CartItem cartItem = cartItemRepository.findByUserIdAndProductVariantId(user.getId(), variant.getId())
          .orElseGet(() -> {
            CartItem created = new CartItem();
            created.setUser(user);
            created.setProductVariant(variant);
            created.setQuantity(0);
            return created;
          });
      cartItem.setQuantity(cartItem.getQuantity() + item.getQuantity());
      cartItemRepository.save(cartItem);
    }
  }

  private OrderResponse toResponse(Order order) {
    List<OrderItemResponse> items = order.getItems().stream()
        .map(item -> new OrderItemResponse(
            item.getProductVariant().getId(),
            item.getProductVariant().getProduct().getName(),
            item.getProductVariant().getProduct().getRefCode(),
            item.getProductVariant().getColor(),
            item.getProductVariant().getSize(),
            item.getQuantity(),
            item.getPrice(),
            item.getProductVariant().getProduct().getImages().isEmpty()
                ? null
                : item.getProductVariant().getProduct().getImages().get(0).getImageUrl()
        ))
        .collect(Collectors.toList());

    return new OrderResponse(
        order.getId(),
        order.getTotalAmount(),
        order.getStatus().name(),
        order.getPaymentStatus().name(),
        order.getShippingAddress(),
        order.getShippingType(),
        order.getNotes(),
        order.getCreatedAt(),
        items
    );
  }

  private Address resolveAddress(User user, CreateOrderRequest request) {
    if (request.getAddressId() != null) {
      Address address = addressRepository.findById(request.getAddressId())
          .orElseThrow(() -> new IllegalArgumentException("Address not found"));
      if (!address.getUser().getId().equals(user.getId())) {
        throw new IllegalArgumentException("Address not found");
      }
      return address;
    }
    Address address = new Address();
    address.setUser(user);
    address.setDepartment(request.getDepartment());
    address.setCity(request.getCity());
    address.setAddressLine(request.getAddressLine());
    address.setIsDefault(false);
    return address;
  }

  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }

  private Shipping calculateShipping(String department, String city, Boolean express) {
    boolean expressRequested = express != null && express;
    if (!expressRequested) {
      return new Shipping("STANDARD", BigDecimal.ZERO);
    }
    LocalTime now = LocalTime.now(ZoneId.systemDefault());
    if (!now.isBefore(LocalTime.of(14, 0))) {
      return new Shipping("STANDARD", BigDecimal.ZERO);
    }
    if (!"Antioquia".equalsIgnoreCase(department)) {
      throw new IllegalArgumentException("Express shipping not available for this department");
    }
    if ("Medellin".equalsIgnoreCase(city)) {
      return new Shipping("EXPRESS", BigDecimal.valueOf(10000));
    }
    Set<String> nearby = Set.of("Bello", "Sabaneta", "Itagui", "La Estrella");
    if (nearby.stream().anyMatch(c -> c.equalsIgnoreCase(city))) {
      return new Shipping("EXPRESS", BigDecimal.valueOf(20000));
    }
    throw new IllegalArgumentException("Express shipping not available for this city");
  }

  private static class Shipping {
    private final String type;
    private final BigDecimal cost;

    private Shipping(String type, BigDecimal cost) {
      this.type = type;
      this.cost = cost;
    }
  }
}
