package com.juanesstore.controllers;

import com.juanesstore.dto.ProductResponse;
import com.juanesstore.services.ProductService;
import java.math.BigDecimal;
import java.util.List;
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
  public ResponseEntity<List<ProductResponse>> getProducts(@RequestParam(required = false) Integer page,
                                                           @RequestParam(required = false) Integer size) {
    if (page != null && size != null) {
      return ResponseEntity.ok(productService.getPaged(page, size));
    }
    return ResponseEntity.ok(productService.getAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
    return ResponseEntity.ok(productService.getById(id));
  }

  @GetMapping("/search")
  public ResponseEntity<List<ProductResponse>> search(@RequestParam("q") String query) {
    return ResponseEntity.ok(productService.search(query));
  }

  @GetMapping("/filter")
  public ResponseEntity<List<ProductResponse>> filter(@RequestParam(required = false) String category,
                                                      @RequestParam(required = false) String brand,
                                                      @RequestParam(required = false) String size,
                                                      @RequestParam(required = false) String color,
                                                      @RequestParam(required = false) BigDecimal minPrice,
                                                      @RequestParam(required = false) BigDecimal maxPrice) {
    return ResponseEntity.ok(productService.filter(category, brand, size, color, minPrice, maxPrice));
  }
}
