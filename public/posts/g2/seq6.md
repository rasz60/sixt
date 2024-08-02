### 로그인 구현 (1/2)

회원가입 페이지 작성을 마쳤으니 이제 로그인 기능이 필요하다.<br/>
구현할 로그인 기능의 처리 순서는 아래와 같고, backend 부터 하나씩 구현해보았다.
<br/><br/>

`로그인 처리 순서`<br/>
&nbsp; ① 화면에서 RestAPI로 로그인 URL을 호출 (/rest/login)<br/>
&nbsp; ② Spring Security에서 인증처리<br/>
&nbsp; ③-⑴ 로그인 성공 시, 전달받은 로그인 정보를 브라우저 local storage에 입력 (로그인 여부, token, 만료일자)<br/>
&nbsp; ③-⑵ 로그인 실패 시, alert 창 안내 문구 출력 (로그인 정보 오류 or 통신 오류)<br/>
&nbsp; ④ root URL로 redirect<br/>
&nbsp; ⑤ local storage에 로그인 정보 확인하여 로그인/로그아웃 버튼 활성화 여부 결정
<br/><br/>

##### 1. Spring Security 설정

제일 먼저 그 동안 개발을 위해 주석처리 해두었던 security를 활성화해야한다.<br/>
만약 주석을 제거한 이 후에도 제대로 build되지 않으면 IDE를 껐다가 다시 build하는 것을 추천한다.
<br/><br/>

build.gradle

```
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.3.1'
	id 'io.spring.dependency-management' version '1.1.5'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-security' // 주석 제거!!
	implementation 'org.springframework.boot:spring-boot-starter-web'
	compileOnly 'org.projectlombok:lombok'
	developmentOnly 'org.springframework.boot:spring-boot-devtools'
	runtimeOnly 'com.mysql:mysql-connector-j'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.security:spring-security-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'

	// javamail
	implementation 'org.springframework.boot:spring-boot-starter-mail'
}

tasks.named('test') {
	useJUnitPlatform()
}
```

이 다음부터가 복잡했다. form 로그인은 비교적 간단한데, RestAPI 방식으로 로그인할 때는 약간..이 아니고 꽤나 많은 커스텀이 필요했다.<br/>
하우에버❗❕ form 로그인은 예전에 해봤기 때문에 이번에는 기필코 Rest 방식으로 해보려고 한다.😎
<br/><br/>

구글링으로 찾은 [@kide77](https://velog.io/@kide77/Spring-Boot-3.x-Security-Rest-API-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%9A%94%EC%B2%AD%EB%B6%80-%EA%B5%AC%ED%98%84-1)님의 블로그를 참고하면서 작성했다.
<br/><br/>

/src/java/main/com/example/rmfr/config/custom/CustomAuthenticationFilter.java

###### -> '/rest/login' URL로 들어왔을 때, 인증을 처리할 filter 클래스

```
package com.example.rmfr.config.custom;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StringUtils;

import java.io.IOException;

// Security 인증 단계 custom
public class CustomAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    private ObjectMapper objectMapper = new ObjectMapper();

    public CustomAuthenticationFilter() {
        // url과 일치할 경우 필터가 동작
        super(new AntPathRequestMatcher("/rest/login"));
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        // 1. HTTP.POST 체크
        if(!"POST".equals(request.getMethod())) {
            throw new IllegalStateException("Authentication is not supported");
        }

        // 2. loginDto 매핑
        LoginDto loginDto = objectMapper.readValue(request.getReader(), LoginDto.class);

        // 3. ID, PASSWORD 가 있는지 확인
        if(!StringUtils.hasLength(loginDto.getMemId()) || !StringUtils.hasLength(loginDto.getMemPw())) {
            throw new IllegalArgumentException("username or password is empty");
        }

        // 4. 인증 되지 않은 토큰 생성
        CustomAuthenticationToken token = new CustomAuthenticationToken(loginDto.getMemId(), loginDto.getMemPw());

        // 5. manager에게 토큰 인증 처리
        Authentication authenticate = getAuthenticationManager().authenticate(token);

        return authenticate;
    }

    // 내부 클래스 loginDto
    @Data
    public static class LoginDto {
        private String memId;
        private String memPw;
    }
}
```

<br/><br/>

/src/java/main/com/example/rmfr/config/custom/CustomAuthenticationToken.java

###### -> ID와 PW를 이용하여 인증 token을 생성하는 클래스, principal = ID / credentials = PW

```
package com.example.rmfr.config.custom;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;
import org.springframework.util.Assert;

import java.util.Collection;

public class CustomAuthenticationToken extends AbstractAuthenticationToken {

    private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

    private final Object principal;

    private Object credentials;

    // 인증 전 생성자
    public CustomAuthenticationToken(Object principal, Object credentials) {
        super(null);
        this.principal = principal;
        this.credentials = credentials;
        setAuthenticated(false);
    }

    // 인증 후 생성자
    public CustomAuthenticationToken(Object principal, Object credentials,
                                     Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.credentials = credentials;
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return this.credentials;
    }

    @Override
    public Object getPrincipal() {
        return this.principal;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        Assert.isTrue(!isAuthenticated,
                "Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        super.setAuthenticated(false);
    }

    @Override
    public void eraseCredentials() {
        super.eraseCredentials();
        this.credentials = null;
    }
}
```

<br/><br/>

/src/java/main/com/example/rmfr/config/AppConfig.java

###### -> Spring Sequrity 비밀번호 암호화 인코더 Bean 설정 [🔗issue#4. BCryptPasswordEncoder 순환참조 이슈](/#/logging/24)

```
package com.example.rmfr.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AppConfig {
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() { return new BCryptPasswordEncoder(); }
}
```

<br/><br/>

/src/java/main/com/example/rmfr/member/service/MemberServiceImpl.java

###### -> Spring Security 비밀번호 encoder 변수 추가

###### -> 회원 가입 시 입력한 비밀번호 암호화 로직 추가 ( 적용 전 가입한 데이터가 있다면 삭제할 것 ❗ )

###### -> Spring Security에서 로그인 시 아이디를 parameter로 회원 정보를 가져오는 메서드 추가

```
package com.example.rmfr.member.service;

import com.example.rmfr.member.dto.MemberDto;
import com.example.rmfr.member.entity.Members;
import com.example.rmfr.member.repository.MemberRepository;
import com.example.rmfr.utils.MailUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Base64Util;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService, UserDetailsService { // UserDetailsService implements 추가

    private final MemberRepository memberRepository;
    private final MailUtils mailUtils;
    private final BCryptPasswordEncoder bCryptPasswordEncoder; // 추가

    .
    .

    @Transactional
    @Override
    public String signup(MemberDto memberDto) {
        String rst = "";
        try {
            memberDto.setMemPw(bCryptPasswordEncoder.encode(memberDto.getMemPw())); // spring security 비밀번호 암호화 적용
            rst = memberRepository.save(Members.builder().memberDto(memberDto).build()).getMemId();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rst;
    }

    .
    .

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException { // 추가
        Members member = memberRepository.findByMemIdAndMemDelYn(username, "N")
                .orElseThrow(() -> new UsernameNotFoundException("username not found"));

        return member;
    }
}
```

<br/><br/>

/src/java/main/com/example/rmfr/config/custom/CustomAuthenticationProvider.java

###### -> MemberService를 호출하여 입력된 값이 맞는지 검증하고 credential 값(PW) 설정

```
package com.example.rmfr.config.custom;

import com.example.rmfr.member.entity.Members;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String loginId = authentication.getName();
        String password = (String) authentication.getCredentials();

        Members entity = (Members) userDetailsService.loadUserByUsername(loginId); // 아이디로 회원정보 조회

        if(!passwordEncoder.matches(password, entity.getPassword())) { // 인코딩한 패스워드 검증
            throw new BadCredentialsException("Invalid Password"); // 패스워드 불일치 시 BadCrendentialException return
        }

        return new CustomAuthenticationToken(entity, null, entity.getAuthorities()); // 인증 토큰 '인증 완료'로 생성하여 리턴
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(CustomAuthenticationToken.class);
    }
}
```

<br/><br/>

/src/main/java/com/example/rmfr/config/custom/CustomAuthenticationSuccessHandler.java

###### -> 인증 성공 시 Response

###### &nbsp;&nbsp;&nbsp;① response.setStatus() : 응답 상태 값, HttpStatus.OK.value() => 200

###### &nbsp;&nbsp;&nbsp;② response.setContentType() : 응답 컨텐츠 타입, JSON

###### &nbsp;&nbsp;&nbsp;③ objectMapper.writeValue(writer, value) : Member.memUuid를 base64로 인코딩하여 response.data로 화면에 전송

```
package com.example.rmfr.config.custom;

import com.example.rmfr.member.entity.Members;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.util.Base64Util;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        Members member =  (Members)authentication.getPrincipal();

        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        objectMapper.writeValue(response.getWriter(), Base64Util.encode(member.getMemUuid()));
    }
}
```

<br/><br/>

/src/main/java/com/example/rmfr/config/custom/CustomAuthenticationFailureHandler.java

###### -> 인증 실패 시 Response

###### &nbsp;&nbsp;&nbsp;① response.setStatus() : 응답 상태 값, HttpStatus.UNAUTHORIZED.value() => 401

###### &nbsp;&nbsp;&nbsp;② response.setContentType() : 응답 컨텐츠 타입, JSON

###### &nbsp;&nbsp;&nbsp;③ response.setCharacterEncoding() : 응답 컨텐츠 인코딩 값, 에러 메시지가 한글이기 때문에 UTF-8로 설정

###### &nbsp;&nbsp;&nbsp;③ objectMapper.writeValue(writer, value) : 에러메시지를 response.data로 화면에 전송

```
package com.example.rmfr.config.custom;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String errMsg = "가입되지 않은 아이디입니다.";

        if (exception instanceof BadCredentialsException) {
            errMsg = "아이디나 비밀번호를 다시 확인해주세요.";
        }

        else if(exception instanceof DisabledException) {
            errMsg = "오랜 시간 접속하지 않아 잠긴 계정입니다.";
        }

        else if(exception instanceof CredentialsExpiredException) {
            errMsg = "비밀번호가 만료되었습니다.";
        }

        objectMapper.writeValue(response.getWriter(), errMsg);
    }
}
```

<br/><br/>

/src/main/java/com/example/rmfr/config/custom/CustomAuthenticationEntrypoint.java

###### -> 로그인되지 않은 계정 접근 시 exception 처리

```
package com.example.rmfr.config.custom;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntrypoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "UnAuthorized");
    }
}
```

<br/><br/>
/src/main/java/com/example/rmfr/config/custom/CustomAuthenticationDeniedHandler.java

###### -> 로그인 계정의 리소스 접근 권한 미보유 시 exception 처리

```
package com.example.rmfr.config.custom;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access is denied");
    }
}
```

<br/><br/>

이제 RestAPI 로그인을 위한 filter 처리를 마쳤고, Spring Security 설정을 해보자.

<br/><br/>

/src/main/java/com/example/rmfr/config/SecurityConfig.java

###### -> Spring Security의 설정 클래스

```
package com.example.rmfr.config;

import com.example.rmfr.config.custom.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;
    private final CustomAuthenticationEntrypoint authenticationEntryPoint;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final CustomAuthenticationDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // security v6.1.0부터 람다식 함수형으로 설정
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .headers((headerConfig) ->
                        headerConfig.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)
                )
                .authorizeHttpRequests((authorizeRequests) ->authorizeRequests.anyRequest().permitAll()) // 모든 URL 접근 가능 설정
                .exceptionHandling(config -> config
                        .authenticationEntryPoint(authenticationEntryPoint) // 로그인하지 않은 계정 접근 시
                        .accessDeniedHandler(accessDeniedHandler) // 로그인 계정의 리소스 접근 권한 미보유 시
                )
                .logout((logoutConfig) ->
                        logoutConfig
                                .logoutUrl("/logout")
                                .logoutSuccessUrl("/")
                )
                .addFilterBefore(ajaxAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class) // ajax 요청일 때 filter 추가
        ;

        return http.build();
    }

    @Bean
    public CustomAuthenticationFilter ajaxAuthenticationFilter() throws Exception { // ajax 요청일 때, custom한 filter 클래스가 동작하게 설정
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter();
        customAuthenticationFilter.setAuthenticationManager(authenticationManager());
        customAuthenticationFilter.setAuthenticationSuccessHandler(customAuthenticationSuccessHandler); // 성공 시 처리
        customAuthenticationFilter.setAuthenticationFailureHandler(customAuthenticationFailureHandler); // 실패 시 처리

        customAuthenticationFilter.setSecurityContextRepository(
                new DelegatingSecurityContextRepository(
                        new RequestAttributeSecurityContextRepository(),
                        new HttpSessionSecurityContextRepository()
                ));

        return customAuthenticationFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

```

Spring Security 동작을 위한 클래스 추가를 마쳤다.<br/>
다음으로는 로그인 처리를 위한 화면을 구성해보자.😎
