### Vue3 프로젝트 만들기

이번 프로젝트도 화면은 Vue3를 통해 구현했다. 먼저 프로젝트 최상위 경로에 frontend 폴더를 추가한다.<br/>
그리고 frontend 폴더 경로에 이전 [🔗Github Pages Blog 만들기 #1](/#/logging/1)에서 Vue3 프로젝트를 생성을 참고하여 생성했다.<br/>
다른 점은 markdown 사용을 위한 raw-loader, showdown은 제외했고, http 통신으로 backend와 통신하기 위해 Axios 를 추가해준다.
<br/><br/>

/frontend/package.json

```
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "@mdi/font": "^7.4.47",
    "axios": "^1.7.2",
    "core-js": "^3.8.3",
    "eslint-plugin-vue": "^9.27.0",
    "vue": "^3.2.13",
    "vue-router": "^4.0.13",
    "vuex": "^4.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.12.16",
    "@babel/eslint-parser": "^7.12.16",
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-plugin-router": "~5.0.0",
    "@vue/cli-plugin-vuex": "~5.0.0",
    "@vue/cli-service": "~5.0.0",
    "eslint": "^7.32.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-prettier": "^4.0.0",
    "prettier": "^2.4.1",
    "sass": "^1.77.7",
    "sass-loader": "^10.5.2",
    "vite-plugin-vuetify": "^2.0.3",
    "vuetify": "^3.6.12"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/vue3-essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    },
    "rules": {}
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"
  ]
}
```

/frontend/src/main.js

```
/* create App Start */
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);
/* create App End */

/*  router Start */
import router from "./router";
/*  router End */

/* vuex Start */
import store from "./store";
/* vuex End */

/* Axios Start */
import axios from "axios";
// http header 설정 (get / post / put / delete)
axios.defaults.headers.get["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.delete["Content-Type"] = "application/json";
// app 내에서 전역변수 선언
app.config.globalProperties.axios = axios;
/* Axios End */

/* vuetify Start */
import vuetify from "./plugins/vuetify";
/* vuetify End */

/* app Mount */
app.use(router).use(store).use(vuetify).mount("#app");

```

처음 다루는 axios에 관해 설명하자면, 흔히 javascript, jQuery 등에서 사용하는 Ajax 통신을 위한 library이다.<br/>
http get, post, put, delete를 지원하며 Content-Type을 Json으로 사전에 정의하였다.<br/>
axios라는 이름으로 전역변수를 선언했고, #app 내 컴포넌트 script 단에서 this.axios 로 불러올 수 있다.<br/>

`app.config.globalProperties.${변수명}` : app 전역변수 선언

<br/><br/>

그 다음으로 Vue 프로젝트의 source build Path를 설정한다.<br/>
첫 번째 포스트에서 보면, localhost:8082로 접근하면 src/main/resources/static 폴더 아래 있는 index.html 파일을 출력하고 있다.<br/>
정적 리소스인 화면 소스는 static 폴더에 있어야 하므로, static 폴더로 build되도록 설정해준다.
<br/><br/>

/frontend/vue.config.js

```
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "../src/main/resources/static",   // npm run build 로 빌드시 파일이 생성되는 위치
  indexPath: "index.html", // index 페이지로 매핑될 파일
});

```

<br/>

`outputDir`<br/>

기존엔 `npm run build`를 실행하면 dist라는 폴더를 생성하고 소스를 모듈화하여 build 했다. outputDir를 지정하면 해당 path를 찾아 모듈화된 소스를 build하게 된다.<br/>

`transpileDependencies`<br/>

babel-loader가 node_modules 하위에 있는 항목들까지 처리할 수 있도록 true 설정. (Vue create한 프로젝트는 기본으로 설정되어 있음)<br/>

`indexPath`<br/>

index.html 파일을 기본 페이지로 설정
<br/><br/>

이렇게 설정하고 나서, npm run build를 실행하면 src/main/resources/static 폴더로 frontend 소스가 build된다.<br/>
그리고나서 Spring-boot를 run하고 localhost:8082로 접속하면 vue 기본페이지가 출력되는걸 확인할 수 있다.
