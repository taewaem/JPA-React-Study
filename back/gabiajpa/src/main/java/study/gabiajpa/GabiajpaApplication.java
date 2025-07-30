package study.gabiajpa;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import study.gabiajpa.service.ProductService;
import study.gabiajpa.web.dto.ProductDto;

import java.math.BigDecimal;
import java.util.stream.IntStream;

@SpringBootApplication
public class GabiajpaApplication {

    public static void main(String[] args) {
        SpringApplication.run(GabiajpaApplication.class, args);
    }

    @Bean
    public CommandLineRunner init(ProductService productService) {
        return args -> {
            // 더미 데이터 생성
            IntStream.rangeClosed(1, 10).forEach(i -> {
                ProductDto.CreateRequest request = ProductDto.CreateRequest.builder()
                        .name("test 상품 " + i)
                        .price(new BigDecimal(10000 + i * 1000))
                        .category("test 카테코리")
                        .description("this is test product " + i)
                        .imageUrl("https://via.placeholder.com/150")
                        .stockQuantity(100)
                        .build();
                productService.createProduct(request);
            });
        };
    }
}
