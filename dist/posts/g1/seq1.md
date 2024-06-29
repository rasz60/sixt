### Github repository는 늘어나는데 기록이 하나도 없다. 😂

commit message만 들여다보고는 자세히 알기 힘들어서 구현했던 기능도 다시 구글링해야 하는 깊은 도르마무에 빠졌다. ⏳👾

포트폴리오를 만들 생각이 있던 차에, '아예 블로그를 만들어봐야겠다' 생각이 들었다.

그❗ 래❕ 서❗ 지금 보고있는 이 블로그를 만드는 과정을 하나씩 기록해보았다.😏
<br/><br/>

### Vue3 프로젝트 생성

회사 동료와 최근에 진행했던 `vue3`를 이용해서 만들기로 했다.<br/>
구현을 위한 자세한 내용은 [@yemsu](https://yemsu.github.io/make-github-io-blog-with-vue3-1/)라는 분의 블로그를 상당히 많이 참고했다.🙇‍♂️

<br/>간략하게는 이런 식으로 동작하는 블로그이다.
<br/>① markdown 파일로 게시글 작성, Git repository에 commit
<br/>② markdown 파일을 html로 전환
<br/>③ 게시글 리스트, 게시글 상세 페이지에 출력
<br/><br/>
먼저 VS-Code를 이용해서 vue 프로젝트를 생성했다.
[@issue#1. vue create terminal 권한 문제](#/logging/2)

```
vue create ${프로젝트를 저장할 경로}
..
> vue-st ([Vue 3] babel, router, vuex, eslint
.,
```

<br/>

### 초기 설정

① 프로젝트 생성한 폴더를 VS Code에 불러온 후, 사용할 dependency들을 설치한다.
[@issue#2. dependency 설치](#/logging/3)

###### ㄴ 직전 프로젝트 진행 시, funding 때문에 dependency가 제대로 동작하지 않아, 설치할 때 무조건 반사로 --no-fund를 붙이고 있다.

```
// vue-router : 페이지 전체를 동기하지 않고, url에 매핑된 component 불러오도록 함
npm i vue-router@next --no-fund

// raw-loader : markdown 파일을 읽어 옴
npm i raw-loader --no-fund

// showdown : raw-loader로 읽어온 markdown 파일을 html형태로 변환
npm i showdown --no-fund

// vuetify : component 제공
npm i vuetify --no-fund
npm i -D vuetify vite-plugin-vuetify --no-fund

// mdi/font : icon 제공
npm i @mdi/font --no-fund

// scss : style 시트를 scss로 작성할 예정 (사실.. 잘 사용할지 모르지만 따라함)
npm i sass sass-loader@10 -D --no-fund
```

###### 초반에 eslint와 prettier가 충돌해서 꽤나 애를 먹었..지만 해결! 💁‍♂️[@issue#3. prettier 설정](#/logging/4)

<br/>
② main.js : 설치한 dependency들을 사용할 수 있도록 main.js를 작성했다. 
###### ㄴ일단은 기본 페이지 띄우는데 필요하지 않은 것들은 제외했다.

```
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

let app = createApp(App);

app.use(vuetify).mount("#app");
```

<br/>
③ vue.config.js : markdown 파일을 raw-loader를 이용하여 불러오도록 설정
```
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  /* 아래 부분 추가 */
  chainWebpack: (config) => {
    config.module
      .rule("*.md")
      .test(/\.md?$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
});
```
<br/>
④ /src/plugins/vuetify.js : src 폴더 아래 plugins 폴더를 생성하고 Vuetify 사용을 위한 설정 파일 생성

```
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  components,
  directives,
});

```

<br/>
⑤ 그리고 나서, 프로젝트를 실행하면 vue에서 제공하는 기본 페이지가 나온다.
```
npm run serve
```
<br/>

이걸로 초기 설정은 끝! 🙌
