### App.vue

우선 App.vue 파일 소스를 먼저 들여다보자.<br/><br/>

App.vue 파일은 vue의 최상위 부모 페이지이다. 첫 번째 포스트에서 main.js에 사용할 dependency를 나열하여 적용했다.<br/>
다시 들여다보면 나열한 dependency를 결국 import해놓았던 App.vue에 mount한 것을 볼 수 있다.<br/>
그래서 main.js에 선언한 dependency를 App.vue에서 불러와서 쓸 수 있다.
<br/><br/>

① `<script setup>`

­ + import해야 할 vue 파일을 선언했다. import ${변수명} from ${파일 경로}; 와 같은 형태로 선언한다.<br/>
­ + 파일 경로에 '@/'는 실제로는 'src/'로 변환되며, jsconfig.json 파일에 paths 속성에 기본으로 설정되어 있고 마음대로 추가/수정할 수도 있다.

```
<script setup>
import MenuView from "@/views/MenuView.vue";
import ContentView from "@/views/ContentView.vue";
</script>
```

② `<template>`

­ + [Vuetify🔗](https://vuetifyjs.com/en/components/all/#form-inputs-and-controls)에서 제공하는 Grid component인 v-row로 메뉴(3) : 컨텐츠(9) 로 나누었다.<br/>
­ + 그 안에 위에서 import한 MenuView와 ContentView를 적용했다.<br/>

```
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
```

③ `<script>`

­ + vue의 생성 주기에 따른 script 소스, vue파일에서 사용할 model 부분이 모두 들어가는데 나중에 좀 더 상세히 알아보자.

```
<script>
export default {
  name: "app",
};
</script>
```

④ `<style>`

­ + template에 들어가는 html을 디자인하는 부분이다.<br/>
­ + scss로 작성했고, [Vuetify🔗](https://vuetifyjs.com/en/components/all/#form-inputs-and-controls) component의 class 명을 가지고 나름의 커스텀 작업을 했다.<br/>
­ + style은 욕심 있으신 분들은 직접 작성하고, 디자인이 별로 상관없다면 그대로 긁어서 사용하자.<br/>

```
<style lang="scss">
.v-container {
  padding-top: 3rem !important;
  min-height: 800px;

  #main {
    height: auto;
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

### MenuView.vue

다음은 메뉴 소스를 보자.<br/>
참고로 App.vue를 제외한 모든 .vue 파일은 'Menu'+'View'처럼 2개 이상의 단어를 조합하는 형태로 파일명을 지어야하는 규칙이 있다.
<br/><br/>

① `<template>`

­ + 역시 [Vuetify](https://vuetifyjs.com/en/components/all/#form-inputs-and-controls)에서 제공하는 v-list, v-icon등을 사용해서 완성했다.<br/>
­ + @click은 vue에서 해당 엘리먼트에 이벤트를 바인딩하는 방식이다. 아래 v-icon 을 클릭하면, newWindow라는 method를 실행하고 git 주소를 파라미터로 넘긴다.

```
<template>
  <v-layout id="menuSection">
    <!-- 최상단 프로필 부분 start -->
    <v-list id="profile">
      <v-list-item
        prepend-avatar="${프로필 사진}"
        title="${프로필 이름}"
        subtitle="${메일 주소}"
      >
        <div id="social">
          <v-icon
            icon="mdi-github"
            @click="newWindow(`${깃 주소}`)"
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
```

② `<script>`

­ + data, methods라는 새로운 속성이 등장했다. 이외에도 create(), mounted(), watch 등등 여러가지를 사용할 수 있다.<br/>
­ + data : return 안에 예시처럼 속성을 명시해주고 값을 변경하여 동적으로 사용할 수 있다.<br/>
­ + methods : 말 그대로 사용할 method들을 정의해놓는 곳이다. 콤마로 구분하여 나열한다.

```
<script>
export default {
  name: "menuView",
  data() {
    return {
        /* 예시
        menu: null,
        items: [],
        */
    };
  },
  methods: {
    newWindow(url) {
      window.open("about:blank").location.href = url;
    },
  },
};
</script>
```

③ `style`

­ + style은 자세히 설명할만한 건 딱히 없고, 프로필 이미지와 깃 허브 아이콘에 마우스 오버하면 1.15배 커지게 만드는 잔기술 정도가 들어갔다.

```
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
```

마지막 ContentView.vue 파일은 아직은 소스가 간단해서 별다르게 설명할 점이 없다.<br/>
다음 포스트에서 RouterView를 사용하는 방식으로 변경하면서 설명을 이어가겠다.🙋‍♂️
<br/><br/>
