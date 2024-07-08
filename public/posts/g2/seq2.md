### 프로젝트 디테일 설정 변경

Github Pages에 배포된 페이지 구동까지 전반적인 작업을 마쳤다.<br/>
완성을 하고나서 보니 이상한 오류들이 몇 가지 보여 수정해보려고 한다.
<br/><br/>

① 페이지 이동 시 스크롤 이슈<br/>
② 주소 창에 URL 입력하여 접속하는 형태 404 이슈
<br/><br/>

이렇게 2가지 이슈는 모두 router 설정을 변경하여야 한다.
<br/><br/>

##### ① 페이지 이동 시 스크롤 이슈

아무런 설정 없이 페이지 이동 시, 현재 보고있던 스크롤이 그대로 고정된 채로 페이지가 변경되었다.<br/>
이게 더 편한 사람들도 있을 것 같지만, 거슬리니 페이지 변경마다 최상위로 스크롤이 이동하도록 변경했다.<br/>
<br/>

##### ② URL 직접 호출 시 404 이슈

새 탭에 현재 보고 있는 url을 입력하거나 새로고침하면 404 에러가 발생한다.<br/>
이는 SPA 형태의 웹에서 발생하는 현상이라고 한다.<br/>
해결 방법이 몇 가지 있는 것으로 보이지만, router의 WebHashHistory를 사용하는 방식으로 변경하였다.

###### [참고 #1. SPA 형태 웹과 기존 웹의 차이](https://velog.io/@gwanuuoo/SPA%EB%8A%94-%EA%B8%B0%EC%A1%B4-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%99%80-%EC%B0%A8%EC%9D%B4)

###### [참고 #2. vue-router history와 hash history 차이점](https://happy-coding-day.tistory.com/entry/Vue-vue-router%EC%97%90%EC%84%9C-Hash-Mode-Vs-History-Mode-%EC%B0%A8%EC%9D%B4%EC%A0%90%EC%9D%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)

<br/>

src/router/index.js

```
import { createRouter, createWebHashHistory } from "vue-router"; // hashHistroy 사용
import MainPage from "@/components/MainPage.vue";
import LogList from "@/components/LogList.vue";
import LogDetails from "@/components/LogDetails.vue";

const routes = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
  },
  {
    path: "/log",
    name: "LogList",
    component: LogList,
  },
  {
    path: "/log/:seq",
    name: "LogDetails",
    component: LogDetails,
  },
];

const router = createRouter({
  // hashHistroy 사용
  history: createWebHashHistory(),
  // 항상 맨 위로 스크롤
  scrollBehavior() {
    return {
      top: 0,
    };
  },
  routes,
});

export default router;
```

이렇게 변경하면 페이지 변경 시 스크롤은 항상 최상위로 이동하고, url 입력과 새로고침 시 모두 정상적으로 페이지를 호출하게 된다.<br/>
URL에 #이 들어가는게 조금 특이하지만 이 방식으로 2가지 이슈를 해결했다!<br/>

다음으로는 😎
