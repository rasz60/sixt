### BCryptPasswordEncoder 순환 참조 이슈

`BCryptPasswordEncoder`는 회원가입 시 비밀번호 암호화, 로그인 시 DB에 저장된 암호화된 값과 입력 값이 같은지 검증하는 기능을 제공한다.<br/>
Spring Security를 이용해서 로그인 등을 할 때 꼭 필요한 클래스이다.
<br/><br/>

과거에 블로그 글을 따라 Spring Security를 이용한 회원가입, 로그인을 구현 중 이슈가 발생했다.<br/>
`BCryptPasswordEncoder`를 사용하기 위해 MemberServiceImpl 클래스에 추가하였더니 순환 참조 오류가 발생했다.<br/>

① SecurityConfig class에 @Bean으로 `BCryptPasswordEncoder` 변수 선언<br/>
② SecurityConfig class에 Social 로그인을 위해서 OAuth2 관련 class 기능 구현 중 MemberService 클래스 변수 선언<br/>
\*③ MemberServiceImpl class에서 @Autowired, @RequiredArgsConstructor 등 다양한 방법으로 `BCryptPasswordEncoder` 가져오기 시도
<br/><br/>

```
The dependencies of some of the beans in the application context form a cycle:

┌─────┐
|  principalOauth2UserService (field private org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder com.cos.security1.config.outh.PrincipalOauth2UserService.bCryptPasswordEncoder)
↑     ↓
|  securityConfig defined in file [~~~path~~~\classes\\com\\cos\\security1\\config\\SecurityConfig.class]
└─────┘

Action:

Relying upon circular references is discouraged and they are prohibited by default. Update your application to remove the dependency cycle between beans. As a last resort, it may be possible to break the cycle automatically by setting spring.main.allow-circular-references to true.

Process finished with exit code 0
```

### 🙆‍♂️ 해결

다 지나고 나서 보면 이해가 되는데 그 때는 아무것도 짐작이 되지 않았다.<br/>
SecurityConfig 클래스에서 설정한 @Bean을 MemberService에서 가져다가 써야하는데, SecurityConfig 클래스 안에 MemberService가 final 변수로 선언되어있어 엉키게 되는 구조이다.<br/>

AppConfig 이라는 클래스를 따로 만들어서 `BCryptPasswordEncoder`를 @Bean으로 만들게하여 SecurityConfig과 MemberService간 순환 참조를 해결했다.
<br/><br/>

AppConfig.java

```
package com.example.rmfr.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AppConfig {
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

```
