### BCryptPasswordEncoder 순환 참조 이슈

`BCryptPasswordEncoder`는 회원가입 시 비밀번호 암호화, 로그인 시 DB에 저장된 암호화된 값과 입력 값이 같은지 검증하는 기능을 제공하며, Spring Security를 이용해서 로그인 등을 할 때 꼭 필요한 클래스이다.
<br/><br/>

과거에 블로그 글을 따라 Spring Security를 이용한 회원가입, 로그인을 구현 중 이슈가 발생했다.<br/>
`BCryptPasswordEncoder`를 사용하기 위해 MemberServiceImpl 클래스에 추가하였더니 순환 참조 오류가 발생했다.<br/>

① SecurityConfig class에 @Bean으로 `BCryptPasswordEncoder` 변수 선언<br/>
② Social 로그인을 위해서 OAuth2 관련 class 기능 구현 중 MemberService 클래스 변수 선언<br/>
\*③ MemberServiceImpl class에서 @Autowired, @RequiredArgsConstructor 등 다양한 방법으로 가져오기 시도
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

application
<br/><br/>

##### ① 속성명 변경

MemberDto.java

```
package com.example.rmfr.member.dto;

import com.example.rmfr.member.entity.Members;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class MemberDto {
    private String memId;
    private String memPw;
    private String memEmail;
    private Integer memLevel;
    private LocalDateTime memPwUpdateDate;
    private String memPhone;
    private String zipcode;
    private String memAddr1;
    private String memAddr2;
}

```

<br/>

##### @JsonProperty("속성명")을 사용했을 때 해결 방법

MemberDto.java

```
package com.example.rmfr.member.dto;

import com.example.rmfr.member.entity.Members;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class MemberDto {
    @JsonProperty("mId")
    private String mId;
    @JsonProperty("mPw")
    private String mPw;
    @JsonProperty("mEmail")
    private String mEmail;
    private Integer mLevel;
    private LocalDateTime mPwUpdateDate;
    @JsonProperty("mPhone")
    private String mPhone;
    @JsonProperty("zipcode")
    private String zipcode;
    @JsonProperty("mAddr1")
    private String mAddr1;
    @JsonProperty("mAddr2")
    private String mAddr2;
}

```

##### ③ Getter, Setter 직접 생성

MemberDto.java

```
package com.example.rmfr.member.dto;

import com.example.rmfr.member.entity.Members;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
public class MemberDto {
    private String mId;
    private String mPw;
    private String mEmail;
    private Integer mLevel;
    private LocalDateTime mPwUpdateDate;
    private String mPhone;
    private String zipcode;
    private String mAddr1;
    private String mAddr2;

    public MemberDto() {}

    public String getMId() {
        return this.mId;
    }

    public void setMId(String mId) {
        this.mId = mId;
    }

    .
    .
    .
    .
}

```
