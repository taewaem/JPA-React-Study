package study.gabiajpa.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import study.gabiajpa.web.dto.MemberDto;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//리팩토링 안정성: 내부 구조를 바꿔도 동작이 일관성 있게 잘 작동하는지 보장하기 위함
//단위 테스트(Unit-Test): 함수 또는 클래스별 테스트
//통합 테스트(Integration Test): 여러 컴포넌트 함꼐 동작 확인
//E2E 테스트(End-To-End Test): 실제 사용자가 시나리오 전체를 검증
@SpringBootTest
@AutoConfigureMockMvc       //요청, 응답에 대한 자동 시물레이션
@Transactional // 각 테스트 후 자동 커밋 & DB 롤백(단 테스트한 데이터는 실제와 상관없음)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // 공통 회원가입 데이터
    private MemberDto.SignUpRequest baseUser;

    @BeforeEach //각 테스트 실행 전에 수행됨
    void setUp() throws Exception {
        // 테스트마다 동일한 회원을 미리 가입시킴
        baseUser = new MemberDto.SignUpRequest();
        baseUser.setUsername("baseuser");
        baseUser.setEmail("baseuser@example.com");
        baseUser.setPassword("password123");
        baseUser.setNickname("기본유저");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(baseUser)))
                .andExpect(status().isOk());
    }


    @Test
    @DisplayName("회원가입 성공 - 새로운 사용자")
    void signUp_success() throws Exception {
        MemberDto.SignUpRequest request = new MemberDto.SignUpRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setNickname("새유저");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.email").value("newuser@example.com"));
    }

    //이미 가입된 이메일로 회원가입 시 실패하는 검증
    //실패시 HTTP 400 Bad Request
    @Test
    @DisplayName("회원가입 실패 - 중복 이메일")
    void signUp_fail_duplicateEmail() throws Exception {
        MemberDto.SignUpRequest dupRequest = new MemberDto.SignUpRequest();
        dupRequest.setUsername("otheruser");
        dupRequest.setEmail("baseuser@example.com"); // 이미 가입된 이메일
        dupRequest.setPassword("password123");
        dupRequest.setNickname("다른유저");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("이미 존재하는 이메일입니다."));
    }

    @Test
    @DisplayName("로그인 성공")
    void login_success() throws Exception {
        MemberDto.LoginRequest loginRequest = new MemberDto.LoginRequest();
        loginRequest.setUsername("baseuser");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("baseuser"));
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 불일치")
    void login_fail_wrongPassword() throws Exception {
        MemberDto.LoginRequest loginRequest = new MemberDto.LoginRequest();
        loginRequest.setUsername("baseuser");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("비밀번호가 일치하지 않습니다."));
    }
}