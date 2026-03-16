package com.juanesstore.services;

import com.juanesstore.dto.CreateOrderRequest;
import com.juanesstore.dto.OrderItemResponse;
import com.juanesstore.dto.OrderResponse;
import com.juanesstore.models.Address;
import com.juanesstore.models.CartItem;
import com.juanesstore.models.Order;
import com.juanesstore.models.OrderItem;
import com.juanesstore.models.OrderStatus;
import com.juanesstore.models.PaymentStatus;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.models.User;
import com.juanesstore.repositories.AddressRepository;
import com.juanesstore.repositories.CartItemRepository;
import com.juanesstore.repositories.OrderRepository;
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
  private final EmailService emailService;
  private final OrderTrackingService orderTrackingService;

  public OrderService(OrderRepository orderRepository,
                      CartItemRepository cartItemRepository,
                      AddressRepository addressRepository,
                      EmailService emailService,
                      OrderTrackingService orderTrackingService) {
    this.orderRepository = orderRepository;
    this.cartItemRepository = cartItemRepository;
    this.addressRepository = addressRepository;
    this.emailService = emailService;
    this.orderTrackingService = orderTrackingService;
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
      BigDecimal price = variant.getPrice();
      BigDecimal line = price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
      total = total.add(line);

      OrderItem orderItem = new OrderItem();
      orderItem.setOrder(order);
      orderItem.setProductVariant(variant);
      orderItem.setQuantity(cartItem.getQuantity());
      orderItem.setPrice(price);
      order.getItems().add(orderItem);
    }

    order.setTotalAmount(total.add(shipping.cost));
    Order saved = orderRepository.save(order);
    cartItemRepository.deleteByUser(user);
    orderTrackingService.recordStatus(saved, OrderStatus.PENDING);
    logger.info("Order created id={} user={}", saved.getId(), user.getEmail());
    emailService.sendOrderConfirmation(saved);
    return toResponse(saved);
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> getMyOrders(User user) {
    return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public OrderResponse getOrderById(User user, Long id) {
    Order order = orderRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    if (!order.getUser().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Order not found");
    }
    return toResponse(order);
  }

  private OrderResponse toResponse(Order order) {
    List<OrderItemResponse> items = order.getItems().stream()
        .map(item -> new OrderItemResponse(
            item.getProductVariant().getId(),
            item.getProductVariant().getProduct().getName(),
            item.getProductVariant().getColor(),
            item.getProductVariant().getSize(),
            item.getQuantity(),
            item.getPrice()
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
