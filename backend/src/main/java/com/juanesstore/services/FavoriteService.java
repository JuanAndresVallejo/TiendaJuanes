package com.juanesstore.services;

import com.juanesstore.dto.ProductResponse;
import com.juanesstore.models.Favorite;
import com.juanesstore.models.Product;
import com.juanesstore.models.User;
import com.juanesstore.repositories.FavoriteRepository;
import com.juanesstore.repositories.ProductRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {
  private final FavoriteRepository favoriteRepository;
  private final ProductRepository productRepository;
  private final ProductService productService;

  public FavoriteService(FavoriteRepository favoriteRepository,
                         ProductRepository productRepository,
                         ProductService productService) {
    this.favoriteRepository = favoriteRepository;
    this.productRepository = productRepository;
    this.productService = productService;
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getFavorites(User user) {
    return favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
        .map(Favorite::getProduct)
        .map(product -> productService.getById(product.getId()))
        .collect(Collectors.toList());
  }

  @Transactional
  public void addFavorite(User user, Long productId) {
    if (favoriteRepository.existsByUserIdAndProductId(user.getId(), productId)) {
      return;
    }
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    Favorite favorite = new Favorite();
    favorite.setUser(user);
    favorite.setProduct(product);
    favoriteRepository.save(favorite);
  }

  @Transactional
  public void removeFavorite(User user, Long productId) {
    favoriteRepository.deleteByUserIdAndProductId(user.getId(), productId);
  }

  @Transactional(readOnly = true)
  public boolean isFavorite(User user, Long productId) {
    return favoriteRepository.existsByUserIdAndProductId(user.getId(), productId);
  }
}
