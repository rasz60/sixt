### 회원가입 페이지 만들기 - Server 구성

이전 포스트에서 Vue 프로젝트 화면 구성과 /rest url 호출 시 8082 port 서버로 요청을 보내도록 설정을 마쳤다.<br/>
회원가입 페이지에서 서버로 요청을 보내는 기능은 아이디 중복 체크, 이메일 인증 번호 생성 및 발송, 회원 가입 3가지를 구현했다.
<br/><br/>

##### ① DTO

화면과 주고받을 때 사용할 DTO 클래스 생성과 화면에서 넘어온 정보를 DB 저장 필요 시 DTO를 Entity로 전환하기 위해 Entity에 생성자를 추가한다.
<br/><br/>

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

/src/main/java/com/example/rmfr/entity/Members.java

```
.
.
@Entity
@Table(name = "members")
@Data
@DynamicInsert
@DynamicUpdate
public class Members {

    .
    .

    @Builder
    public Members(MemberDto memberDto) {
        this.memId = memberDto.getMemId();
        this.memPw = memberDto.getMemPw();
        this.memEmail = memberDto.getMemEmail();
        this.memLevel = memberDto.getMemLevel();
        this.memPwUpdateDate = memberDto.getMemPwUpdateDate();
        this.memPhone = memberDto.getMemPhone();
        this.zipcode = memberDto.getZipcode();
        this.memAddr1 = memberDto.getMemAddr1();
        this.memAddr2 = memberDto.getMemAddr2();
    }
}
```

@Builder로 지정한 생성자는 ${클래스명}.builder(${parameter}).build() 로 인스턴스를 생성할 수 있다.

<br/>

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
&nbsp; + sendVerifyCode() : 이메일 인증 번호 생성 및 발송, 발송 성공 시 Base64 인코딩 된 token return<br/>
&nbsp; + signup() : MemberRepository.save(entity)으로 회원 가입 정보 DB 저장 (\* 자세한 내용은 Repository 설명 단 확인)<br/>
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
import org.apache.logging.log4j.util.Base64Util;
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

            if ( (int) rst.get("resultCode") == 200 ) {
                String base64ValidCode = Base64Util.encode(code);
                rst.put("token", base64ValidCode);
            }
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

그리고 클래스에 직접 구현하진 않았지만, extends 받은 JpaRepository 메서드 중 save()를 사용한다.<br/>
상속 받는 `JpaRepository<Members, Long>`의 타입으로 지정한 Members Entity 객체를 생성 후 MemberRepository.save(entity)를 실행하면 해당 정보로 데이터에 저장된다.<br/>
이 때 자동으로 신규 entity는 insert, 이미 존재하는 entity는 update가 일어난다.<br/>

##### ⑤ 메일 발송 설정

G-Mail 계정을 이용하여 인증 메일을 발송하기 위해서는 몇 가지 설정이 필요하다.<br/>
G-Mail 주소와 아래 방법으로 생성한 앱 비밀번호로 어플리케이션에서 메일을 보낼 수 있다.<br/>
앱 비밀번호는 쉽게 만들고 지울 수 있으나 다시 확인할 수 없으니 꼭❗ 복사해둔다.
<br/><br/>

`G-Mail 설정`
<br/>

&nbsp; ⑴ G-Mail IMAP 설정<br/>
&nbsp;&nbsp;&nbsp; + G-Mail > 설정 > 모든 설정보기 > 전달 및 POP/IMAP 메뉴 접근<br/>
&nbsp;&nbsp;&nbsp; + IMAP 엑세스 > 상태 : IMAP 사용 체크
<br/><br/>

&nbsp; ⑵ Google 계정 2차 비밀번호 설정<br/>
&nbsp;&nbsp;&nbsp; + Google 계정 > 보안 > 2단계 인증 > '사용함'으로 설정 <br/>
&nbsp;&nbsp;&nbsp; + Google 계정 상단 검색 바에 '앱 비밀번호' 검색<br/>
&nbsp;&nbsp;&nbsp; + 앱 이름을 입력하고 만들기 선택 > 16자리 비밀번호 복사
<br/><br/>

`Spring-Boot 설정`
<br/>

&nbsp; ⑴ java-mail dependency 추가
<br/><br/>

&nbsp;&nbsp; build.gradle

```
.
.
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	//implementation 'org.springframework.boot:spring-boot-starter-security' // 주석처리
	implementation 'org.springframework.boot:spring-boot-starter-web'
	compileOnly 'org.projectlombok:lombok'
	developmentOnly 'org.springframework.boot:spring-boot-devtools'
	runtimeOnly 'com.mysql:mysql-connector-j'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.security:spring-security-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'

	implementation 'org.springframework.boot:spring-boot-starter-mail' // javamail 추가
}
.
.
```

&nbsp; ⑵ mail smtp 설정 추가
<br/><br/>

&nbsp;&nbsp; /src/main/java/resources/application.yml

```
.
.
spring:
  .
  .
  mail:
    protocol: smtp
    host: smtp.gmail.com
    port: 587
    username: ${G-Mail 주소}
    password: ${앱 비밀번호}
    default-encoding: utf-8
    properties:
      mail:
        smtp:
          starttls:
            enable: true
          auth: true
          timeout: 5000
.
.
```

&nbsp; ⑶ MailUtils 클래스 추가
<br/><br/>

&nbsp;&nbsp;&nbsp; + MemberRestController : '/rest/signup/verifyCode/{memEmail}' 호출 시 MemberService.sendVerifyCode() 실행<br/>
&nbsp;&nbsp;&nbsp; + MemberService : createVerifyCode() 에서 생성한 인증 번호와 수신할 이메일 주소를 parameter로 MailUtils.sendEmail() 실행<br/>
&nbsp;&nbsp;&nbsp; + MailUtils : JavaMailSender를 이용하여 제목, 내용, 수/발신 메일 주소를 설정하여 전송, 전송 결과를 Map에 담아 return<br/>
&nbsp;&nbsp;&nbsp; + MemberService : sendMail() 결과가 성공인 경우, Base64로 인코딩된 인증 번호 화면으로 return
<br/><br/>

/src/main/java/com/example/rmfr/utils/MailUtils.java

```
package com.example.rmfr.utils;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.HashMap;

@Component
public class MailUtils {
    @Autowired
    private JavaMailSender sender;
    public Map<String, Object> sendEmail(String toAddress, String code) {
        Map<String, Object> result = new HashMap<String, Object>();
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        String subject = ${메일 제목};

        try {
            helper.setTo(toAddress); // 수신 메일 주소
            helper.setSubject(subject); // 제목
            helper.setText(${메일 내용}); // 메일 내용
            helper.setFrom("${발송자 이름} <${메일 주소}>"); // 발신 메일 정보
            result.put("resultCode", 200);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("resultCode", 500);
        }
        sender.send(message); // 메일 발송
        return result;
    }
}
```

이제 인증 메일 발송을 누르면 8082 port를 호출하여 인증번호를 메일로 발송하고,<br/>
인증 번호 입력창이 열리고 입력한 코드가 같은 경우 창이 꺼지게 된다.
<br/><br/>

특별히 대단한 기술은 없지만.. 깔끔한 회원 가입 기능 완성❗😎
