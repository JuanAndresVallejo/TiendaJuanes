package com.juanesstore.services;

import com.juanesstore.dto.AddToCartRequest;
import com.juanesstore.dto.CartItemResponse;
import com.juanesstore.dto.UpdateCartRequest;
import com.juanesstore.models.CartItem;
import com.juanesstore.models.ProductImage;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.models.User;
import com.juanesstore.repositories.CartItemRepository;
import com.juanesstore.repositories.ProductVariantRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {
  private final CartItemRepository cartItemRepository;
  private final ProductVariantRepository productVariantRepository;

  public CartService(CartItemRepository cartItemRepository, ProductVariantRepository productVariantRepository) {
    this.cartItemRepository = cartItemRepository;
    this.productVariantRepository = productVariantRepository;
  }

  @Transactional
  public void addToCart(User user, AddToCartRequest request) {
    ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
        .orElseThrow(() -> new IllegalArgumentException("Variant not found"));
    if (variant.getStock() <= 0) {
      throw new IllegalArgumentException("Producto sin stock");
    }

    CartItem item = cartItemRepository.findByUserIdAndProductVariantId(user.getId(), variant.getId())
        .orElseGet(() -> {
          CartItem newItem = new CartItem();
          newItem.setUser(user);
          newItem.setProductVariant(variant);
          newItem.setQuantity(0);
          return newItem;
        });

    int newQty = item.getQuantity() + request.getQuantity();
    if (newQty > variant.getStock()) {
      throw new IllegalArgumentException("Stock insuficiente");
    }
    item.setQuantity(newQty);
    cartItemRepository.save(item);
  }

  @Transactional(readOnly = true)
  public List<CartItemResponse> getCart(User user) {
    return cartItemRepository.findByUser(user).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public void removeFromCart(User user, Long productVariantId) {
    CartItem item = cartItemRepository.findByUserIdAndProductVariantId(user.getId(), productVariantId)
        .orElseThrow(() -> new IllegalArgumentException("Item not found"));
    cartItemRepository.delete(item);
  }

  @Transactional
  public void updateQuantity(User user, UpdateCartRequest request) {
    CartItem item = cartItemRepository.findByUserIdAndProductVariantId(user.getId(), request.getProductVariantId())
        .orElseThrow(() -> new IllegalArgumentException("Item not found"));
    ProductVariant variant = item.getProductVariant();
    if (request.getQuantity() > variant.getStock()) {
      throw new IllegalArgumentException("Stock insuficiente");
    }
    item.setQuantity(request.getQuantity());
    cartItemRepository.save(item);
  }

  @Transactional
  public void clear(User user) {
    cartItemRepository.deleteByUser(user);
  }

  private CartItemResponse toResponse(CartItem item) {
    ProductVariant variant = item.getProductVariant();
    String imageUrl = null;
    if (variant.getProduct() != null && !variant.getProduct().getImages().isEmpty()) {
      ProductImage image = variant.getProduct().getImages().get(0);
      imageUrl = image.getImageUrl();
    }
    return new CartItemResponse(
        item.getId(),
        variant.getId(),
        variant.getProduct().getName(),
        variant.getColor(),
        variant.getSize(),
        item.getQuantity(),
        variant.getPrice(),
        imageUrl
    );
  }
}
