### 회원가입 페이지 만들기 (2 / Backend) - Server 구성

이전 포스트에서 Vue 프로젝트 화면 구성과 /rest url 호출 시 8082 port 서버로 요청을 보내도록 설정을 마쳤다.<br/>
회원가입 페이지에서 서버로 요청을 보내는 기능은 아이디 중복 체크, 이메일 인증 번호 생성 및 발송, 회원 가입 3가지를 구현했다.
<br/><br/>

##### ① DTO

/src/main/java/com/example/rmfr/dto/MemberDto.java

```
package com.example.rmfr.member.dto;

import com.example.rmfr.member.entity.Members;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
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

아직은 회원가입 기능 뿐이기 때문에 entity와 동일한 필드로만 구성했다.
<br/><br/>

##### ② RestController

/src/main/java/com/example/rmfr/controller/MemberRestController.java<br/>

`@GET` /rest/signup/idDupChk/{memId} : 아이디 중복 체크<br/>
`@GET` /rest/signup/verifyCode/{memEmail} : 이메일 인증번호 생성 및 발송<br/>
`@POST` /rest/signup : 회원가입
<br/><br/>

`@RequiredArgsContructor` : 해당 클래스의 속성 중 final 속성을 가지는 생성자를 만들어주는 lombok 어노테이션<br/>
`@PathVariable(${속성명})` : 요청된 url의 속성명으로 지정한 자리에 들어온 값을 parameter 받아온다.<br/>
`@RequestBody <T>`<br/>
&nbsp; + front단에서 넘어온 JSON Parameter 다양한 형태의 객체형으로 전환한다.<br/>
&nbsp; + DTO 형태로 전환하는 과정에서 속성 매핑 이슈가 발생하여 해결했다. [🔗issue#3. @RequestBody 속성명 매핑 이슈](/#/logging/22)<br/>

```
package com.example.rmfr.member.controller;

import com.example.rmfr.member.dto.MemberDto;
import com.example.rmfr.member.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MemberRestController {

    private final MemberService memberService;

    @GetMapping("/rest/signup/idDupChk/{memId}")
    public Long idDupChk(@PathVariable("memId") String memId) {
        return memberService.idDupChk(memId);
    }
    @GetMapping("/rest/signup/verifyCode/{memEmail}")
    public Map<String, Object> verifyCode(@PathVariable("memEmail") String memEmail) {
        return memberService.sendVerifyCode(memEmail);
    }
    @PostMapping("/rest/signup")
    @ResponseBody
    public String signup(@RequestBody MemberDto memberDto) {
        return memberService.signup(memberDto);
    }
}
```

<br/><br/>

##### ③ Service

/src/main/java/com/example/rmfr/service/MemberService.java<br/>

&nbsp; + idDupChk() : 아이디 중복 체크<br/>
&nbsp; + sendVerifyCode() : 이메일 인증 번호 생성 및 발송<br/>
&nbsp; + signup() : 회원가입 정보 DB 저장<br/>

```
package com.example.rmfr.member.service;

import com.example.rmfr.member.dto.MemberDto;
import org.springframework.stereotype.Service;

import java.util.Map;

public interface MemberService {
    public Long idDupChk(String memId);
    public Map<String, Object> sendVerifyCode(String memEmail);
    public String signup(MemberDto memberDto);
}
```

/src/main/java/com/example/rmfr/service/MemberServiceImpl.java<br/>

&nbsp; + idDupChk() : 아이디 중복 체크<br/>
&nbsp; + sendVerifyCode() : 이메일 인증 번호 생성 및 발송<br/>
&nbsp; + signup() : 회원가입 정보 DB 저장<br/>
&nbsp; + createVerifyCode() : 이메일 인증번호 생성<br/>

```
package com.example.rmfr.member.service;

import com.example.rmfr.member.dto.MemberDto;
import com.example.rmfr.member.entity.Members;
import com.example.rmfr.member.repository.MemberRepository;
import com.example.rmfr.utils.MailUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
@Service
@Slf4j
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final MailUtils mailUtils;

    @Override
    public Long idDupChk(String memId) {
        return memberRepository.countByMemId(memId);
    }

    @Override
    public Map<String, Object> sendVerifyCode(String memEmail) {
        Map<String, Object> rst = null;
        String code = createVerifyCode();
        try {
            rst = mailUtils.sendEmail(memEmail, code);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rst;
    }


    @Transactional
    @Override
    public String signup(MemberDto memberDto) {
        String rst = "";
        try {
            rst = memberRepository.save(Members.builder().memberDto(memberDto).build()).getMemId();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rst;
    }

    public String createVerifyCode() {
        String code = "";

        for ( int i = 0; i < 6; i++ ) {
            if (Math.random() * 10 > 4) {
                code += (int)(Math.random() * 10) + "";
            } else {
                char key = (char) ((Math.random() * 26) + 65);
                code += key + "";
            }
        }

        return code;
    }
}
```

##### ④ Repository

`@Repository`는 JPA를 사용하는 프로젝트에서 실제 데이터를 가져오는 클래스에 지정한다.<br/>
JpaRepository 상속받는 인터페이스를 생성하고 메서드 명을 속성명과 조합하여 입력하면된다.<br/>
findBy${속성명}, countBy${속성명} 등 메서드명을 보면 어느정도 이해가 되는 형태이다.
<br/><br/>

/src/main/java/com/example/rmfr/repository/MemberRepository.java<br/>
&nbsp; + countByMemId() : countBy + ${속성명} 으로 메서드명을 지정하면 parameter를 조건으로 하는 해당 속성에 개수를 조회해준다.

```
package com.example.rmfr.member.repository;

import com.example.rmfr.member.entity.Members;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Members, Long> {
    Long countByMemId(String memId);
}
```

##### ⑤ 메일 발송 설정

Gmail 계정을 통한 이메일 인증 메일을 발송 하기 위해서 몇 가지 설정이 필요하다.<br/>
