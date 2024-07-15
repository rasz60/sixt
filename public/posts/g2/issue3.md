### @RequestBody 속성명 매핑 이슈

Axios를 통해 Post 방식으로 JSON Parameter를 전송했다.<br/>
그 다음 Spring-boot RestController에서 @RequestBody 어노테이션을 이용해, parameter를 DTO로 변환하여 사용하려고 했다.<br/>
JSON 속성명을 DTO 클래스의 속성명과 동일하게 맞추어주면, @RequestBody 어노테이션이 자동로 속성을 매핑하여 변환해주는 것으로 알고 있다.(이건 사실이다..🤔)
<br/><br/>

그치만 컨트롤러에서 DTO를 확인해보면 속성이 모두 Null이었다.🙃
<br/><br/>

MemberRestController.java

```
package com.example.rmfr.member.controller;

import com.example.rmfr.member.dto.MemberDto;
import com.example.rmfr.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MemberRestController {

    private final MemberService memberService;

    @PostMapping("/signup")
    @ResponseBody
    public String signup(@RequestBody MemberDto memberDto) {
        return memberService.signup(memberDto);
    }

}

```

MemberDto.java

```
package com.example.rmfr.member.dto;

import com.example.rmfr.member.entity.Members;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
@Data
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
}

```

### 🙆‍♂️ 해결

결국.... 아무것도 아니였다.<br/>
lombok으로 생성된 getter, setter는 camelcase 형태로 속성명을 변경하는데,<br/>
제일 앞자리 한글자만 소문자일 때 getMID()인지 getmid()인지 잘은 모르겠지만 어쨌든 개발자의 의도와 다른 형태로 getter, setter가 생성된다고 한다.
<br/><br/>

이럴 때의 해결책은 ① 속성명을 변경하는 것과 ② @JsonProperty 어노테이션을 사용, ③ getter, setter 직접 생성하는 방법이 있는데,<br/>
전체 표준에 예외를 만들지 않기 위해서 속성명을 memId, memPw와 같은 형태로 변경했다.
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
