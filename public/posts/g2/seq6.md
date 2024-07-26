### 로그인 구현

회원가입 페이지 작성을 마쳤으니 이제 로그인 기능이 필요하다.<br/>
구현할 로그인 기능의 처리 순서는 아래와 같고, backend 부터 하나씩 구현해보았다.
<br/><br/>

`로그인 처리 순서`<br/>
&nbsp; ① 화면에서 RestAPI로 로그인 URL을 호출 (/rest/login)<br/>
&nbsp; ② Spring Security에서 인증처리<br/>
&nbsp; ③-⑴ 로그인 성공 시, 전달받은 로그인 정보를 브라우저 local storage에 입력 (로그인 여부, credential, 만료일자)<br/>
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

그 다음부터는 굉장히 복잡했다. 구글링으로 찾은 [@kide77](https://velog.io/@kide77/Spring-Boot-3.x-Security-Rest-API-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%9A%94%EC%B2%AD%EB%B6%80-%EA%B5%AC%ED%98%84-1)님의 블로그를 참고하면서 작성했다.<br/>
form 로그인은 비교적 간단한데, RestAPI 방식으로 로그인할 때는 약간..이지만 꽤 많은 커스텀이 필요했다.
<br/><br/>

/src/java/main/com/example/rmfr/config/custom/CustomAuthenticationFilter.java

###### '/rest/login' URL로 들어왔을 때, 인증을 처리할 filter 클래스

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

/src/java/main/com/example/rmfr/config/custom/CustomAuthenticationToken.java

###### ID와 PW를 이용하여 인증 token을 생성하는 클래스, principal = ID / credentials = PW

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

/src/java/main/com/example/rmfr/config/AppConfig.java

###### Spring Sequrity 비밀번호 암호화 인코더 Bean 설정 [#issue]()

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

/src/java/main/com/example/rmfr/member/service/MemberServiceImpl.java

###### Spring Security 비밀번호 encoder 변수 추가

###### 회원 가입 시 입력한 비밀번호 암호화 로직 추가 ( 적용 전 가입한 데이터가 있다면 삭제할 것 ❗ )

###### Spring Security에서 로그인 시 아이디를 parameter로 회원 정보를 가져오는 메서드 추가

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
        Members member = memberRepository.findByMemId(username)
                .orElseThrow(() -> new UsernameNotFoundException("username not found"));

        return member;
    }
}
```

/src/java/main/com/example/rmfr/config/custom/CustomAuthenticationProvider.java

######

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

##### ① 로그인 화면 구성

로그인 페이지는 상단 메뉴에 위치하고, 로그인되지 않았을 때만 활성화한다.<br/>
이메일 인증 때 사용했던 vuetify overlay component를 이용해서 만들었다.
<br/><br/>

/frontend/src/views/HeaderView.vue

```
<script setup>
import LoginDialog from "@/components/overlay/LoginDialog.vue";
</script>
<template>
  <v-overlay
    v-model="loginDisplay"
    id="overlay"
    scroll-strategy="block"
    persistent
  >
    <LoginDialog @sendMessage="setLoginDisplay" />
  </v-overlay>

  <v-layout id="header">
    <v-app-bar id="headerMenu">
      <template v-slot:prepend>
        <v-app-bar-title id="logo">
          <router-link to="/">
            <v-icon icon="mdi-alpha-r" class="logo-icons alpha" />
            <v-icon icon="mdi-alpha-m" class="logo-icons alpha" />
            <v-icon icon="mdi-alpha-f" class="logo-icons alpha" />
            <v-icon icon="mdi-alpha-r" class="logo-icons alpha" />
            <v-icon icon="mdi-help" class="logo-icons" />
          </router-link>
        </v-app-bar-title>
      </template>

      <template v-slot:append>
        <div id="buttonBox">
          <v-btn
            class="headerBtn"
            @click="$router.push('/signup')"
            v-show="!loginFlag"
          >
            <v-icon icon="mdi-account-plus"></v-icon>
            <v-tooltip location="bottom center" activator="parent">
              Signup
            </v-tooltip>
          </v-btn>

          <v-btn
            class="headerBtn"
            @click.stop="loginDisplay = !loginDisplay"
            v-show="!loginFlag"
          >
            <v-icon icon="mdi-key"></v-icon>
            <v-tooltip location="bottom center" activator="parent">
              login
            </v-tooltip>
          </v-btn>

          <v-btn class="headerBtn" @click.stop="fnLogout" v-show="loginFlag">
            <v-icon icon="mdi-logout"></v-icon>
            <v-tooltip location="bottom center" activator="parent">
              logout
            </v-tooltip>
          </v-btn>
        </div>
      </template>
    </v-app-bar>
  </v-layout>
</template>

<script>
export default {
  name: "headerView",
  data() {
    return {
      loginDisplay: false,
      loginFlag: false,
    };
  },
  created() {
    this.loginFlag = this.$loginInfo.login;
  },
  methods: {
    setLoginDisplay(obj) {
      this.loginDisplay = obj.loginDisplay;
    },
    fnLogout() {
      this.$loginInfo.expired = -1;
      location.href = "/logout";
    },
  },
};
</script>

<style>
.findInfo {
  color: darkblue;
  text-decoration: underline;
}

.findInfo:hover {
  color: purple;
  cursor: pointer;
}
</style>

```

/frontend/src/components/overlay/LoginDialog.vue

```
<script setup>
import VerifyDialog from "@/components/overlay/EmailVerifyDialog.vue";
</script>
<template>
  <v-overlay v-model="overlay" id="overlay" scroll-strategy="block" persistent>
    <VerifyDialog
      ref="verifyDialog"
      @sendMessage="fnChildMessage"
      :memEmail="find.memEmail"
    />
  </v-overlay>
  <v-card
    class="py-8 px-6 text-center mx-auto ma-4"
    min-width="400"
    width="100%"
  >
    <div class="d-flex">
      <v-spacer></v-spacer>
      <v-icon icon="mdi-close" @click="fnLoginDisplayReset" />
    </div>

    <h3 class="text-h5 mb-4">{{ cardTitle }}</h3>

    <v-sheet color="surface" class="mb-4">
      <v-text-field
        variant="underlined"
        label="ID"
        v-show="!findId"
        v-model="login.memId"
        :rules="loginChk"
      ></v-text-field>
      <v-text-field
        variant="underlined"
        label="Password"
        type="password"
        v-show="!findId"
        v-model="login.memPw"
        :rules="loginChk"
      ></v-text-field>
      <v-text-field
        variant="underlined"
        label="Email"
        type="email"
        v-show="findId || findPw"
        v-model="login.memEmail"
        :append-icon="flag ? `mdi-email` : `mdi-email-outline`"
        @click:append="fnValid"
      ></v-text-field>
    </v-sheet>

    <div class="text-caption">
      <span class="findInfo" @click.stop="findId = true" v-if="!findId"
        >아이디 찾기</span
      >
      &nbsp;&nbsp;
      <span class="findInfo" @click.stop="findPw = true" v-if="!findPw"
        >비밀번호 찾기</span
      >
      &nbsp;&nbsp;
      <span
        class="findInfo"
        @click.stop="
          findId = false;
          findPw = false;
        "
        v-if="findId || findPw"
        >로그인 하기</span
      >
    </div>

    <v-btn
      class="my-4"
      color="primary"
      height="40"
      text="Login"
      variant="flat"
      width="70%"
      @click="fnLogin"
    ></v-btn>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      login: {
        memId: "",
        memPw: "",
      },
      find: {
        memId: "",
        memEmail: "",
        flag: false,
      },
      cardTitle: "Login",
      findId: false,
      findPw: false,
      overlay: false,
    };
  },
  computed: {
    loginChk() {
      const rules = [];

      const nullChk = (v) => {
        if (v) return true;
        return "필수 입력사항입니다.";
      };

      rules.push(nullChk);
      return rules;
    },
  },
  methods: {
    fnLoginDisplayReset() {
      this.$emit("sendMessage", { loginDisplay: false });
    },
    async fnLogin() {
      if (
        this.loginChk[0](this.login.memId) == true &&
        this.loginChk[0](this.login.memPw) == true
      ) {
        let data = {
          memId: this.login.memId,
          memPw: this.login.memPw,
        };

        await this.axios
          .post("/rest/login", data)
          .then((res) => {
            if (res.status == 200) {
              // 로그인 창 닫기
              this.fnLoginDisplayReset();

              // 로그인 정보 localStorage 입력
              this.$loginInfo.login = true;
              this.$loginInfo.credentials = res.data;
              this.$loginInfo.expired =
                new Date().getTime() + 24 * 60 * 60 * 1000;

              if (this.$route.fullPath == "/") {
                this.$router.go(0); // referer화면이 root URL일 때는 새로고침
              } else {
                this.$router.push("/"); // root URL로 화면 전환
              }
            }
          })
          .catch((err) => {
            if (err.code == "ERR_BAD_REQUEST") {
              // 로그인 실패 메시지 (아이디, 비밀번호 확인)
              alert(err.response.data);
            } else {
              // 통신 오류
              alert("시스템 오류로 인해 로그인에 실패했습니다.");
            }
          });
      } else {
        alert("필수 입력사항을 입력해주세요.");
        return false;
      }
    },
  },
  watch: {
    findId(v) {
      if (v) {
        this.findPw = false;
        this.cardTitle = "Find ID";
      } else {
        if (!this.findPw) this.cardTitle = "Login";
      }
    },
    findPw(v) {
      if (v) {
        this.findId = false;
        this.cardTitle = "Find Password";
      } else {
        if (!this.findId) this.cardTitle = "Login";
      }
    },
  },
};
</script>

```
