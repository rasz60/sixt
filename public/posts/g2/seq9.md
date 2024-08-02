### 회원 정보 수정

임시 비밀번호 발급 후 비밀번호 수정 그리고 주소, 휴대폰 번호 등 정보를 수정해야할 때 쓰일 회원 정보 수정 기능을 구현해 보았다.
<br/><br/>

##### 회원정보 수정/삭제

① 현재 비밀번호로 2차 인증 절차<br/>
② 회원 가입과 같은 항목들 출력 및 ID 제외 모든 항목 변경 가능<br/>
③ 이메일 변경 시 인증 절차<br/>
④ 비밀번호는 입력한 값이 있을 때만 검증 및 변경 실행<br/>
⑤ 회원 탈퇴 시 MEM_DEL_YN 컬럼 값을 "Y"로 업데이트
<br/><br/>

##### 👈Backend

/src/main/java/com/example/rmfr/service/MemberService.java

```
    .
    .

    public MemberDto getUserInfo(String memId); // 회원 정보 수정 페이지 접근 시 로그인된 계정의 정보 가져오기
    public boolean currPwChkd(String memId, String memPw); // 현재 비밀번호 2차 인증
    public Map<String, Object> settings(MemberDto memberDto); // 회원 정보 수정
    public Map<String, Object> delete(String memId); // 회원 탈퇴

    .
    .

```

<br/><br/>
/src/main/java/com/example/rmfr/service/MemberServiceImpl.java

###### JPA DB 정보 수정

###### ① 정보를 수정할 Entity Select

###### ② 현재 DB의 저장된 값으로 생성된 Entity 객체 속성 값을 set 메서드로 화면 입력 값으로 변경

###### ③ repository.save(Members) 실행, 변경된 값만 업데이트 실행

```

    .
    .

    @Override
    public MemberDto getUserInfo(String memId) { // 회원 정보 수정 페이지 접근 시 로그인된 계정의 정보 가져오기
        MemberDto member = new MemberDto();
        try {
            Optional<Members> mem = memberRepository.findByMemIdAndMemDelYn(memId, "N");

            if ( mem.isPresent() ) {
                member.of(mem.get());
            } else {
                throw new Exception("MEM_ID NOT FOUND.");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return member;
    }

    @Override
    public boolean currPwChkd(String memId, String memPw) { // 현재 비밀번호로 2차 인증
        boolean rst = false;
        try {
            Optional<Members> mem = memberRepository.findByMemIdAndMemDelYn(memId, "N");

            if ( mem.isPresent() ) {
                rst = bCryptPasswordEncoder.matches(memPw, mem.get().getMemPw());
            } else {
                throw new Exception("MEM_ID NOT FOUND.");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return rst;
    }

    @Transactional
    @Override
    public Map<String, Object> settings(MemberDto memberDto) { // 정보 수정
        Map<String, Object> rst = new HashMap<>();
        try {
            Optional<Members> mem = memberRepository.findByMemIdAndMemDelYn(memberDto.getMemId(), "N"); // DB에 저장된 변경 전 정보 조회

            if ( mem.isPresent() ) {

                if ( !"".equals(memberDto.getMemPw()) ) // 비밀번호 값을 입력했을 때
                    memberDto.setMemPw(bCryptPasswordEncoder.encode(memberDto.getMemPw())); // 암호화

                Members member = mem.get();
                member.of(memberDto); // memberDto를 기준으로 속성 값 변경
                memberRepository.save(member); // DB 업데이트 실행
                rst.put("resultCode", "200");
            } else {
                rst.put("resultCode", "400");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            rst.put("resultCode", "500");
        }
        return rst;
    }

    @Transactional
    @Override
    public Map<String, Object> delete(String memId) { // 회원 탈퇴
        Map<String, Object> rst = new HashMap<>();
        try {
            Optional<Members> mem = memberRepository.findByMemIdAndMemDelYn(memId, "N");
            if (mem.isPresent() ) {
                Members member = mem.get();
                member.setMemDelYn("Y"); // 탈퇴 flag 변경
                member.setMemDelDate(LocalDateTime.now()); // 탈퇴 일자 오늘로 설정
                memberRepository.save(member);
               rst.put("resultCode", "200");
            } else {
                rst.put("resultCode", "400");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            rst.put("resultCode", "500");
        }
        return rst;
    }

    .
    .

```

/src/main/java/com/example/rmfr/controller/MemberRestController.java

###### -> 여기서 등장하는 Principal은 security 로그인 시 만들어지는 객체이다.

###### -> controller에 변수로 Principal을 지정하면 security가 token을 확인하여 그에 맞는 Principal을 반환한다.

###### -> request한 principal이 존재하지 않으면 null을 반환하므로 이에 대한 처리가 필요하다.

###### -> principal.getName()을 하면 로그인된 계정의 아이디를 가져올 수 있다.

###### -> 파라미터로 아이디를 넘겨주어도 되지만, 현재 로그인 상태에 대한 확실한 확인이 될 것 같아서 Principal을 사용했다.

```
    .
    .

    @GetMapping("/rest/loginUserInfo")
    public MemberDto loginUserInfo(Principal principal) { // 회원 정보 조회
        MemberDto member = null;
        if (principal != null) {
            member = memberService.getUserInfo(principal.getName());
        }
        return member;
    }

    @PostMapping("/rest/currPwChkd")
    @ResponseBody
    public boolean currPwChkd(Principal principal, @RequestBody Map<String, String> body) { // 현재 비밀번호로 2차 인증
        boolean rst = false;
        String memPw = body.get("memPw");
        if (principal != null && !"".equals(memPw)) {
          rst = memberService.currPwChkd(principal.getName(), memPw);
        }
        return rst;
    }

    @PostMapping("/rest/member/settings")
    @ResponseBody
    public Map<String, Object> memberSettings(@RequestBody MemberDto memberDto) { // 정보 수정
        return memberService.settings(memberDto);
    }

    @GetMapping("/rest/member/delete")
    @ResponseBody
    public Map<String, Object> memberDelete(Principal principal) { // 회원 탈퇴
        return memberService.delete(principal.getName());
    }

    .
    .
```

##### 👉Frontend

/frontend/src/components/SettingsPage.vue

```
<script setup>
import VerifyDialog from "@/components/overlay/EmailVerifyDialog.vue";
</script>
<template>
  <v-overlay v-model="overlay" id="overlay" scroll-strategy="block" persistent>
    <VerifyDialog
      ref="verifyDialog"
      @sendMessage="fnChildMessage"
      :memEmail="memEmail"
    />
  </v-overlay>
  <v-form @submit.prevent id="settings" ref="settingFrm">
    <v-row v-show="!beforeChkd">
      <v-col cols="11">
        <v-text-field
          type="password"
          label="Current Password"
          v-model="currPw"
        ></v-text-field>
      </v-col>
      <v-col cols="1" class="btnCols">
        <v-btn prepend-icon="" @click="fnCurrPwChkd">확인하기</v-btn>
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-col cols="12">
        <v-text-field
          label="* ID"
          v-model="memId"
          readonly="true"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-col cols="12">
        <v-text-field
          type="password"
          label="* Password"
          v-model="memPw"
          :rules="pwRules"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-col cols="12">
        <v-text-field
          type="password"
          label="* Password Check"
          v-model="pwChk"
          :rules="pwChkRules"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-col cols="11">
        <v-text-field
          label="* e-mail"
          v-model="memEmail"
          :rules="emailRules"
          :readonly="chk.emailChkd"
          @click="fnResetEmail"
        ></v-text-field>
      </v-col>
      <v-col cols="1" class="btnCols">
        <v-btn
          :prepend-icon="
            chk.emailChkd ? `mdi-email-check` : `mdi-email-check-outline`
          "
          :variant="chk.emailChkd ? `tonal` : `elevated`"
          :color="chk.emailChkd ? `primary` : `default`"
          @click="fnMailVerify"
          :text="chk.emailChkd ? `인증완료` : `인증하기`"
        ></v-btn>
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-col cols="12">
        <v-text-field label="Phone" v-model="memPhone"></v-text-field>
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-col cols="11">
        <v-text-field label="Zipcode" readonly v-model="zipcode"></v-text-field>
      </v-col>
      <v-col cols="1" class="btnCols">
        <v-btn
          prepend-icon="mdi-map-marker-outline"
          @click.stop="fnExecDaumPostcode"
          >주소찾기</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-col cols="12">
        <v-text-field
          label="Address1"
          readonly
          v-model="memAddr1"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-col cols="12">
        <v-text-field label="Address2" v-model="memAddr2"></v-text-field>
      </v-col>
    </v-row>
    <v-row v-show="beforeChkd">
      <v-spacer></v-spacer>
      <v-col cols="2" class="text-right">
        <v-btn prepend-icon="mdi-account-edit-outline" @click="fnValidate"
          >수정하기</v-btn
        >
      </v-col>
      <v-col cols="2" class="text-left">
        <v-btn
          prepend-icon="mdi-account-remove-outline"
          color="red"
          @click="fnDeleteUser"
          >탈퇴하기</v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-form>
</template>

<script>
import settingsData from "@/assets/js/settings/settingsData";
import settingsRules from "@/assets/js/settings/settingsRules";
import settingsMethods from "@/assets/js/settings/settingsMethods";

export default {
  name: "SignupPage",
  data() {
    return settingsData;
  },
  created() {
    this.init();
  },
  mounted() {
    this.fnLoadDaumPostcodeScript();
  },
  computed: settingsRules,
  methods: settingsMethods,
  watch: {
    memPw(v) {
      this.chk.pwChkd = v == this.pwChk;
    },
    pwChk(v) {
      this.chk.pwChkd = v == this.memPw;
    },
  },
};
</script>
```

<br/><br/>
/frontend/src/router/index.js

```
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/components/MainPage.vue";
import SignupPage from "@/components/SignupPage.vue";
import SettingPage from "@/components/SettingPage.vue";  // settingsPage router 추가
.
.

const routes = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
  },
  {
    path: "/signup",
    name: "SignupPage",
    component: SignupPage,
  },
  {
    path: "/settings", // settingsPage router 추가
    name: "SettingPage",
    component: SettingPage,
  },
];

.
.

```

<br/><br/>
/frontend/src/assets/js/setttings/settingsData.js

```
export default {
  beforeChkd: false,
  currPw: "",
  memId: "",
  memPw: "",
  memEmail: "",
  memPhone: "",
  zipcode: "",
  memAddr1: "",
  memAddr2: "",
  pwChk: "",
  chk: {
    pwChkd: false,
    emailChkd: true,
  },
  overlay: false,
};

```

<br/><br/>
/frontend/src/assets/js/setttings/settingsMethods.js

```
export default {
  fnRuleChk(type) {
    var rules = null;
    var value = "";
    var chk = false;

    switch (type) {
      case 1:
        rules = this.pwRules;
        value = this.memPw;
        break;
      case 2:
        rules = this.pwChkRules;
        value = this.pwChk;
        break;
      default:
        rules = this.emailRules;
        value = this.memEmail;
        break;
    }

    for (var i = 0; i < rules.length; i++) {
      chk = rules[i](value);
      if (chk != true) {
        alert(chk);
        chk = false;
        break;
      }
    }
    return chk;
  },
  async init() {
    if (this.$loginInfo.login) {
      await this.axios
        .get("/rest/loginUserInfo")
        .then((res) => {
          this.beforeChkd = false;
          this.currPw = "";
          this.memId = res.data.memId;
          this.memPw = "";
          this.pwChk = "";
          this.memEmail = res.data.memEmail;
          this.memPhone = res.data.memPhone;
          this.zipcode = res.data.zipcode;
          this.memAddr1 = res.data.memAddr1;
          this.memAddr2 = res.data.memAddr2;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("다시 로그인해주세요.");
      location.href = "/logout";
    }
  },
  async fnCurrPwChkd() {
    if (this.currPw) {
      var data = {
        memPw: this.currPw,
      };
      await this.axios
        .post("/rest/currPwChkd", JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          var chk = res.data;

          if (chk) {
            this.currPw = "";
            this.beforeChkd = true;
          } else {
            alert("비밀번호를 다시 확인해주세요.");
          }
        })
        .catch((err) => {
          alert(
            "시스템 오류가 발생하였습니다. 지속될 경우 관리자에게 문의해주세요."
          );
          console.log(err);
        });
    } else {
      alert("비밀번호를 입력해주세요.");
    }
  },
  fnResetEmail() {
    if (this.chk.emailChkd) {
      if (confirm("인증된 이메일 주소를 변경할까요?")) {
        this.chk.emailChkd = false;
        this.memEmail = "";
      }
    }
  },
  fnExecDaumPostcode() {
    if (window.daum && window.daum.Postcode) {
      // 팝업 호출
      this.popup = new window.daum.Postcode({
        oncomplete: (data) => {
          // 우편번호 검색 완료 후의 처리 로직
          this.zipcode = data.zonecode;
          this.memAddr1 = data.address;
        },
      });

      this.popup.open();
    }
    // 오류 처리
    else {
      console.error("Daum Postcode 스크립트가 로드되지 않았습니다.");
    }
  },
  fnLoadDaumPostcodeScript() {
    const script = document.createElement("script");
    // 다음 주소 api cdn
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => {
      this.isScriptLoaded = true; // 스크립트가 로드되면 isScriptLoaded를 true로 설정
    };
    document.head.appendChild(script);
  },
  fnMailVerify() {
    var chk = this.chk.emailChkd;
    if (!chk) {
      chk = this.fnRuleChk(3); // check rules
      if (chk) this.overlay = true; // open overlay
    } else {
      if (confirm("인증이 완료된 메일을 변경할까요?")) {
        this.memEmail = "";
        this.chk.emailChkd = false;
      }
    }
  },
  fnChildMessage(obj) {
    this.overlay = obj.overlay;
    this.chk.emailChkd = obj.chkd;
  },
  async fnValidate() {
    let chk = await this.$refs.settingFrm.validate();

    if (chk.valid) {
      chk = !this.chk.emailChkd ? 1 : 0;
    } else {
      chk = !this.chk.pwChkd ? 2 : -1;
    }

    if (chk == 0) this.fnFrmSubmit();
    else if (chk == 1) alert("이메일을 인증해주세요.");
    else if (chk == 2) alert("비밀번호를 확인해주세요.");
    else alert("가입 정보를 다시 확인해주세요.");
  },
  async fnFrmSubmit() {
    if (confirm("회원 정보를 수정할까요?")) {
      var data = {
        memId: this.memId,
        memPw: this.memPw,
        memEmail: this.memEmail,
        memPhone: this.memPhone,
        zipcode: this.zipcode,
        memAddr1: this.memAddr1,
        memAddr2: this.memAddr2,
      };
      await this.axios({
        method: "post", // HTTP 메서드
        url: "/rest/member/settings", // 요청할 URL
        data: data, // 전송할 데이터
        headers: {
          Accept: "application/json", // 서버로부터 JSON 응답을 기대
          "Content-Type": "application/json", // 요청의 콘텐츠 타입을 JSON으로 설정
        },
      })
        .then((res) => {
          var resultCode = res.data.resultCode;

          if (resultCode == "200") {
            alert("정보 수정이 완료되었습니다.");
            this.init();
          } else if (resultCode == "400") {
            alert("회원 정보를 찾을 수 없습니다.");
            location.href = "/logout";
          } else {
            alert(
              "시스템 오류가 발생하였습니다. 지속될 경우 관리자에게 문의해주세요."
            );
            return false;
          }
        })
        .catch((err) => console.log(err));
    }
  },
  async fnDeleteUser() {
    if (confirm("rmfr에 가입된 정보를 삭제할까요?")) {
      await this.axios
        .get("/rest/member/delete")
        .then((res) => {
          var resultCode = res.data.resultCode;

          if (resultCode == 200) {
            alert("회원 탈퇴가 완료되었습니다.");
            this.init();
            this.$loginInfo.login = false;
            this.$loginInfo.token = null;
            this.$loginInfo.expired = null;
            location.href = "/logout";
          } else {
            alert(
              "시스템 오류가 발생하였습니다. 지속될 경우 관리자에게 문의해주세요."
            );
            return false;
          }
        })
        .catch((err) => {
          alert(
            "시스템 오류가 발생하였습니다. 지속될 경우 관리자에게 문의해주세요."
          );
          console.log(err);
          return false;
        });
    }
  },
};

```

<br/><br/>
/frontend/src/assets/js/setttings/settingsRules.js

```
export default {
  pwRules() {
    const rules = [];
    const pwChk = (v) => {
      if (!v) return true;
      else {
        var regExp =
          /(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

        if (regExp.test(v)) return true;
        return "8~16자리의 영문 소/대문자, 숫자, 특수문자($,`,~,!,@,$,!,%,*,#,^,?,&,,(,),-,_,=,+) 조합으로 입력해주세요.";
      }
    };
    rules.push(pwChk);
    return rules;
  },
  pwChkRules() {
    const rules = [];

    const pwChk = (v) => {
      if (this.memPw == v) {
        this.chk.pwChkd = true;
        return true;
      } else return "비밀번호를 확인해주세요.";
    };
    rules.push(pwChk);

    return rules;
  },
  emailRules() {
    const rules = [];

    const nullchk = (v) => {
      if (v) return true;
      return "이메일은 필수 입력사항입니다.";
    };
    rules.push(nullchk);

    const regchk = (v) => {
      var regExp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regExp.test(v)) return true;
      return "형식에 맞는 이메일 주소를 입력해주세요. (ex> emailId@domain.com)";
    };
    rules.push(regchk);

    return rules;
  },
};

```

<br/><br/>
/frontend/src/assets/style/components/settings.scss

```
form#settings {
  margin-top: 1em;
  width: 70%;

  .btnCols {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -1.5em;
  }
}

#overlay {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

<br/><br/>
/frontend/src/assets/style/components/settings.scss

```
form#settings {
  margin-top: 1em;
  width: 70%;

  .btnCols {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -1.5em;
  }
}

#overlay {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

<br/><br/>
/frontend/src/assets/style/components/settings.scss

```
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css");

$font-stack: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto,
  "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR",
  "Malgun Gothic", sans-serif;

$min-height: 85vh;

body {
  font-family: $font-stack;
}

@import "views/header";
@import "views/content";

@import "components/main";
@import "components/signup";
@import "components/settings"; // setting style sheet 추가

```

이렇게 해서 로그인, 아이디/비밀번호찾기, 정보수정, 회원탈퇴까지❗❗❗ 회원 정보에 대한 기능 구현을 마치겠다.<br/>
다음으로는 게시판을 하나 만들고, 게시판 CRUD 그리고 검색 기능까지 구현해보겠다.😎
