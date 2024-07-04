### 게시글 상세 페이지

저번 포스트에서 검색과 전체 보기 기능을 구현했다.<br/>
이번에는 마지막으로 상세 페이지로 이동하고 게시글 내용을 표시해보도록 하겠다.
<br/><br/>

&nbsp;① 한 줄에 3개씩 게시글 표시 - 완료<br/>
&nbsp;② 검색 기능 - 완료<br/>
&nbsp;③ 전체 목록을 표시하는 버튼 - 완료<br/>
&nbsp;④ 게시글을 클릭하면 상세 페이지로 이동
<br/><br/>

##### ④ 게시글 클릭하면 상세 페이지로 이동

먼저 작성한 게시물을 불러오는 url은 /log/${seq} 형태이다.<br/>
seq는 \_posts.json 파일에 작성한 메타 데이터에 들어있는 seq를 보내려고 한다.<br/>
이 url이 동작하려면 2가지 설정이 필요하다.
<br/><br/>

&nbsp;⑴ 게시글 목록에서 게시글 클릭 시 url 이동<br/>
&nbsp;⑵ 변경된 url을 router가 감지할 수 있도록 router 설정 추가
<br/><br/>

메뉴 화면 작성 시 사용했던 router-link로 post 블럭을 감싸 클릭하면 '/log/${seq}' url로 이동하도록 설정했다.
<br/><br/>

src/components/LogList.vue

```
<template>
  .
  .
  <v-row v-for="(i, idx) in rows" :key="i" class="loggingRow">
    <v-col
      v-for="post in displayPosts.filter((e, index) => {
        if (index >= idx * 3 && index < (idx + 1) * 3) return e;
      })"
      :key="post"
      cols="4"
    >
      <router-link :to="`/log/`+post.seq">
        <v-card class="post" link>
        .
        .
        </v-card>
      </router-link>
    </v-col>
  </v-row>
  .
  .
</template>
.
.
<style>
.
.
.linkPost {
  text-decoration: none;
}
.
.
</style>

```

다음은 router 설정에 /log/${seq}를 추가해주어야 한다. 동적인 변수를 binding하는 방법은 아래와 같다.
<br/><br/>

src/router/index.js

```
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/components/MainPage.vue";
import LogList from "@/components/LogList.vue";
import LogDetails from "@/components/LogDetails.vue"; // 추가

const routes = [
  .
  .
  .
    {
    path: "/log/:seq",
    name: "logDetails",
    component: LogDetails,
    }, // 추가
  ];
  .
  .
  .
```

/log/${seq} url을 호출하면, LogDetails.vue을 불러오도록 설정하였고, parameter로 넘어온 seq를 component 안에서 변수처럼 사용할 수 있다.<br/>
다음으로는 LogDetails.vue를 생성했다.
<br/><br/>

src/components/LogDetails.vue

```
<template>
  <v-card id="details">
    <v-card-title id="detailsTitle">
      {{ post.title }}
    </v-card-title>

    <span id="subTitle">{{ post.date }}</span>
    <div id="btnBox">
      <v-btn
        size="small"
        prepend-icon="mdi-format-list-bulleted"
        @click="this.$router.push('/log')"
        color="secondary"
        >go to list</v-btn
      >
    </div>
    <v-divider></v-divider>
    <div id="doc" v-html="contents"></div>
  </v-card>
</template>

<script>
// 전체 posts json
import posts from "/public/json/_posts.json";
// markdown(.md) 파일 html로 convert
import htmlConverter from "@/utils/HTMLConverter";

export default {
  name: "LogDetails",
  data() {
    return {
      post: null,
      contents: null,
    };
  },
  created() {
    // 게시물 가져오기
    this.setPost();
  },
  methods: {
    async setPost() {
      // router에 parameter 가져오기
      const param = this.$route.params.seq;

      // 전체 포스트에서 parameter의 seq와 같은 포스트만 가져와 data 저장
      this.post = JSON.parse(JSON.stringify(posts)).filter(
        (e) => e.seq == param
      )[0];

      // 실제 파일 import
      const post = await import("/public/posts/" + this.post.fileName);

      // markdown(.md) 파일 html로 convert하여 data 저장
      this.contents = htmlConverter(post.default);
    },
  },
};
</script>

<style lang="scss">
#detailsTitle {
  justify-content: center;
  font-size: 30px;
  width: 100%;
  height: auto;
  padding-top: 3em;
  padding-bottom: 1em;
  font-weight: 700;
}

#subTitle {
  display: flex;
  justify-content: center;
  color: darkgray;
}

#btnBox {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}

#doc {
  padding: 20px;

  * {
    margin: 5px;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.8em;
  }

  h3 {
    font-size: 1.6em;
  }

  h4 {
    font-size: 1.4em;
    margin: 1rem;
  }

  h5 {
    font-size: 1.2em;
    margin: 0.8rem;
  }

  h6 {
    font-size: 1em;
    margin: 0.6rem;
  }

  h1,
  h2,
  h3 {
    padding-bottom: 1.2rem;
    margin-bottom: 1.2rem;
    border-bottom: 1px solid lightgray;
  }

  h6 {
    color: darkgray;
    font-weight: 400;
  }

  code {
    background-color: #f7f7f7;
    padding: 5px;
    border-radius: 10px;
    margin: 0.3em;
    font-weight: 500;
  }

  pre {
    background-color: #f7f7f7;
    padding: 15px;
    border-radius: 10px;
    margin: 1em;
    white-space: pre-wrap;

    code {
      padding: 0;
      background-color: transparent;
      border-radius: none;
      margin: 0;
      font-weight: 400;
    }
  }

  a {
    text-decoration: none;
  }

  a:hover {
    background-color: aliceblue;
  }

  hr {
    margin-top: 2em;
    margin-bottom: 2em;
  }
}
</style>

```

그리고 showdown을 이용하여 markdown 파일을 html 형식으로 변환해주는 .js 파일도 추가했다.
<br/><br/>

src/utils/HTMLConverter.js

```
import showdown from "showdown";

const htmlConverter = (md) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(md);
};

export default htmlConverter;
```

상세 페이지 기본적인 동작은 이렇다.
<br/><br/>

① 게시글 리스트에서 특정 게시글 클릭 시, /log/${seq} url로 이동<br/>
② router에서 url을 감지하여 #contents 엘리먼트에 LogDetails.vue 페이지 출력<br/>
③ LogDetails.vue created() 단에서 setPosts() 호출<br/>
④ this.$route.param은 url로 넘어온 파라미터를 담고있는 객체로, router 설정 js에서 path에 ':변수명'으로 적어놓은 파라미터를 담고있다.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;seq로 넘겨준 변수를 받아, 전체 포스트 중 seq가 같은 포스트만 가져와 data post에 바인딩했다.<br/>
⑤ src/utils/HTMLConverter.js의 htmlConverter() 메서드 호출<br/>
⑥ 선택한 게시물의 실제 파일명의 markdown(.md) 파일을 html 형식 텍스트로 변환하여 return<br/>
⑦ html 텍스트를 data content 변수에 저장<br/>
⑧ content 변수를 model로 하는 div#doc element안에 render
<br/><br/>

그리고 화면 우측 상단에 다시 게시물 목록으로 돌아가는 버튼을 추가했다.<br/>
해당 버튼은 vuetify가 제공하는 v-btn을 사용했고, @click 이벤트에 this.$router.push() 메서드를 호출했다.<br/>
다음과 같이 정의하면 router-link가 화면을 이동하는 방식과 동일하게 url 이동과 화면 변경을 할 수 있다.
<br/><br/>

지금까지 Vue3를 활용하여 기본적인 블로그를 만들어보았다.<br/>
지금 보고있는 블로그는 이 것을 조금 더 확장, 발전시킨 것이다.<br/>
블로그 만들기는 여기에서 종료하고, 다음으로는 Github Pages를 이용하여 블로그를 배포해보자.😎
