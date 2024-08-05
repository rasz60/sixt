### Vuex 사용 간단한 리팩토링

게시판 구현으로 넘어가기 전 vuex를 사용하여 구현한 기능 중 한 부분을 정리해보려고 한다.<br/>
회원 가입과 회원 정보 수정 시 동일한 항목을 작성/수정하게 된다. 이 때 같은 검증 로직을 페이지마다 추가하였는데 이 부분을 고쳐보겠다.<br/>
vuex 설정은 미리 해두었지만 처음부터 다시 정리해보겠다.
<br/><br/>

##### ① Vuex 설치 (v.4.0.0)

```
npm i -d vuex --no-fund
```

##### ② Vuex 사용 설정

###### - modules에 여러개 module을 import하고 각자의 이름으로 불러올 수 있다.

/frontend/src/store/index.js

```
import { createStore } from "vuex";
import { member } from "./modules/memberStores";
export const store = createStore({
  modules: { member },
});
```

/frontend/src/store/mutation_types.js

```
// 메서드명 상수 선언
export const MEMBER = {
  NULL_CHK: "NULL_CHK",
  REG_CHK: "REG_CHK",
};
```

/frontend/src/store/modules/memberStores.js
&nbsp; ① state : 변수처럼 사용할 데이터 값, vue script에 data와 같은 것으로 생각하면 된다.<br/>
&nbsp; ② mutations : 일정 로직을 실행하여 state 값을 변경하는 함수, 2번째 선언된 변수로 parameter를 받을 수 있고 값을 return할 수 없다.
&nbsp; ③ getters : 일정 로직을 실행하여 state 값을 return 하는 함수, parameter를 받을 수 없고 state를 return할 수 있다.
&nbsp; ④ actions : mutations를 실행시키는 함수, 굳이 나눈 이유는 interface 같은 형태를 원한걸까..? 좀 더 공부해봐야할 것 같다.

```
import { MEMBER } from "../mutation_types";

export const member = {
  namespaced: true, // member라는 이름으로 불러올 수 있도록 namespace 사용 여부 설정
  state: () => ({ // 상태 값, 변수 값
    chk: false,
    msg: "",
    reg: {
      id: /^(?=.*[a-z0-9])[a-z0-9_-]{6,20}$/,
      pw: /(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/,
      mail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    regMsg: {
      id: "6~20자리의 영문소문자, 숫자, -, _ 조합으로 입력해주세요.",
      pw: "8~16자리의 영문 소/대문자, 숫자, 특수문자($,`,~,!,@,$,!,%,*,#,^,?,&,,(,),-,_,=,+) 조합으로 입력해주세요.",
      mail: "형식에 맞는 이메일 주소를 입력해주세요. (ex> emailId@domain.com)",
    },
  }),

  mutations: { // state 값 변경 로직
    [MEMBER.NULL_CHK](state, v) {
      state.chk = !(v == "" || v == null);
      if (!state.chk) state.msg = "필수 입력 값을 입력해주세요.";
    },
    [MEMBER.REG_CHK](state, param) {
      state.chk = state.reg[param.type].test(param.value.trim());
      if (!state.chk) state.msg = state.regMsg[param.type];
    },
  },

  getters: { // state 값 출력 로직
    getChk: (state) => {
      return state.chk ? true : state.msg;
    },
  },

  actions: { // 화면은 actions를 호출, actions는 mutations을 호출
    nullChk: ({ commit }, v) => {
      commit(MEMBER.NULL_CHK, v);
    },

    regChk: ({ commit }, param) => {
      commit(MEMBER.REG_CHK, param);
    },
  },
};
```

/frontend/src/main.js

```
/* create App Start */
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);
/* create App End */

.
.

/* vuex Start */
import { store } from "./store";
/* vuex End */

.
.

/* app Mount */
app.use(router).use(store).use(vuetify).mount("#app");

```

##### ③ methods, computed 단에 vuex 호출

###### - mapActions, mapGetters 객체로 actions, getters로 선언한 메서드를 가져와 this.{ACTION_NAME} 으로 호출하여 사용할 수 있다.

/frontend/src/assets/js/signup/signupMethods.js

```
import { mapActions } from "vuex"; // mapActions import

export default {
  ...mapActions("member", ["nullChk", "regChk"]), // member modules에 nullChk, regChk를 불러옴

  .
  .

}
```

/frontend/src/assets/js/signup/signupRules.js

```
import { mapGetters } from "vuex"; // mapGetters import

export default {
  ...mapGetters("member", ["getChk"]), // member modules에 getChk을 불러옴
  idRules() {
    const rules = [];
    const idNullChk = (v) => {
      this.nullChk(v); // signupMethods 에서 선언한 nullChk 함수를 this.함수명으로 호출
      return this.getChk; // 위에서 getters로 가져온 getChk 함수를 this.함수명으로 호출
    };
    rules.push(idNullChk);
    const idRegChk = (v) => {
      var param = { type: "id", value: v }; // obj형태 파라미터 전달
      this.regChk(param); // signupMethods 에서 선언한 regChk 함수를 this.함수명으로 호출
      return this.getChk; // 위에서 getters로 가져온 getChk 함수를 this.함수명으로 호출
    };
    rules.push(idRegChk);
    return rules;
  },
  pwRules() {
    const rules = [];

    const pwNullChk = (v) => {
      this.nullChk(v);
      return this.getChk;
    };
    rules.push(pwNullChk);

    const regChk = (v) => {
      var param = { type: "pw", value: v };
      this.regChk(param);
      return this.getChk;
    };
    rules.push(regChk);

    return rules;
  },
  pwChkRules() {
    const rules = [];

    const pwChk = (v) => {
      if (this.memPw != "" && v == this.memPw) {
        this.chk.pwChkd = true;
        return true;
      } else {
        return "비밀번호를 확인해주세요.";
      }
    };
    rules.push(pwChk);

    return rules;
  },
  emailRules() {
    const rules = [];

    const mailNullChk = (v) => {
      this.nullChk(v);
      return this.getChk;
    };
    rules.push(mailNullChk);

    const regchk = (v) => {
      var param = { type: "mail", value: v };
      this.regChk(param);
      return this.getChk;
    };
    rules.push(regchk);

    return rules;
  },
};

```

/frontend/src/assets/js/settings/settingsMethods.js

```
import { mapActions } from "vuex";

export default {
  ...mapActions("member", ["nullChk", "regChk"]),

  .
  .

}
```

/frontend/src/assets/js/settings/settingsRules.js

```
import { mapGetters } from "vuex";
export default {
  ...mapGetters("member", ["getChk"]),
  pwRules() {
    const rules = [];

    const pwNullChk = (v) => {
      this.nullChk(v);
      return this.getChk;
    };
    rules.push(pwNullChk);

    const regchk = (v) => {
      var param = { type: "pw", value: v };
      this.regChk(param);
      return this.getChk;
    };
    rules.push(regchk);

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

    const mailNullChk = (v) => {
      this.nullChk(v);
      return this.getChk;
    };
    rules.push(mailNullChk);

    const regchk = (v) => {
      var param = { type: "mail", value: v };
      this.regChk(param);
      return this.getChk;
    };
    rules.push(regchk);

    return rules;
  },
};

```

이렇게 체크 로직의 구현부를 vuex store에 저장하고, 공통으로 사용하는 페이지에서 불러와 사용하는 방식으로 변경했다.😎
