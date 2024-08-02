### 아이디/비밀번호 찾기

로그인 정보를 잊어버렸을 때, 아이디와 비밀번호를 찾는 기능을 구현했다.
<br/><br/>

##### ① 아이디 찾기

회원가입 시 이메일 중복체크는 하지 않기 때문에 하나의 이메일에 아이디가 여러개일 수 있다.
<br/><br/>

① 이메일 주소 입력 후 버튼 클릭<br/>
② 이메일 주소로 가입된 아이디 개수 확인<br/>

③ 이메일 주소로 가입된 아이디가 있을 때<br/>
&nbsp; ⑴ 아이디 전체 리스트 조회<br/>
&nbsp; ⑵ 아이디 앞 4자리 제외 "\*"로 blind 처리<br/>
&nbsp; ⑶ 이메일 주소로 blind 처리된 아이디 리스트 발송<br/>
&nbsp; ⑷ 인증번호 입력 화면 호출<br/>

④ 이메일 주소로 가입된 아이디가 없을 때, 화면에서 안내문구 출력<br/>

##### ② 비밀번호 찾기

난수의 임시 비밀번호를 생성하여 메일로 발송하는 방법을 사용했다.
<br/><br/>

① 아이디, 이메일 주소 입력 후 버튼 클릭<br/>
② 아이디에 등록된 메일 주소와 입력받은 이메일 주소가 동일한지 확인<br/>
③ 동일한 경우 임시 비밀번호 생성<br/>
④ 임시 비밀번호로 회원 DB 업데이트<br/>
⑤ 입력받은 메일로 임시 비밀번호 발송
<br/><br/>

##### 👈Backend

/src/main/java/com/example/rmfr/repository/MemberRepository.java

```
package com.example.rmfr.member.repository;

import com.example.rmfr.member.entity.Members;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Members, Long> {
    Long countByMemIdAndMemDelYn(String memId, String memYN);
    public Optional<Members> findByMemIdAndMemDelYn(String username, String memYN);
    public Optional<Members> findByMemId(String username);
    public Long countByMemEmailAndMemDelYn(String memEmail, String memDelYn); // 이메일로 가입된 아이디 개수 조회(탈퇴하지 않은 계정만)
    public List<Members> findByMemEmailAndMemDelYn(String memEmail, String memDelYn); // 이메일 주소로 가입된 회원 DB 조회(탈퇴하지 않은 계정만)
}
```

/src/main/java/com/example/rmfr/service/MemberService.java

```
package com.example.rmfr.member.service;

import com.example.rmfr.member.dto.MemberDto;
import com.example.rmfr.member.entity.Members;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MemberService {
    public Long idDupChk(String memId);
    public Map<String, Object> sendVerifyCode(String memEmail);
    public String signup(MemberDto memberDto);
    public int countByMemEmail(String memEmail); // 메일 주소로 가입된 아이디 개수 구하기
    public Map<String, Object> sendIdList(String memEmail); // 메일 주소로 가입된 아이디 메일 발송
    public Map<String, Object> sendTempPw(String memId, String memEmail); // 아이디와 메일 주소로 가입된 회원 임시비밀번호 발급
}
```

/src/main/java/com/example/rmfr/service/MemberServiceImpl.java

```
package com.example.rmfr.member.service;

import com.example.rmfr.member.dto.MemberDto;
import com.example.rmfr.member.entity.Members;
import com.example.rmfr.member.repository.MemberRepository;
import com.example.rmfr.utils.MailUtils;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Base64Util;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService, UserDetailsService {

    private final MemberRepository memberRepository;
    private final MailUtils mailUtils;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    .
    .
    .

    @Override
    public int countByMemEmail(String memEmail) {
        int cnt = 0;
        try {
            cnt = memberRepository.countByMemEmailAndMemDelYn(memEmail, "N").intValue(); // 메일 주소로 가입한 아이디 개수 조회
            if ( cnt <= 0 ) throw new Exception("MEM_EMAIL NOT FOUND.");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return cnt;
    }

    @Override
    public Map<String, Object> sendIdList(String memEmail) {
        Map<String, Object> rst = null;
        try {
            List<Members> members = memberRepository.findByMemEmailAndMemDelYn(memEmail, "N"); // 메일 주소로 가입한 전체 회원 조회

            if ( members.isEmpty() )
                throw new Exception("MEM_EMAIL NOT FOUND.");

            List<String> ids = idBlind(members); // 아이디 blind 처리
            rst = mailUtils.sendIdToEmail(memEmail, ids); // 메일 발송
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return rst;
    }

    @Override
    public Map<String, Object> sendTempPw(String memId, String memEmail) {
        Map<String, Object> rst = new HashMap<>();
        try {
            Optional<Members> mem = memberRepository.findByMemIdAndMemDelYn(memId, "N"); // 아이디로 회원 정보 찾기

            if ( mem.isPresent() ) {
                Members member = mem.get();

                if ( memEmail.equals(member.getMemEmail()) ) { // 입력한 메일 주소와 회원 가입할 때 입력한 메일 주소 비교
                    String pw = tempPwGenerate(); // 임시 비밀번호 발급
                    member.setMemPw(bCryptPasswordEncoder.encode(pw)); // 임시 비밀번호 encoding
                    memberRepository.save(member); // 회원 정보 업데이트
                    rst = mailUtils.sendPwToEmail(member.getMemEmail(), pw); // 메일 발송
                } else {
                    rst.put("resultCode", 400);
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return rst;
    }
    // 아이디 blind 처리
    public List<String> idBlind(List<Members> members) {
        List<String> ids = new ArrayList<>();
        for ( Members member : members ) {
            String memId = member.getMemId();

            String blind = memId.substring(0, 4);
            int times = memId.length() - 4;
            for (int i = 0; i < times; i++ ) {
                blind += "*";
            }
            ids.add(blind);
        }

        return ids;
    }

    // 임시 비밀번호 발급
    public String tempPwGenerate() {
        String pw = "";
        String[] regStr = {"`", "~", "!", "@", "$", "%", "*", "#", "^", "?", "&", "(", ")", "-", "_", "=", "+"};

        for ( int i = 0; i < 15; i++ ) {
            int random = (int)Math.ceil(Math.random() * 10);

            if (random < 3) { // 1, 2
                pw += (int)(Math.random() * 10) + "";
            } else if (random < 6) { // 3, 4, 5
                char key = (char) ((Math.random() * 26) + 65);
                pw += key + "";
            } else if (random < 9) { // 6, 7, 8
                char key = (char) ((Math.random() * 26) + 97);
                pw += key + "";
            } else { // 9, 10
                int idx = (int)(Math.random() * regStr.length);
                pw += regStr[idx];
            }
        }
        return pw;
    }
}

```

/src/main/java/com/example/rmfr/utils/MailUtils.java

```
package com.example.rmfr.utils;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.List;
import java.util.HashMap;

@Component
public class MailUtils {
    @Autowired
    private JavaMailSender sender;

    .
    .
    .

    // 아이디 찾기 메일 발송
    public Map<String, Object> sendIdToEmail(String toAddress, List<String> ids) {
        Map<String, Object> result = new HashMap<String, Object>();
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        String subject = "`rmfr?`에서 보낸 아이디 찾기 결과 메일입니다.";
        String text = "안녕하세요, `rmfr?` 입니다.\n"+ toAddress + "로 가입된 아이디입니다.\n\n";
        for (String id : ids ) {
            text += id + "\n";
        }

        try {
            helper.setTo(toAddress);
            helper.setSubject(subject);
            helper.setText(text);
            helper.setFrom("rmfr <rmfr@gmail.com>");
            result.put("resultCode", 200);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("resultCode", 500);
        }
        sender.send(message);
        return result;
    }

    // 비밀번호 찾기 메일 발송
    public Map<String, Object> sendPwToEmail(String toAddress, String pw) {
        Map<String, Object> result = new HashMap<String, Object>();
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        String subject = "`rmfr?`에서 보낸 비밀번호 찾기 결과 메일입니다.";
        String text = "안녕하세요, `rmfr?` 입니다.\n임시로 발급된 패스워드 안내드립니다.\n\n" + pw + "\n\n임시 비밀번호는 로그인 후 꼭 변경하여 사용해주시길 바랍니다.";

        try {
            helper.setTo(toAddress);
            helper.setSubject(subject);
            helper.setText(text);
            helper.setFrom("rmfr <rmfr@gmail.com>");
            result.put("resultCode", 200);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("resultCode", 500);
        }
        sender.send(message);
        return result;
    }
}

```

/src/main/java/com/example/rmfr/controller/MemberRestController.java

```
package com.example.rmfr.member.controller;

import com.example.rmfr.member.dto.MemberDto;
import com.example.rmfr.member.entity.Members;
import com.example.rmfr.member.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MemberRestController {

    private final MemberService memberService;

    .
    .
    .

    @GetMapping("/rest/findId/{memEmail}")
    @ResponseBody
    public int findId(@PathVariable("memEmail") String memEmail) { // 메일로 가입된 아이디 개수 확인
        return memberService.countByMemEmail(memEmail);
    }
    @GetMapping("/rest/sendIdList/{memEmail}")
    public Map<String, Object> sendIdList(@PathVariable("memEmail") String memEmail) { // 메일로 가입된 회원 전체 확인, 아이디 리스트 메일 발송
        return memberService.sendIdList(memEmail);
    }

    @GetMapping("/rest/sendTempPw/{memId}/{memEmail}")
    public Map<String, Object> sendTempPw(@PathVariable("memId") String memId, @PathVariable("memEmail") String memEmail) { // 아이디, 메일로 가입된 회원 확인, 임시 비밀번호 메일 발송
        return memberService.sendTempPw(memId, memEmail);
    }
}

```

<br/><br/>

##### 👉Frontend

/frontend/src/assets/js/overlay/login/loginMethods.js

```
export default {

  .
  .
  .

  async fnValid() { // 이메일 인증 메서드
    var memEmail = this.memEmail;

    if (memEmail) {
      await this.axios
        .get("/rest/findId/" + this.memEmail)
        .then((res) => {
          var cnt = res.data;

          if (cnt > 0) {
            this.overlay = true; // 이메일로 가입된 아이디가 있을 때 메일 인증 실행
          } else {
            alert("가입되지 않은 이메일 주소입니다.");
            return false;
          }
        })
        .catch((err) => {
          alert(
            "시스템 오류가 발생하였습니다. 지속될 시 관리자에게 문의해주세요."
          );
          console.log(err);
        });
    } else {
      alert("이메일 주소를 입력해주세요.");
    }
  },
  async fnChildMessage(v) { // 메일 인증 결과 수신 메서드
    this.overlay = v.overlay;

    if (v.chkd) { // 인증 성공 시 아이디 리스트 메일 발송
      alert(
        "인증하신 메일로 rmfr에 가입된 아이디를 보내드렸습니다.\n메일에서 자세한 내용을 확인해주세요."
      );

      await this.axios
        .get("/rest/sendIdList/" + this.memEmail)
        .then(() => {
          this.memEmail = "";
        })
        .catch((err) => {
          alert(
            "시스템 오류가 발생하였습니다. 지속될 시 관리자에게 문의해주세요."
          );
          console.log(err);
        });

      this.findId = false;
    }
  },
  async fnTempPw() { // 임시 비밀번호 발송
    var memId = this.memId;
    var memEmail = this.memEmail;

    if (memId && memEmail) {
      await this.axios
        .get("/rest/sendTempPw/" + memId + "/" + memEmail)
        .then((res) => {
          var rst = res.data;
          if (rst.resultCode == 200) {
            alert("이메일로 임시 비밀번호를 발송하였습니다.");
            this.findPw = false;
            this.dpLogin = true;
          } else {
            alert("아이디와 이메일 주소가 일치하는 회원을 찾지 못했습니다.");
          }
        })
        .catch((err) => {
          alert(
            "시스템 오류가 발생하였습니다. 지속될 시 관리자에게 문의해주세요."
          );
          console.log(err);
        });
    } else {
      alert("아이디와 이메일을 모두 입력해주세요.");
    }
  },
};
```

아이디, 패스워드 찾기 기능 구현이 완료되었다. 다음으로는 회원 정보 수정 기능을 구현해보았다.😎
