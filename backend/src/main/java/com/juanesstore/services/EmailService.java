package com.juanesstore.services;

import com.juanesstore.models.Order;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  private final JavaMailSender mailSender;

  public EmailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  public void sendOrderConfirmation(Order order) {
    String subject = "Confirmación de tu pedido – Tienda Juanes";
    String body = "<h3>Gracias por tu compra</h3>" +
        "<p>Número de pedido: <strong>" + order.getId() + "</strong></p>" +
        "<p>Total: <strong>" + order.getTotalAmount() + "</strong></p>" +
        "<p>Dirección de envío: " + order.getShippingAddress() + "</p>";
    send(order.getUser().getEmail(), subject, body);
  }

  public void sendPaymentConfirmed(Order order) {
    send(order.getUser().getEmail(), "Tu pago fue confirmado",
        "<p>Tu pago del pedido <strong>" + order.getId() + "</strong> fue confirmado.</p>");
  }

  public void sendOrderShipped(Order order) {
    send(order.getUser().getEmail(), "Tu pedido está en camino",
        "<p>Tu pedido <strong>" + order.getId() + "</strong> fue enviado.</p>");
  }

  private void send(String to, String subject, String html) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(html, true);
      mailSender.send(message);
    } catch (Exception ex) {
      // Silent fail to avoid blocking flows when mail is not configured
    }
  }
}
