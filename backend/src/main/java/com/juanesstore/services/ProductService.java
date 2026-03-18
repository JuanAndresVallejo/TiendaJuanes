package com.juanesstore.services;

import com.juanesstore.dto.ProductCreateRequest;
import com.juanesstore.dto.ProductImageRequest;
import com.juanesstore.dto.ProductImageResponse;
import com.juanesstore.dto.ProductResponse;
import com.juanesstore.dto.ProductVariantRequest;
import com.juanesstore.dto.ProductVariantResponse;
import com.juanesstore.models.Product;
import com.juanesstore.models.ProductImage;
import com.juanesstore.models.ProductVariant;
import com.juanesstore.repositories.ProductRepository;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @Transactional(readOnly = true)
  @Cacheable("products")
  public List<ProductResponse> getAll() {
    return productRepository.findAll().stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  @Cacheable(value = "productById", key = "#id")
  public ProductResponse getById(Long id) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    return toResponse(product);
  }

  @Transactional(readOnly = true)
  public Page<ProductResponse> searchPaged(String query, Pageable pageable) {
    return productRepository.search(query, pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public Page<ProductResponse> filterPaged(String category, String brand, String size, String color,
                                           BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
    return productRepository.filter(category, brand, size, color, minPrice, maxPrice, pageable)
        .map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public Page<ProductResponse> searchAndFilterPaged(String query, String category, String brand, String size,
                                                    String color, BigDecimal minPrice, BigDecimal maxPrice,
                                                    Pageable pageable) {
    return productRepository.searchAndFilter(query, category, brand, size, color, minPrice, maxPrice, pageable)
        .map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public Page<ProductResponse> getPaged(int page, int size, String sort, String direction) {
    Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
    Pageable pageable;
    if ("best_sellers".equalsIgnoreCase(sort)) {
      pageable = PageRequest.of(page, size);
      return productRepository.findBestSellers(pageable).map(this::toResponse);
    }
    String sortBy = "createdAt";
    if ("price".equalsIgnoreCase(sort)) sortBy = "basePrice";
    if ("name".equalsIgnoreCase(sort)) sortBy = "name";
    if ("created_at".equalsIgnoreCase(sort)) sortBy = "createdAt";
    pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
    return productRepository.findAll(pageable).map(this::toResponse);
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getFeatured(int limit) {
    return productRepository.findByFeaturedTrue(PageRequest.of(0, limit)).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getNewest(int limit) {
    return productRepository.findNewest(PageRequest.of(0, limit)).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getBestSellers(int limit) {
    return productRepository.findBestSellers(PageRequest.of(0, limit)).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getRelated(Long productId, int limit) {
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    String category = product.getCategory();
    if (category == null || category.isBlank()) {
      return List.of();
    }
    return productRepository.findRelated(category, productId, PageRequest.of(0, limit)).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getByIds(String ids) {
    if (ids == null || ids.isBlank()) {
      return List.of();
    }
    List<Long> idList = Arrays.stream(ids.split(","))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .map(Long::valueOf)
        .collect(Collectors.toList());
    return productRepository.findByIdIn(idList).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  @CacheEvict(value = {"products", "productById", "productSearch", "productFilter"}, allEntries = true)
  public ProductResponse create(ProductCreateRequest request) {
    Product product = new Product();
    mapToProduct(product, request);
    return toResponse(productRepository.save(product));
  }

  @Transactional
  @CacheEvict(value = {"products", "productById", "productSearch", "productFilter"}, allEntries = true)
  public ProductResponse update(Long id, ProductCreateRequest request) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    product.getImages().clear();
    product.getVariants().clear();
    mapToProduct(product, request);
    return toResponse(productRepository.save(product));
  }

  @Transactional
  @CacheEvict(value = {"products", "productById", "productSearch", "productFilter"}, allEntries = true)
  public void delete(Long id) {
    productRepository.deleteById(id);
  }

  private void mapToProduct(Product product, ProductCreateRequest request) {
    product.setName(request.getName());
    product.setRefCode(request.getRefCode());
    product.setDescription(request.getDescription());
    product.setBrand(request.getBrand());
    product.setCategory(request.getCategory());
    product.setBasePrice(request.getBasePrice());
    product.setFeatured(request.getFeatured() != null && request.getFeatured());
    product.setTags(request.getTags());
    product.setDiscountPercentage(request.getDiscountPercentage() != null ? request.getDiscountPercentage() : 0);

    if (request.getVariants() != null) {
      for (ProductVariantRequest variantRequest : request.getVariants()) {
        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setColor(variantRequest.getColor());
        variant.setSize(variantRequest.getSize());
        variant.setSku(variantRequest.getSku());
        variant.setPrice(variantRequest.getPrice());
        variant.setStock(variantRequest.getStock());
        product.getVariants().add(variant);
      }
    }

    if (request.getImages() != null) {
      for (ProductImageRequest imageRequest : request.getImages()) {
        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setImageUrl(imageRequest.getImageUrl());
        product.getImages().add(image);
      }
    }
  }

  private ProductResponse toResponse(Product product) {
    List<ProductVariantResponse> variants = product.getVariants().stream()
        .map(v -> new ProductVariantResponse(v.getId(), v.getColor(), v.getSize(), v.getSku(), v.getPrice(), v.getStock()))
        .collect(Collectors.toList());
    List<ProductImageResponse> images = product.getImages().stream()
        .map(i -> new ProductImageResponse(i.getId(), i.getImageUrl()))
        .collect(Collectors.toList());
    return new ProductResponse(product.getId(), product.getName(), product.getRefCode(), product.getDescription(),
        product.getBrand(), product.getCategory(), product.getFeatured(), product.getTags(),
        product.getDiscountPercentage(), product.getBasePrice(), product.getCreatedAt(), variants, images);
  }
}
