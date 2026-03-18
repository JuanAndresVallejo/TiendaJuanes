package com.juanesstore.controllers;

import com.juanesstore.dto.ProductResponse;
import com.juanesstore.services.ProductService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public ResponseEntity<?> getProducts(@RequestParam(required = false) Integer page,
                                       @RequestParam(required = false) Integer size,
                                       @RequestParam(required = false) String search,
                                       @RequestParam(required = false) String category,
                                       @RequestParam(required = false) String brand,
                                       @RequestParam(required = false) String sizeParam,
                                       @RequestParam(required = false) String color,
                                       @RequestParam(required = false) BigDecimal minPrice,
                                       @RequestParam(required = false) BigDecimal maxPrice,
                                       @RequestParam(required = false, defaultValue = "created_at") String sort,
                                       @RequestParam(required = false, defaultValue = "desc") String dir) {
    boolean hasFilters = (search != null && !search.isBlank())
        || (category != null && !category.isBlank())
        || (brand != null && !brand.isBlank())
        || (sizeParam != null && !sizeParam.isBlank())
        || (color != null && !color.isBlank())
        || minPrice != null
        || maxPrice != null;

    if (page != null || size != null || hasFilters) {
      int safePage = page == null ? 0 : page;
      int safeSize = size == null ? 20 : size;
      Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
      String sortBy = "createdAt";
      if ("price".equalsIgnoreCase(sort)) sortBy = "basePrice";
      if ("name".equalsIgnoreCase(sort)) sortBy = "name";
      if ("created_at".equalsIgnoreCase(sort)) sortBy = "createdAt";
      PageRequest pageable = PageRequest.of(safePage, safeSize, Sort.by(direction, sortBy));

      if (hasFilters) {
        Page<ProductResponse> result = productService.searchAndFilterPaged(
            search, category, brand, sizeParam, color, minPrice, maxPrice, pageable
        );
        return ResponseEntity.ok(ProductPageResponse.from(result));
      }
      Page<ProductResponse> result = productService.getPaged(safePage, safeSize, sort, dir);
      return ResponseEntity.ok(ProductPageResponse.from(result));
    }
    return ResponseEntity.ok(productService.getAll());
  }

  @GetMapping("/paged")
  public ResponseEntity<ProductPageResponse> getProductsPaged(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "20") int size,
                                                              @RequestParam(defaultValue = "created_at") String sort,
                                                              @RequestParam(defaultValue = "desc") String dir) {
    Page<ProductResponse> result = productService.getPaged(page, size, sort, dir);
    return ResponseEntity.ok(ProductPageResponse.from(result));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
    return ResponseEntity.ok(productService.getById(id));
  }

  @GetMapping("/search")
  public ResponseEntity<ProductPageResponse> search(@RequestParam("q") String query,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
    Page<ProductResponse> result = productService.searchPaged(query, PageRequest.of(page, size));
    return ResponseEntity.ok(ProductPageResponse.from(result));
  }

  @GetMapping("/filter")
  public ResponseEntity<ProductPageResponse> filter(@RequestParam(required = false) String category,
                                                    @RequestParam(required = false) String brand,
                                                    @RequestParam(required = false) String size,
                                                    @RequestParam(required = false) String color,
                                                    @RequestParam(required = false) BigDecimal minPrice,
                                                    @RequestParam(required = false) BigDecimal maxPrice,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int sizeParam) {
    Page<ProductResponse> result = productService.filterPaged(category, brand, size, color, minPrice, maxPrice,
        PageRequest.of(page, sizeParam));
    return ResponseEntity.ok(ProductPageResponse.from(result));
  }

  @GetMapping("/featured")
  public ResponseEntity<List<ProductResponse>> featured(@RequestParam(defaultValue = "8") int limit) {
    return ResponseEntity.ok(productService.getFeatured(limit));
  }

  @GetMapping("/new")
  public ResponseEntity<List<ProductResponse>> newest(@RequestParam(defaultValue = "8") int limit) {
    return ResponseEntity.ok(productService.getNewest(limit));
  }

  @GetMapping("/best-sellers")
  public ResponseEntity<List<ProductResponse>> bestSellers(@RequestParam(defaultValue = "8") int limit) {
    return ResponseEntity.ok(productService.getBestSellers(limit));
  }

  @GetMapping("/{id}/related")
  public ResponseEntity<List<ProductResponse>> related(@PathVariable Long id,
                                                       @RequestParam(defaultValue = "6") int limit) {
    return ResponseEntity.ok(productService.getRelated(id, limit));
  }

  @GetMapping("/by-ids")
  public ResponseEntity<List<ProductResponse>> byIds(@RequestParam("ids") String ids) {
    return ResponseEntity.ok(productService.getByIds(ids));
  }

  public static class ProductPageResponse {
    private List<ProductResponse> items;
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;

    public ProductPageResponse(List<ProductResponse> items, int page, int size, int totalPages, long totalElements) {
      this.items = items;
      this.page = page;
      this.size = size;
      this.totalPages = totalPages;
      this.totalElements = totalElements;
    }

    public static ProductPageResponse from(Page<ProductResponse> page) {
      return new ProductPageResponse(
          page.getContent(),
          page.getNumber(),
          page.getSize(),
          page.getTotalPages(),
          page.getTotalElements()
      );
    }

    public List<ProductResponse> getItems() {
      return items;
    }

    public int getPage() {
      return page;
    }

    public int getSize() {
      return size;
    }

    public int getTotalPages() {
      return totalPages;
    }

    public long getTotalElements() {
      return totalElements;
    }
  }
}
