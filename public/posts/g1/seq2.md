### 프로젝트 세팅

저번 포스팅에서는 기본 Vue 프로젝트를 기동할 수 있는 초기 설정을 마쳤다.
<br/>
이번엔 본격적으로 프로젝트 폴더 트리 구성과 페이지를 세팅해보자.
<br/><br/>

폴더 트리 구성

```
SIXT.GITHUB.IO
 ㄴpublic
   ㄴjson
   ㄴposts
 ㄴsrc
   ㄴassets
     ㄴjs
     ㄴstyle
   ㄴcomponents
   ㄴplugins
   ㄴrouter
   ㄴutils
   ㄴviews
  App.vue
  main.js
 ..
 package.json
 vue.config.js
 ..
```

폴더 트리 구성이 특별할 건 없다. 참고로 나는 풀스택을 지향하지만 아무래도 백엔드 개발자이다.<br/>
그러니 폴더 구성은 내가 맘대로 해버린 거라서 일반적인 구성과는 다를 수도 있다.🤷‍♂️<br/><br/>

### 화면 구성

다음으로 화면을 구성해보자.<br/>

대략적으로 .vue 파일은 아래와 같이 구성된다.<br/>
① `<script setup>` : 사용할 vue 파일 import, 변수 선언 등<br/>
② `<template>` : 화면을 그리는 html 코드<br/>
③ `<script>` : data, methods, computed 등 vue에서 사용할 변수 혹은 메서드를 선언하거나, created, mounted, watch 등 페이지 생성 주기에 따라 필요한 로직을 실행할 수 있다.<br/>
④ `<style>` : html style을 정의하는 css 소스
<br/><br/>

우선 아래 3개 소스를 전부 복붙해놓고 다음 포스트에서 하나씩 뜯어보도록 하자.<br/>
App.vue는 이미 src 폴더에 생성되어 있고, MenuView.vue와 ContentView.vue는 views 폴더 안에 생성한다.<br/><br/>

App.vue

```
<script setup>
import MenuView from "@/views/MenuView.vue";
import ContentView from "@/views/ContentView.vue";
</script>

<template>
  <v-container id="container">
    <v-row id="main">
      <v-col cols="3" id="menu">
        <MenuView />
      </v-col>
      <v-col cols="9">
        <ContentView />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "app",
};
</script>

<style lang="scss">
.v-container {
  padding-top: 3rem !important;
  min-height: 800px;

  #main {
    padding: 0;
  }

  #menu {
    height: auto;
    padding-left: 1em;
    padding-right: 3em;
  }
}
</style>
```

MenuView.vue

```
<template>
  <v-layout id="menuSection">
    <!-- 최상단 프로필 부분 start -->
    <v-list id="profile">
      <v-list-item
        prepend-avatar="프로필 이미지"
        title="본인의 이름"
        subtitle="이메일 주소"
      >
        <div id="social">
          <v-icon
            icon="mdi-github"
            @click="newWindow(`github url을 입력해주세요`)"
          />
        </div>
      </v-list-item>
    </v-list>
    <!-- 최상단 프로필 부분 end -->

    <v-divider></v-divider>

    <!-- 메뉴 item 부분 start -->
    <v-list density="compact" nav id="nav">
      <v-list-item
        prepend-icon="mdi-note-edit-outline"
        title="LOGGING"
        value="blog"
        class="navItems"
      >
      </v-list-item>
    </v-list>
    <!-- 메뉴 item 부분 end -->
  </v-layout>
</template>

<script>
export default {
  name: "menuView",
  data() {
    return {};
  },
  methods: {
    newWindow(url) {
      // github url을 새 탭에서 열어주는 메서드입니다.
      window.open("about:blank").location.href = url;
    },
  },
};
</script>

<style lang="scss">
#menuSection {
  display: block;
  position: relative;
  height: 90vh;
  background-color: rgba(247, 165, 1, 0.65);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0.3em 0.3em 1em lightgray;

  transition: all 10ms linear;

  /* v-list custom */
  .v-list {
    background-color: transparent;
    color: #1a1a1a;

    .v-list-item-title {
      font-weight: 400;
    }
  }

  /* profile section custom */
  #profile {
    width: 100%;
    margin-bottom: 10px;

    .v-avatar {
      width: 150px;
      height: 150px;
      background-color: ghostwhite;
    }
    .v-avatar img {
      width: 100%;
    }
    .v-avatar:hover {
      cursor: pointer;
    }
    .v-avatar:hover img {
      transition-property: all; /*모든부분 변화*/
      transition-duration: 0.2s; /*0.2s동안 변화*/
      transition-timing-function: linear; /*일정한 속도로 변화*/
      transition-delay: 0; /*즉시변화-> 0이 default값이므로 생략 가능*/
      transform: scale(1.15); /* 1.15배 크기로 변화*/
    }

    div#social {
      margin-top: 10px;

      .v-icon {
        padding: 18px !important;
        cursor: pointer;
      }

      .v-icon:hover {
        transition-property: all; /*모든부분 변화*/
        transition-duration: 0.2s; /*0.2s동안 변화*/
        transition-timing-function: linear; /*일정한 속도로 변화*/
        transition-delay: 0; /*즉시변화-> 0이 default값이므로 생략 가능*/
        transform: scale(1.15); /* 1.15배 크기로 변화*/
      }
    }
  }

  /* nav section custom */
  #nav .navItems {
    margin: 0.2rem;
    padding: 1.2rem;
    font-size: 1.2rem;

    .v-list-item-title {
      text-align: center;
      font-size: 1.2rem;
    }
  }
}
</style>
```

ContentView.vue

```
<template>
  <div id="contents">
    <!-- 지금은 비워두겠습니다. -->
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
