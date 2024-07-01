### vue-router 사용하기

vue-router는 url에 따라서 필요한 특정 컴포넌트만 변경하도록 하는 방식이다.
<br/><br/>
화면 상으로 페이지 전환이 부드럽고 페이지가 전환되어도 변수의 값이 유지되는게 장점이고,<br/>
반대로 페이지, 로그인 정보 등 수시로 초기화 해야하거나 url을 입력 시 404 에러가 발생하는 단점도 있다.<br/>
그래도 직접 쓰면서 발견한 단점들은 어느정도 보완하는 방법을 찾았기 때문에 유용함이 더 크다.<br/>
이전 포스트에서 말한대로 ContentView.vue 파일에 router를 사용하기 위해 router 설정부터 시작해보자.<br/>

우선 contentView.vue에 router로 들어갈 component를 만들어야한다.
<br/><br/>
src/components/MainPage.vue

```
<template>
  <div id="main">
    <h1>금방 만들어보겠습니다🙋‍♂️</h1>
  </div>
</template>

<script>
export default {
  name: "mainPage",
};
</script>

<style>
#main {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  height: 100%;
}
</style>
```

다음으로는 router를 설정하는 index.js 파일을 수정해야한다.
<br/><br/>

src/router/index.js

```
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/components/MainPage.vue";

const routes = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
```

아까 만든 MainPage.vue 파일을 import하고, routes 배열 안에 MainPage를 추가해준다.<br/>
&nbsp;① path : 해당 페이지와 매핑될 url을 적어준다.<br/>
&nbsp;② name : router에서 해당 페이지를 인식하는 이름<br/>
&nbsp;③ component : 실제로 화면에 표시될 component 파일, import한 vue파일의 변수명을 입력한다.
<br/><br/>

다음으로 App.vue에서 router를 사용할 수 있도록 main.js에 추가해준다.<br/>

src/main.js

```
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 추가
import vuetify from "./plugins/vuetify";

let app = createApp(App);

app
  .use(router) // 추가
  .use(vuetify)
  .mount("#app");
```

이렇게 router 사용을 위한 설정을 마쳤고, 이제 실제로 router를 사용해보자.<br/>
router가 들어갈 ContentView.vue RouterView만 추가해주면 끝이다.
<br/><br/>

src/views/ContentView.vue

```
<template>
  <div id="contents">
    <RouterView />
  </div>
</template>

<script>
export default {
  name: "contentSection",
};
</script>

<style lang="scss">
#contents {
  height: 100%;
  padding-left: 10px;
}
</style>
```

이렇게 하면, URL 변경을 router가 감지하고, index.js파일에 정의한 route 중 path와 url이 같은 component를 RouterView 태그 안에 mount한다.
<br/><br/>

다음은 블로그 글 리스트 페이지를 만들어보자.
