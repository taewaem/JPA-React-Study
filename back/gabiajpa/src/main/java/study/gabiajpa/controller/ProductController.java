package study.gabiajpa.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import study.gabiajpa.service.ProductService;
import study.gabiajpa.web.dto.ProductDto;

import java.util.List;

//@Tag(name = "상품", description = "상품 관리 API")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

//    @Operation(summary = "상품 목록 조회", description = "페이지네이션을 지원하는 상품 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<Page<ProductDto.ProductResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto.ProductResponse> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

//    @Operation(summary = "상품 상세 조회", description = "특정 상품의 상세 정보를 조회합니다.")
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDto.ProductResponse> getProduct(@PathVariable Long productId) {
        ProductDto.ProductResponse product = productService.getProduct(productId);
        return ResponseEntity.ok(product);
    }

//    @Operation(summary = "상품 검색", description = "키워드, 카테고리, 가격 범위로 상품을 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto.ProductResponse>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        ProductDto.SearchRequest request = ProductDto.SearchRequest.builder()
                .keyword(keyword)
                .category(category)
                .minPrice(minPrice != null ? new java.math.BigDecimal(minPrice) : null)
                .maxPrice(maxPrice != null ? new java.math.BigDecimal(maxPrice) : null)
                .status(status != null ? study.gabiajpa.domain.Product.Status.valueOf(status) : null)
                .page(page)
                .size(size)
                .build();

        Page<ProductDto.ProductResponse> products = productService.searchProducts(request);
        return ResponseEntity.ok(products);
    }

//    @Operation(summary = "최신 상품 조회", description = "최근 등록된 상품 10개를 조회합니다.")
    @GetMapping("/latest")
    public ResponseEntity<List<ProductDto.ProductResponse>> getLatestProducts() {
        List<ProductDto.ProductResponse> products = productService.getLatestProducts();
        return ResponseEntity.ok(products);
    }

//    @Operation(summary = "상품 등록", description = "새로운 상품을 등록합니다.")
    @PostMapping
    public ResponseEntity<ProductDto.ProductResponse> createProduct(@Valid @RequestBody ProductDto.CreateRequest request) {
        ProductDto.ProductResponse product = productService.createProduct(request);
        return ResponseEntity.ok(product);
    }

//    @Operation(summary = "상품 수정", description = "기존 상품 정보를 수정합니다.")
    @PutMapping("/{productId}")
    public ResponseEntity<ProductDto.ProductResponse> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductDto.UpdateRequest request) {
        ProductDto.ProductResponse product = productService.updateProduct(productId, request);
        return ResponseEntity.ok(product);
    }

//    @Operation(summary = "상품 삭제", description = "상품을 비활성화합니다.")
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }
}
