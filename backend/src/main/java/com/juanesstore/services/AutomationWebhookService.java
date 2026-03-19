package com.juanesstore.services;

import com.juanesstore.models.Order;
import com.juanesstore.models.PaymentStatus;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AutomationWebhookService {
  private static final Logger logger = LoggerFactory.getLogger(AutomationWebhookService.class);
  private final String webhookUrl;
  private final RestTemplate restTemplate = new RestTemplate();

  public AutomationWebhookService(@Value("${app.automation.webhookUrl:}") String webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  public boolean isConfigured() {
    return webhookUrl != null && !webhookUrl.isBlank();
  }

  public void sendOrderCreated(Order order) {
    send("order.created", order, Map.of("paymentStatus", order.getPaymentStatus().name()));
  }

  public void sendPaymentApproved(Order order) {
    send("payment.approved", order, Map.of("paymentStatus", PaymentStatus.APPROVED.name()));
  }

  public void sendOrderStatusUpdated(Order order) {
    send("order.status.updated", order, Map.of("status", order.getStatus().name()));
  }

  private void send(String event, Order order, Map<String, Object> extra) {
    if (!isConfigured() || order == null || order.getUser() == null) {
      return;
    }
    try {
      Map<String, Object> payload = Map.of(
          "event", event,
          "orderId", order.getId(),
          "status", order.getStatus().name(),
          "totalAmount", order.getTotalAmount(),
          "customer", Map.of(
              "id", order.getUser().getId(),
              "fullName", order.getUser().getFirstName() + " " + order.getUser().getLastName(),
              "email", order.getUser().getEmail(),
              "phone", order.getUser().getPhone()
          ),
          "meta", extra
      );
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      restTemplate.postForEntity(webhookUrl, new HttpEntity<>(payload, headers), Void.class);
    } catch (Exception ex) {
      logger.warn("Automation webhook error event={} orderId={} message={}", event, order.getId(), ex.getMessage());
    }
  }
}
