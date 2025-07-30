package study.gabiajpa.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import study.gabiajpa.domain.Member;
import study.gabiajpa.repository.MemberRepository;
import study.gabiajpa.web.dto.MemberDto;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MemberDto.MemberResponse signUp(MemberDto.SignUpRequest request) {
        // 중복 검사
        if (memberRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 사용자명입니다.");
        }

        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Member member = Member.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .role(Member.Role.USER)
                .build();

        Member savedMember = memberRepository.save(member);
        return MemberDto.MemberResponse.from(savedMember);
    }

    public MemberDto.LoginResponse login(MemberDto.LoginRequest request) {
        Member member = memberRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return MemberDto.LoginResponse.builder()
                .username(member.getUsername())
                .email(member.getEmail())
                .nickname(member.getNickname())
                .role(member.getRole())
                .build();
    }

    public MemberDto.MemberResponse getMemberInfo(String username) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return MemberDto.MemberResponse.from(member);
    }

    @Transactional
    public MemberDto.MemberResponse updateMember(String username, MemberDto.UpdateRequest request) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (request.getNickname() != null) {
            member.setNickname(request.getNickname());
        }

        if (request.getEmail() != null) {
            member.setEmail(request.getEmail());
        }

        return MemberDto.MemberResponse.from(member);
    }
}
