package com.juanesstore.controllers;

import com.juanesstore.dto.ProductResponse;
import com.juanesstore.services.FavoriteService;
import com.juanesstore.utils.SecurityUtils;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
  private final FavoriteService favoriteService;
  private final SecurityUtils securityUtils;

  public FavoriteController(FavoriteService favoriteService, SecurityUtils securityUtils) {
    this.favoriteService = favoriteService;
    this.securityUtils = securityUtils;
  }

  @GetMapping
  @PreAuthorize("hasRole('CUSTOMER')")
  public ResponseEntity<List<ProductResponse>> getFavorites() {
    return ResponseEntity.ok(favoriteService.getFavorites(securityUtils.getCurrentUser()));
  }

  @PostMapping("/{productId}")
  @PreAuthorize("hasRole('CUSTOMER')")
  public ResponseEntity<Void> addFavorite(@PathVariable Long productId) {
    favoriteService.addFavorite(securityUtils.getCurrentUser(), productId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{productId}")
  @PreAuthorize("hasRole('CUSTOMER')")
  public ResponseEntity<Void> removeFavorite(@PathVariable Long productId) {
    favoriteService.removeFavorite(securityUtils.getCurrentUser(), productId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{productId}")
  @PreAuthorize("hasRole('CUSTOMER')")
  public ResponseEntity<Boolean> isFavorite(@PathVariable Long productId) {
    return ResponseEntity.ok(favoriteService.isFavorite(securityUtils.getCurrentUser(), productId));
  }
}
