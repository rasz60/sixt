### 회원가입 페이지 만들기

회원가입 페이지를 만들기 위해서 기본 화면을 만들었다.
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

<script>
export default {};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>

```

/frontend/src/views/ContentView.vue

```
<script setup></script>

<template>
  <v-main>
    <RouterView />
  </v-main>
</template>

<script>
export default {};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.v-main {
  margin-top: 5.5em;
  min-height: 85vh;
  height: auto;
  display: flex;
  justify-content: center;
}
</style>

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#main {
  width: 100%;
  height: 100%;
  min-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

```

/frontend/src/views/SignupPage.vue

```
<template>
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
        ></v-text-field>
      </v-col>
      <v-col cols="1" class="btnCols">
        <v-btn prepend-icon="mdi-email-check-outline">인증하기</v-btn>
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
          @click.stop="execDaumPostcode"
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
        <v-btn prepend-icon="mdi-account-edit-outline" @click="validate"
          >회원가입</v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: "SignupPage",
  data() {
    return {
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
    };
  },
  computed: {
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
  },
  mounted() {
    this.loadDaumPostcodeScript();
  },
  methods: {
    fnIdDupChk() {
      var chk = false;
      for (var i = 0; i < this.idRules.length; i++) {
        chk = this.idRules[i](this.member.memId);
      }

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
    // 다음 주소 api script tag 추가
    loadDaumPostcodeScript() {
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
    execDaumPostcode() {
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
    async validate() {
      let chk = await this.$refs.signupFrm.validate();

      chk = chk.valid ? 0 : -1;

      if (chk == 0) this.frmSubmit();
      else if (chk == 1) alert("아이디 중복을 확인해주세요.");
      else if (chk == 2) alert("비밀번호를 확인해주세요.");
      else if (chk == 3) alert("이메일 인증을 확인해주세요.");
      else alert("가입 정보를 다시 확인해주세요.");
    },

    async frmSubmit() {
      if (confirm("회원으로 가입할까요?")) {
        await this.axios
          .post("/signup", this.member)
          .then((res) => {
            alert(res.data + "님의 가입을 환영합니다!");
          })
          .catch((err) => console.log(err));
      }
    },
  },
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
</style>

```

기본 설명은 Blog 만들기에서 충분히 설명했으니, 대략적인 구조와 추가된 기능을 위주로 살펴보겠다.
<br/><br/>

도메인으로 접근 시, HeaderView.vue와 ContentView.vue 화면을 출력한다.<br/>
ContentView.vue의 RouterView에는 router/index.js에 매핑된 url별 components를 출력한다<br/>
정확히는 '/' URL로 접근 시에는 MainPage.vue를, '/signup' URL 접근 시에는 SignupPage.vue를 출력한다.
<br/><br/>

그냥 보기에도 복잡한.. SignupPage.vue를 살펴보자.
<br/><br/>

회원가입 form은 Vuetify에서 제공하는 v-form을 사용했다.<br/>
&nbsp; + @submit.prevent : form submit이 일어나면 일단 이벤트를 막는다.<br/>
&nbsp; + ref="${form이름}" : form안에 각 필드별로 rules로 지정한 validation을 사용할 수 있다. (this.$refs.${form이름}.validate())<br/>
&nbsp; + rules : Vuetify가 제공하는 v-text-field 등 form 요소 component에 지정하면 computed에 정의한 절차를 수행하여 validation한다.<br/>
&nbsp; + computed :

##### ② common style 추가

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
