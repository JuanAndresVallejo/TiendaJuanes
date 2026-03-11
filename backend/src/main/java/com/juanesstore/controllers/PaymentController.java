package com.juanesstore.controllers;

import com.juanesstore.dto.CreatePreferenceRequest;
import com.juanesstore.dto.CreatePreferenceResponse;
import com.juanesstore.services.PaymentService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
  private final PaymentService paymentService;

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @PostMapping("/create-preference")
  public ResponseEntity<CreatePreferenceResponse> createPreference(@Valid @RequestBody CreatePreferenceRequest request)
      throws Exception {
    return ResponseEntity.ok(paymentService.createPreference(request.getOrderId()));
  }

  @PostMapping("/webhook")
  public ResponseEntity<Void> webhook(@RequestBody Map<String, Object> payload) throws Exception {
    paymentService.handleWebhook(payload);
    return ResponseEntity.ok().build();
  }
}
