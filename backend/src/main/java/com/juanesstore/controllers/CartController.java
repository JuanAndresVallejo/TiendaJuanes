package com.juanesstore.controllers;

import com.juanesstore.dto.AddToCartRequest;
import com.juanesstore.dto.CartItemResponse;
import com.juanesstore.dto.UpdateCartRequest;
import com.juanesstore.models.User;
import com.juanesstore.services.CartService;
import com.juanesstore.utils.SecurityUtils;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
  private final CartService cartService;
  private final SecurityUtils securityUtils;

  public CartController(CartService cartService, SecurityUtils securityUtils) {
    this.cartService = cartService;
    this.securityUtils = securityUtils;
  }

  @PostMapping("/add")
  public ResponseEntity<Void> add(@Valid @RequestBody AddToCartRequest request) {
    User user = securityUtils.getCurrentUser();
    cartService.addToCart(user, request);
    return ResponseEntity.ok().build();
  }

  @GetMapping
  public ResponseEntity<List<CartItemResponse>> getCart() {
    User user = securityUtils.getCurrentUser();
    return ResponseEntity.ok(cartService.getCart(user));
  }

  @DeleteMapping("/remove")
  public ResponseEntity<Void> remove(@RequestParam Long productVariantId) {
    User user = securityUtils.getCurrentUser();
    cartService.removeFromCart(user, productVariantId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/update")
  public ResponseEntity<Void> update(@Valid @RequestBody UpdateCartRequest request) {
    User user = securityUtils.getCurrentUser();
    cartService.updateQuantity(user, request);
    return ResponseEntity.ok().build();
  }
}
