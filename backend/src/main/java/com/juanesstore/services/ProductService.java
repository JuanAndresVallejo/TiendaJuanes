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
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
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
    return productRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  @Cacheable(value = "productById", key = "#id")
  public ProductResponse getById(Long id) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    return toResponse(product);
  }

  @Transactional(readOnly = true)
  @Cacheable(value = "productSearch", key = "#query")
  public List<ProductResponse> search(String query) {
    return productRepository.search(query).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  @Cacheable(value = "productFilter", key = "#category + '-' + #brand + '-' + #size + '-' + #color + '-' + #minPrice + '-' + #maxPrice")
  public List<ProductResponse> filter(String category, String brand, String size, String color,
                                      BigDecimal minPrice, BigDecimal maxPrice) {
    return productRepository.filter(category, brand, size, color, minPrice, maxPrice).stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getPaged(int page, int size) {
    return productRepository.findAll(PageRequest.of(page, size)).stream()
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
        product.getBrand(), product.getCategory(), product.getBasePrice(), product.getCreatedAt(), variants, images);
  }
}
