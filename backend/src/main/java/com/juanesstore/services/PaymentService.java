package com.juanesstore.services;

import com.juanesstore.dto.CreatePreferenceResponse;
import com.juanesstore.models.Order;
import com.juanesstore.models.OrderStatus;
import com.juanesstore.models.Payment;
import com.juanesstore.models.PaymentStatus;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.repositories.OrderRepository;
import com.juanesstore.repositories.PaymentRepository;
import com.juanesstore.repositories.ProductVariantRepository;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.preference.Preference;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {
  private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
  private final MercadoPagoService mercadoPagoService;
  private final OrderRepository orderRepository;
  private final PaymentRepository paymentRepository;
  private final ProductVariantRepository productVariantRepository;
  private final EmailService emailService;
  private final OrderTrackingService orderTrackingService;

  public PaymentService(MercadoPagoService mercadoPagoService,
                        OrderRepository orderRepository,
                        PaymentRepository paymentRepository,
                        ProductVariantRepository productVariantRepository,
                        EmailService emailService,
                        OrderTrackingService orderTrackingService) {
    this.mercadoPagoService = mercadoPagoService;
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
    this.productVariantRepository = productVariantRepository;
    this.emailService = emailService;
    this.orderTrackingService = orderTrackingService;
  }

  @Transactional
  public CreatePreferenceResponse createPreference(Long orderId) throws Exception {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    Preference preference = mercadoPagoService.createPreference(order);
    return new CreatePreferenceResponse(preference.getId(), preference.getInitPoint());
  }

  @Transactional
  public void handleWebhook(Map<String, Object> payload) throws Exception {
    mercadoPagoService.configure();
    String type = valueAsString(payload.get("type"));
    if (type == null || !type.equalsIgnoreCase("payment")) {
      return;
    }
    Map<String, Object> data = (Map<String, Object>) payload.get("data");
    if (data == null || data.get("id") == null) {
      return;
    }

    Long paymentId = Long.parseLong(data.get("id").toString());
    PaymentClient client = new PaymentClient();
    com.mercadopago.resources.payment.Payment payment = client.get(paymentId);

    String externalReference = payment.getExternalReference();
    if (externalReference == null) {
      return;
    }

    Long orderId = Long.parseLong(externalReference);
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new IllegalArgumentException("Order not found"));

    String status = payment.getStatus();
    if ("approved".equalsIgnoreCase(status)) {
      order.setPaymentStatus(PaymentStatus.APPROVED);
      order.setStatus(OrderStatus.PAID);
      for (var item : order.getItems()) {
        ProductVariant variant = item.getProductVariant();
        int newStock = Math.max(0, variant.getStock() - item.getQuantity());
        variant.setStock(newStock);
        productVariantRepository.save(variant);
      }
      orderTrackingService.recordStatus(order, OrderStatus.PAID);
      emailService.sendPaymentConfirmed(order);
      logger.info("Payment approved orderId={} paymentId={}", order.getId(), paymentId);
    } else if ("rejected".equalsIgnoreCase(status)) {
      order.setPaymentStatus(PaymentStatus.REJECTED);
      logger.warn("Payment rejected orderId={} paymentId={}", order.getId(), paymentId);
    }

    orderRepository.save(order);

    Payment paymentRecord = new Payment();
    paymentRecord.setOrder(order);
    paymentRecord.setMercadoPagoPaymentId(String.valueOf(paymentId));
    paymentRecord.setPaymentMethod(payment.getPaymentMethodId());
    if ("approved".equalsIgnoreCase(status)) {
      paymentRecord.setStatus(PaymentStatus.APPROVED);
    } else if ("rejected".equalsIgnoreCase(status)) {
      paymentRecord.setStatus(PaymentStatus.REJECTED);
    } else {
      paymentRecord.setStatus(PaymentStatus.PENDING);
    }
    paymentRepository.save(paymentRecord);
  }

  private String valueAsString(Object value) {
    return value == null ? null : value.toString();
  }
}
