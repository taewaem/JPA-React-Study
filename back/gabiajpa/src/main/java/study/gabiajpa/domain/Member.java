package study.gabiajpa.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity             //데이터베이스와 매핑(영속성 컨텍스트)
@Getter
@Setter
@Builder
@NoArgsConstructor  //기본 생성자
@AllArgsConstructor //모든 필드를 매개변수로 받는 생성자
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MEMBER_ID")
    private Long id;

    @Column(name = "USERNAME", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "EMAIL", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @Column(name = "NICKNAME", length = 50)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE", nullable = false)
    private Role role;

    //생성 일자
    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    //수정 일자
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    //저장 전 동작(insert into 전에 자동 실행)
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (role == null) {
            role = Role.USER;
        }
    }

    //수정 전 동작
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    public enum Role {
        USER, ADMIN
    }

}
