package com.juanesstore.controllers;

import com.juanesstore.services.MercadoPagoService;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
  private final JdbcTemplate jdbcTemplate;
  private final RedisConnectionFactory redisConnectionFactory;
  private final MercadoPagoService mercadoPagoService;
  private final JavaMailSender mailSender;
  private final RestTemplate restTemplate = new RestTemplate();

  public HealthController(JdbcTemplate jdbcTemplate,
                          RedisConnectionFactory redisConnectionFactory,
                          MercadoPagoService mercadoPagoService,
                          JavaMailSender mailSender) {
    this.jdbcTemplate = jdbcTemplate;
    this.redisConnectionFactory = redisConnectionFactory;
    this.mercadoPagoService = mercadoPagoService;
    this.mailSender = mailSender;
  }

  @GetMapping("/api/health")
  public ResponseEntity<Map<String, Object>> health() {
    Map<String, Object> status = new HashMap<>();
    status.put("backend", "UP");
    status.put("api", "UP");
    status.put("timestamp", Instant.now().toString());

    status.put("postgres", checkPostgres() ? "UP" : "DOWN");
    status.put("redis", checkRedis() ? "UP" : "DOWN");
    status.put("nginx", checkNginx() ? "UP" : "DOWN");
    status.put("mercadopago", mercadoPagoService.isConfigured() ? "UP" : "DOWN");
    status.put("smtp", checkSmtp() ? "UP" : "DOWN");

    return ResponseEntity.ok(status);
  }

  private boolean checkPostgres() {
    try {
      jdbcTemplate.queryForObject("SELECT 1", Integer.class);
      return true;
    } catch (Exception ex) {
      return false;
    }
  }

  private boolean checkRedis() {
    try (var connection = redisConnectionFactory.getConnection()) {
      String ping = connection.ping();
      return ping != null && !ping.isBlank();
    } catch (Exception ex) {
      return false;
    }
  }

  private boolean checkNginx() {
    try {
      restTemplate.getForEntity("http://nginx", String.class);
      return true;
    } catch (Exception ex) {
      return false;
    }
  }

  private boolean checkSmtp() {
    try {
      mailSender.createMimeMessage();
      return true;
    } catch (Exception ex) {
      return false;
    }
  }
}
