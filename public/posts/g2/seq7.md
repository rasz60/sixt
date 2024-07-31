### 로그인 구현 (2/2)

Back단의 소스 구성을 완료했으니 화면을 구현해보자.<br/>
Back단의 설정해놓은 filter를 타서 로그인과 토큰을 발급하려면 '/rest/login'을 호출하여야 한다.
<br/><br/>

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
      // 로컬 스토리지 loginInfo 초기화
      this.$loginInfo.login = false;
      this.$loginInfo.token = null;
      this.$loginInfo.expired = null;
      location.href = "/logout"; // spring security logout URL로 이동
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

<br/><br/>

/frontend/src/components/overlay/LoginDialog.vue

###### - 아직 구현하지는 않았지만 아이디/패스워드 찾기 기능에 필요한 기본 세팅이 들어갔다.

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
        v-show="!findId || dpLogin"
        v-model="memId"
        :rules="loginChk"
      ></v-text-field>
      <v-text-field
        variant="underlined"
        label="Password"
        type="password"
        v-show="(!findId && !findPw) || dpLogin"
        v-model="memPw"
        :rules="loginChk"
      ></v-text-field>
      <v-text-field
        variant="underlined"
        label="Email"
        type="email"
        v-show="findId || findPw"
        v-model="memEmail"
        :append-icon="findPw ? `mdi-check-circle-outline` : `mdi-email-outline`"
        @click:append="findPw ? fnTempPw() : fnValid()"
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
          dpLogin = true;
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
      v-if="dpLogin"
      @click="fnLogin"
    ></v-btn>
  </v-card>
</template>

<script>
import loginMethods from "@/assets/js/overlay/login/loginMethods";
import loginData from "@/assets/js/overlay/login/loginData";

export default {
  data() {
    return loginData;
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
  methods: loginMethods,
  watch: {
    findId(v) {
      this.initValue();
      if (v) {
        this.findPw = false;
        this.dpLogin = false;
        this.cardTitle = "Find ID";
      } else {
        if (!this.findPw) this.cardTitle = "Login";
      }
    },
    findPw(v) {
      this.initValue();
      if (v) {
        this.findId = false;
        this.dpLogin = false;
        this.cardTitle = "Find Password";
      } else {
        if (!this.findId) this.cardTitle = "Login";
      }
    },
  },
};
</script>

```

<br/>
/frontend/src/assets/js/overlay/login/loginMethods.js

```
export default {
  fnLoginDisplayReset() {
    this.$emit("sendMessage", { loginDisplay: false });
    this.findId = false;
    this.findPw = false;
    this.dpLogin = true;
  },
  initValue() {
    this.memId = "";
    this.memEmail = "";
    this.memPw = "";
  },
  async fnLogin() {
    if (
      this.loginChk[0](this.memId) == true &&
      this.loginChk[0](this.memPw) == true
    ) {
      let data = {
        memId: this.memId,
        memPw: this.memPw,
      };

      await this.axios
        .post("/rest/login", data)
        .then((res) => {
          if (res.status == 200) {
            // 로그인 창 닫기
            this.fnLoginDisplayReset();

            // 로그인 정보 localStorage 입력
            this.$loginInfo.login = true;
            this.$loginInfo.token = res.data;
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
};

```

<br/>
/frontend/src/assets/js/overlay/login/loginData.js

```
export default {
  memId: "",
  memPw: "",
  memEmail: "",
  cardTitle: "Login",
  dpLogin: true,
  findId: false,
  findPw: false,
  overlay: false,
};

```

다음으로 여태까지 컴포넌트 추가 정도하는 수준에서 조금 더 딥한 개념이 들어간다.
<br/><br/>

Vue는 URL에 따른 페이지 변경을 router에서 처리하고 필요한 정보만 rest로 얻어오는 방식이다.<br/>
장점인 부분을 제대로 사용하기 위해서 로그인 정보를 매번 server에 요청하는 것 보다는 다른 방법을 사용하였다.<br/>
기발한 나의 아이디어라기 보다는 보통의 개발자들이 이런 식으로 구현하는 것 같다.😏
<br/><br/>

① 로그인 시 브라우저 local storage에 정보 저장, 만료 시간 설정<br/>
② router를 통한 페이지 변경 시마다 만료 시간 체크<br/>

③ 만료 시간이 지나지 않았을 때<br/>
&nbsp;⑴ 만료 시간이 지나지 않았을 때, 만료 시간을 현재 시간 기준으로 다시 갱신<br/>
&nbsp;⑵ 로그아웃 버튼 클릭 시 ④번과 같은 로직 수행<br/>

④ 만료 시간이 지났을 때<br/>
&nbsp;⑴ 전역 변수 로그인 정보($loginInfo) 초기화<br/>
&nbsp;⑵ 서버 '/logout' URL 호출하여 Spring Security logout 처리<br/>

⑤ Spring Security logout 처리완료되면 '/'로 redirect
<br/><br/>

이렇게 동작하기 위해서 `main.js`와 router 설정이 들어있는 `index.js` 변경이 필요하다.
<br/><br/>

/frontend/src/main.js

```
/* create App Start */
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);
/* create App End */

.
.

/* loginInfo 반응형 전역변수 선언 Start */
import { reactive, watchEffect } from "vue";

// 로그인 정보 초기 값
var initLogin = { login: false, token: null, expired: null };

// localStorage에 저장된 loginInfo get
var storedInfo = JSON.parse(localStorage.getItem("rmfrLoginInfo"));

// localStorage에 loginInfo가 있으면 loginInfo를, 아니면 초기 값 설정
var info = storedInfo == null ? initLogin : storedInfo;
const loginInfo = reactive(info);

// loginInfo 변경 시 localStorage 변수 갱신
watchEffect(() => {
  localStorage.setItem("rmfrLoginInfo", JSON.stringify(loginInfo));
});

// loginInfo 전역 변수 선언
app.config.globalProperties.$loginInfo = loginInfo;
/* loginInfo 반응형 전역변수 선언 End */

.
.

```

<br/>

/frontend/src/router/index.js

```

.
.

// 라우터 변경 시마다 화면을 뿌리기 전에 실행
router.beforeEach(() => {
  // local storage에 로그인 정보 가져오기
  var loginInfo = JSON.parse(localStorage.getItem("rmfrLoginInfo"));

  // 로그인 상태인 경우
  if (loginInfo.login) {
    var today = new Date();

    // 만료일자가 현재 시간보다 크면 갱신
    if (loginInfo.expired > today.getTime()) {
      // 만료일자 현재 시간 +1 day
      loginInfo.expired = new Date().getTime() + 24 * 60 * 60 * 1000;
    }
    // 만료되었을 때
    else {
      // 로그인 정보 초기화
      loginInfo.login = false;
      loginInfo.token = null;
      loginInfo.expired = null;

      // 강제 로그아웃 안내 문구
      alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
      location.href = "/logout";
    }

    // 변경된 정보 local storage 저장
    localStorage.setItem("rmfrLoginInfo", JSON.stringify(loginInfo));
  }
});

export default router;

```

이렇게 하면 회원가입, 로그인 기능 구현이 완성되었다.<br/>
다음으로는 아이디, 비밀번호 찾기 기능과 회원 정보 수정 기능 구현으로 넘어가보겠다.😎
