package study.gabiajpa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS(Cross-Origin-Resource-Sharing)
 * 브라우저 보안: 다른 도메인(요청하지 않은 url)/포트 요청 공격 차단
 * 프론트엔드 - 백엔드 분리: React(5173) => Spring boot(8080)
 * APi 호출: 프론트에서 백엔드로 요청하는 것만 허용
 */
@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")                    //Cors정책 모든 URL패턴 적용
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("*")                            //모든 HTTP메서드 허용(GET, PUT,DELETE, PATCH)
                        .allowedHeaders("*")                            //모든 헤더("Content-Type", "Authorization")
                        .allowCredentials(true);                        //쿠키,인증 헤더 자격 증명.... 허용
            }
        };
    }
}
