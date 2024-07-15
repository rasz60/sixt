### 회원가입 페이지 만들기

회원가입 구현을 위해서 front단 부터 구성했다.
<br/><br/>

전체 회원가입에 대한 절차 및 규격은 아래와 같다. 보통은 핸드폰 인증을 하지만 무료 SMS 라이브러리가 잘 없기때문에 email 인증만 사용했다.
<br/>

&nbsp; ⑴ 입력 항목 : 아이디, 비밀번호, 이메일, 핸드폰번호, 우편번호, 주소, 상세주소<br/>
&nbsp; ⑵ 필수 항목 : 아이디, 비밀번호, 이메일<br/>
&nbsp; ⑶ 규칙<br/>
&nbsp;&nbsp; + 아이디 : 6자 이상 20자 이하, 영어 소문자, 숫자, \_, - 허용, 중복 확인<br/>
&nbsp;&nbsp; + 비밀번호 : 8~16자리의 영문 소/대문자, 숫자, 특수문자($,`,~,!,@,$,!,%,\*,#,^,?,&,,(,),-,\_,=,+) 조합<br/>
&nbsp;&nbsp; + 이메일 : ID @ domain.com 형식, 이메일 인증<br/>
&nbsp; ⑷ Gmail SMTP 설정을 통한 인증 번호 메일 발송 기능<br/>
&nbsp; ⑸ Daum 주소 API 사용 주소 검색 기능
<br/><br/>

##### ① 화면 (.vue)

/frontend/src/App.vue

```
<script setup>
import HeaderView from "@/views/HeaderView.vue";
import ContentView from "@/views/ContentView.vue";
</script>

<template>
  <v-app>
    <v-container fluid>
      <HeaderView />
      <ContentView />
    </v-container>
  </v-app>
</template>

<script>
export default {
  component: {
    HeaderView,
    ContentView,
  },
};
</script>

<style lang="scss">
@import "@/assets/style/common.scss";
</style>

```

/frontend/src/views/HeaderView.vue

```
<template>
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
          <v-btn class="headerBtn" @click="$router.push('/signup')">
            <v-icon icon="mdi-account-plus"></v-icon>
            <v-tooltip location="bottom center" activator="parent">
              Signup
            </v-tooltip>
          </v-btn>
        </div>
      </template>
    </v-app-bar>
  </v-layout>
</template>
```

/frontend/src/views/ContentView.vue

```
<template>
  <v-main>
    <RouterView />
  </v-main>
</template>
```

/frontend/src/components/MainPage.vue

```
<template>
  <div id="main">
    <h2>Hello, We are RMFR❗</h2>
  </div>
</template>

<script>
export default {
  name: "MainPage",
};
</script>

```

/frontend/src/views/SignupPage.vue

```
<template>
  <v-overlay v-model="overlay" id="overlay" scroll-strategy="block" persistent>
    <v-card
      class="py-8 px-6 text-center mx-auto ma-4"
      max-width="400"
      width="100%"
    >
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-icon icon="mdi-close" @click="fnDelTimer" />
      </div>

      <h3 class="text-h6 mb-4">Email Verified</h3>
      <div class="text-body-2">
        {{ member.memEmail }}로 발송된 인증번호를 <br />아래 칸에 입력해주세요.
      </div>

      <div class="py-3">
        <span id="timer">03:00</span>
      </div>

      <v-sheet color="surface">
        <v-otp-input v-model="otp" type="text" variant="solo"></v-otp-input>
      </v-sheet>

      <v-btn
        class="my-4"
        color="purple"
        height="40"
        text="Verify"
        variant="flat"
        width="70%"
        @click="fnValidCode"
      ></v-btn>

      <div class="text-caption">
        인증번호를 받지 못했나요?
        <a href="#" @click="fnVerifyReset">다시 발송하기</a>
      </div>
    </v-card>
  </v-overlay>
  <v-form @submit.prevent id="signup" ref="signupFrm">
    <v-row>
      <v-col cols="11">
        <v-text-field
          label="* ID"
          v-model="member.memId"
          :rules="idRules"
        ></v-text-field>
      </v-col>
      <v-col cols="1" class="btnCols">
        <v-btn prepend-icon="mdi-account-check-outline" @click="fnIdDupChk"
          >중복확인</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          type="password"
          label="* Password"
          v-model="member.memPw"
          :rules="pwRules"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          type="password"
          label="* Password Check"
          v-model="pwChk"
          :rules="pwChkRules"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11">
        <v-text-field
          label="* e-mail"
          v-model="member.memEmail"
          :rules="emailRules"
          :readonly="chk.emailChkd"
        ></v-text-field>
      </v-col>
      <v-col cols="1" class="btnCols">
        <v-btn
          :prepend-icon="
            chk.emailChkd ? `mdi-email-check` : `mdi-email-check-outline`
          "
          @click="fnMailVerify"
          :text="chk.emailChkd ? `인증완료` : `인증하기`"
        ></v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field label="Phone" v-model="member.memPhone"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="11">
        <v-text-field
          label="Zipcode"
          readonly
          v-model="member.zipcode"
        ></v-text-field>
      </v-col>
      <v-col cols="1" class="btnCols">
        <v-btn
          prepend-icon="mdi-map-marker-outline"
          @click.stop="fnExecDaumPostcode"
          >주소찾기</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Address1"
          readonly
          v-model="member.memAddr1"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field label="Address2" v-model="member.memAddr2"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="2">
        <v-btn prepend-icon="mdi-account-edit-outline" @click="fnValidate"
          >회원가입</v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-form>
</template>

<script>
import signupData from "@/assets/js/signup/signupData";
import signupRules from "@/assets/js/signup/signupRules";
import signupMethods from "@/assets/js/signup/signupMethods";

export default {
  name: "SignupPage",
  data() {
    return signupData;
  },
  mounted() {
    this.fnLoadDaumPostcodeScript();
  },
  computed: signupRules,
  methods: signupMethods,
  watch: {
    memId() {
      this.idDupChk = false;
    },
    memPw(v) {
      this.chk.pwChkd = v == this.pwChk;
    },
    pwChk(v) {
      this.chk.pwChkd = v == this.member.memPw;
    },
  },
};
</script>
```

기본 설명은 Blog 만들기에서 충분히 설명했으니, 대략적인 구조와 추가된 기능을 위주로 살펴보겠다.
<br/><br/>

도메인으로 접근 시, HeaderView.vue와 ContentView.vue 화면을 출력한다.<br/>
ContentView.vue의 RouterView에는 router/index.js에 매핑된 url별 components를 출력한다<br/>
정확히는 '/' URL로 접근 시에는 MainPage.vue를, '/signup' URL 접근 시에는 SignupPage.vue를 출력한다.
<br/><br/>

그냥 보기에도 복잡한.. SignupPage.vue를 살펴보자.
<br/><br/>

회원가입 form은 Vuetify에서 제공하는 v-form을 사용했다.
<br/>

&nbsp; + @submit.prevent : form submit이 일어나면 일단 이벤트를 막는다.<br/>
&nbsp; + ref="${form이름}" : form안에 각 필드별로 rules로 지정한 validation을 사용하여 값을 검증할 수 있다. (this.$refs.${form이름}.validate())<br/>
&nbsp; + rules : Vuetify가 제공하는 v-text-field 등 form 요소에 지정하면 computed에 정의한 절차를 수행하여 validation한다.<br/>
&nbsp; + computed : view data 속성의 반응형 getter, 반드시 값을 리턴하는 메서드를 정의한다. [🔗참고 : computed와 watch의 차이점](https://blog.jeongwoo.in/vue-js-watch%EC%99%80-computed-%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%99%80-%EC%82%AC%EC%9A%A9%EB%B2%95-e2edce37ec34)<br/>
&nbsp; + watch : view data 속성의 콜백 함수, 값 변경에 반응하며 변경 전/후의 값을 제어할 수 있다.
<br/><br/>

script 각 속성별 소스 코드는 너무 길어서 파일로 따로따로 분리하여 import 하였다.
<br/><br/>

##### ② js 추가

/frontend/src/assets/js/signup/signupDatas.js<br/><br/>
&nbsp; + member {~} : 실제 back단으로 넘겨질 회원가입 정보, back단의 entity 속성명과 동일 [issue#3. @RequestBody 속성명 매핑 이슈](/#/logging/21)<br/>
&nbsp; + pwChk : 비밀번호 확인 값<br/>
&nbsp; + chk {~} : id 중복체크 / 비밀번호 확인 / 이메일 인증 3가지의 인증 완료 여부 flag<br/>
&nbsp; + overlay : 이메일 인증 시 화면 overlay 활성화 여부 flag<br/>
&nbsp; + limitTime : 이메일 인증 시 제한 시간, 179s = 2m59s<br/>
&nbsp; + verifyCode : back단에서 생성한 인증 번호, 메일 발송한 인증번호를 base64로 인코딩한 값<br/>
&nbsp; + otp : 이메일 인증 번호로 입력한 값<br/>

```
export default {
  member: {
    memId: "",
    memPw: "",
    memEmail: "",
    memPhone: "",
    zipcode: "",
    memAddr1: "",
    memAddr2: "",
  },
  pwChk: "",
  chk: {
    idDupChkd: false,
    pwChkd: false,
    emailChkd: false,
  },
  overlay: false,
  limitTime: 179,
  verifyCode: "",
  otp: "",
};
```

/frontend/src/assets/js/signup/signupMethods.js<br/><br/>
&nbsp; + timer : 이메일 인증용 타이머로 사용될 setInterval 함수를 담을 변수<br/>
&nbsp; + fnRuleChk() : signupRuels.js에 선언된 validation을 가져와서 실행하는 메서드<br/>
&nbsp; + fnIdDupChk() : 중복 ID 체크 로직, Axios 이용하여 back단 호출<br/>
&nbsp; + fnMailVerify() : 이메일 인증하기 버튼 클릭 시 실행되는 메서드<br/>
&nbsp; + fnVeirfyReset() : 인증 dialog 창에서 인증번호 재발송 시 실행되는 메서드<br/>
&nbsp; + fnSendVerifyCode() : back단의 인증 번호 메일 발송을 호출하는 메서드, back단의 return 값을 받아옴<br/>
&nbsp; + fnSetTimer() : 인증 번호 발송 성공 후, 입력 제한시간 타이머를 setting<br/>
&nbsp; + fnDelTimer() : 인증 창 닫기 / 인증 번호 재발송(type = -1) / 인증 성공 시 활성화된 타이머 삭제<br/>
&nbsp; + fnValidCode() : 인증 번호 확인 로직, 입력 값을 base64로 인코딩하여 확인<br/>
&nbsp; + fnLoadDaumPostcodeScript() : 다음 주소 api script meta tag 추가<br/>
&nbsp; + fnExecDaumPostcode() : 다음 주소 검색 호출<br/>
&nbsp; + fnValidate() : v-form submit 시 각 항목의 validation 실행<br/>
&nbsp; + frmSubmit() : validate() 성공 시 form을 submit()<br/>

```
let timer = null;
export default {
  fnRuleChk(type) {
    var rules = null;
    var value = "";
    var chk = false;

    switch (type) {
      case 0:
        rules = this.idRules;
        value = this.member.memId;
        break;
      case 1:
        rules = this.pwRules;
        value = this.member.memPw;
        break;
      case 2:
        rules = this.pwChkRules;
        value = this.member.pwChk;
        break;
      default:
        rules = this.emailRules;
        value = this.member.memEmail;
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
  fnIdDupChk() {
    var chk = this.fnRuleChk(0);

    if (chk) {
      this.axios
        .get("/signup/idDupChk/" + this.member.memId)
        .then((res) => {
          if (res.data > 0) {
            alert("중복되는 아이디가 존재합니다.");
          } else {
            alert("사용 가능한 아이디 입니다.");
            this.idDupChkd = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("형식에 맞는 id를 입력해주세요.");
    }
  },
  async fnMailVerify() {
    var chk = this.chk.emailChkd;
    if (!chk) {
      chk = this.fnRuleChk(3); // check rules
      if (chk) chk = await this.fnSendVerifyCode(); // send code
      if (chk) this.overlay = true; // open overlay
      if (chk) timer = this.fnSetTimer(); // set timer
    } else {
      if (confirm("인증이 완료된 메일을 변경할까요?")) {
        this.member.memEmail = "";
        this.otp = "";
        this.verifyCode = "";
        this.chk.emailChkd = false;
      }
    }
  },
  async fnVerifyReset() {
    this.fnDelTimer(-1); // del timer
    if (await this.fnSendVerifyCode() /* send code */) {
      alert("인증번호를 재전송하였습니다.");
      timer = this.fnSetTimer(); // set timer
    }
  },
  /* send code start */
  async fnSendVerifyCode() {
    var chk = false;
    await this.axios
      .get("/signup/verifyCode/" + this.member.memEmail)
      .then((res) => {
        this.verifyCode = res.data.token;
        chk = true;
      })
      .catch(() => {
        alert("다시 시도해주세요.");
      });
    return chk;
  },
  /* send code end */
  /* timer start */
  fnSetTimer() {
    var time = this.limitTime;
    let interval = setInterval(function () {
      if (time == 0) {
        alert("인증시간이 만료되었습니다.");
        clearInterval(timer);
      }
      var timerSpan = document.querySelector("#timer");
      var m = "0" + Math.floor(time / 60);
      var s = Math.floor(time % 60);
      s = s < 10 ? "0" + s : s;
      timerSpan.innerHTML = m + ":" + s;
      time--;
    }, 1000);
    return interval;
  },
  fnDelTimer(type) {
    clearInterval(timer);
    if (type != -1) {
      this.verifyCode = "";
      this.overlay = false;
    }
  },
  /* timer end */
  /* valid code start */
  fnValidCode() {
    var otp = window.btoa(this.otp);

    if (this.verifyCode == otp) {
      alert("이메일 인증이 완료되었습니다.");
      this.chk.emailChkd = true;
      this.fnDelTimer();
    } else {
      alert("인증번호를 다시 확인해주세요.");
    }
  },
  /* valid code end */
  // 다음 주소 api script tag 추가
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

  // 다음 주소 검색 호출
  fnExecDaumPostcode() {
    if (window.daum && window.daum.Postcode) {
      // 팝업 호출
      this.popup = new window.daum.Postcode({
        oncomplete: (data) => {
          // 우편번호 검색 완료 후의 처리 로직
          this.member.zipcode = data.zonecode;
          this.member.memAddr1 = data.address;
        },
      });

      this.popup.open();
    }
    // 오류 처리
    else {
      console.error("Daum Postcode 스크립트가 로드되지 않았습니다.");
    }
  },
  async fnValidate() {
    let chk = await this.$refs.signupFrm.validate();

    chk = chk.valid ? 0 : -1;

    if (chk == 0) this.fnFrmSubmit();
    else if (chk == 1) alert("아이디 중복을 확인해주세요.");
    else if (chk == 2) alert("비밀번호를 확인해주세요.");
    else if (chk == 3) alert("이메일 인증을 확인해주세요.");
    else alert("가입 정보를 다시 확인해주세요.");
  },

  async fnFrmSubmit() {
    if (confirm("회원으로 가입할까요?")) {
      await this.axios
        .post("/signup", this.member)
        .then((res) => {
          alert(res.data + "님의 가입을 환영합니다!");
        })
        .catch((err) => console.log(err));
    }
  },
};
```

/frontend/src/assets/js/signup/signupRules.js<br/><br/>
&nbsp; + id, 비밀번호, email 입력 값에 대한 validation 처리, computed에 import

```
export default {
  idRules() {
    const rules = [];

    const idNullChk = (v) => {
      if (v) return true;
      return "아이디는 필수 입력사항입니다.";
    };
    rules.push(idNullChk);

    const idRegChk = (v) => {
      var regExp = /^(?=.*[a-z0-9])[a-z0-9_-]{6,20}$/;

      if (regExp.test(v.trim())) return true;
      return "6~20자리의 영문소문자, 숫자, -, _ 조합으로 입력해주세요.";
    };

    rules.push(idRegChk);

    return rules;
  },
  pwRules() {
    const rules = [];
    const nullchk = (v) => {
      if (v) return true;
      return "비밀번호는 필수 입력사항입니다.";
    };
    rules.push(nullchk);

    const regchk = (v) => {
      var regExp =
        /(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

      if (regExp.test(v)) return true;
      return "8~16자리의 영문 소/대문자, 숫자, 특수문자($,`,~,!,@,$,!,%,*,#,^,?,&,,(,),-,_,=,+) 조합으로 입력해주세요.";
    };
    rules.push(regchk);

    return rules;
  },
  pwChkRules() {
    const rules = [];

    const nullchk = (v) => {
      if (v) return true;
      return "비빌번호를 확인해주세요.";
    };
    rules.push(nullchk);

    const pwChk = (v) => {
      if (v == this.member.memPw) return true;
      return "비밀번호를 확인해주세요.";
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

##### ③ style 추가

/frontend/src/assets/styles/common.scss

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

```

/frontend/src/assets/styles/views/header.scss

```
#header {
  width: 98.3%;
  height: 5em;
  border-bottom: 1px solid #ececec;
  overflow: visible !important;
  position: fixed !important;

  #headerMenu {
    height: 100%;
    box-shadow: none;
  }
  .v-toolbar__content {
    margin: auto 0;
  }
  a {
    text-decoration: none;
    cursor: pointer;
  }

  .toggleBtn {
    margin-right: 10px;
  }

  #logo {
    padding: 5px;
    height: 80%;
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px 20px 20px 0;

    .logo-icons {
      color: white;
      padding: 13px;
      font-size: 1em;
    }
    .logo-icons.alpha {
      font-size: 1.7em;
    }
  }

  #buttonBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;

    .headerBtn {
      height: 100%;
      border-radius: 2em;
      font-size: 1.3em;
    }
  }
}
```

/frontend/src/assets/styles/views/content.scss

```
.v-main {
  margin-top: 5.5em;
  min-height: 85vh;
  height: auto;
  display: flex;
  justify-content: center;
}

```

/frontend/src/assets/styles/components/main.scss

```
#main {
  width: 100%;
  height: 100%;
  min-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

/frontend/src/assets/styles/components/signup.scss

```
form#signup {
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

##### ③ router 설정

/frontend/src/router/index.js

```
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/components/MainPage.vue";
import SignupPage from "@/components/SignupPage.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes,
});

export default router;

```

##### ④ proxy 연결

/frontend/vue.config.js

```
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  // outputDir: npm run build 로 빌드시 파일이 생성되는 위치
  outputDir: "../src/main/resources/static",
  transpileDependencies: true,
  indexPath: "index.html",
  devServer: {
    proxy: "http://localhost:8082", // proxy 추가
  },
});

```

axios를 통해 외부 URL을 호출하면 연결되는 proxy를 설정한다.<br/>
연동을 위해 로컬 back단이 사용하는 8082 port를 proxy로 추가해준다.
<br/><br/>

다음으로는 화면 호출에 반응할 back단을 구성해보자.😎
