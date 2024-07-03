### 게시글 목록 페이지 만들기

이제 블로그 글 목록 페이지를 만들어보자.
<br/><br/>

글 목록 페이지는 간단하게 아래 기능을 포함한다.<br/>
&nbsp;① 한 줄에 3개씩 게시글 표시<br/>
&nbsp;② 검색 기능<br/>
&nbsp;③ 전체 목록을 표시하는 버튼
&nbsp;④ 게시글을 클릭하면 상세 페이지로 이동
<br/><br/>

##### ① 한 줄에 3개씩 게시글을 표시하는 기능부터 구현해보자.<br/>

우리가 최종적으로 호스팅할 Github Pages에서는 게시물 정보를 DB에서 불러오는 구조로 구현할 수 없어,<br/>
DB를 대신할 여러가지 방법 중에서 JSON 파일에 데이터를 모델화하여 입력하고 불러오는 방식으로 구현해보자.
<br/><br/>

public/json/\_posts.json

```
[
  {
    "seq": 1,
    "fileName": "seq1.md",
    "title": "GitHub Pages Blog 만들기🔨 #1\n- 초기 설정",
    "date": "2024-06-24 11:25:13",
    "dateDiff": null
  },
  {
    "seq": 2,
    "fileName": "seq2.md",
    "title": "GitHub Pages Blog 만들기🔨 #2\n- 프로젝트 구성 및 초기 화면",
    "date": "2024-06-25 17:35:57",
    "dateDiff": null
  },
  {
    "seq": 3,
    "fileName": "seq3.md",
    "title": "GitHub Pages Blog 만들기🔨 #3\n- 초기 화면 상세",
    "date": "2024-06-25 18:05:23",
    "dateDiff": null
  },
    {
    "seq": 4,
    "fileName": "seq4.md",
    "title": "GitHub Pages Blog 만들기🔨 #4\n- vue-router 적용",
    "date": "2024-06-26 17:41:55",
    "dateDiff": null
  },
]

```

게시물 데이터는 순번, 파일명, 제목, 작성일, 그리고 조회하는 날짜 기준 얼마 전에 작성된 게시물인지 표시할 dateDiff로 구성했다.<br/>
dateDiff는 페이지를 불러올 때, script에서 현재 날짜 구해서 그 날짜를 기준으로 계산하여 표시할 예정이다.<br/>
다음으로는 게시물 목록을 표시할 화면을 작성해보자.<br/>

너무 길어서 하나씩 쪼개서 살펴보려고 한다.

<br/><br/>
src/components/LogList.vue - `<template>` 부분만

```
<template>
  <v-row class="category">
    <v-col cols="9">
      <v-chip prepend-icon="mdi-list-box-outline" link>전체보기</v-chip>
    </v-col>

    <v-col cols="3">
      <v-text-field
        variant="underlined"
        append-icon="mdi-magnify"
        placeholder="검색어 입력"
      ></v-text-field>
    </v-col>
  </v-row>

  <!-- 게시글 목록 표시 -->
  <v-row v-for="(i, idx) in rows" :key="i" class="loggingRow">
    <v-col
      v-for="post in displayPosts.filter((e, index) => {
        if (index >= idx * 3 && index < (idx + 1) * 3) return e;
      })"
      :key="post"
      cols="4"
    >
      <v-card class="post" link>
        <v-card-title class="postTitle">
          {{ post.title }}
        </v-card-title>

        <v-divider></v-divider>

        <div class="dateDiff">
          {{ post.dateDiff }}
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
```

화면에 게시글 목록을 표시하는 부분을 보면, v-for라는 함수를 사용한다.<br/>
vue에서 제공하는 반복문 함수로 1줄에 3개 씩 쪼개서 출력하고 있다.<br/>
여기서 displayPosts라는 변수는 `<script>` 태그에 명시한 데이터 변수로, 해당 변수의 값을 변경하면 화면도 동적으로 변경된다.<br/>
아래 변수 값을 설정하는 부분을 살펴보자.
<br/><br/>

src/components/LogList.vue - `<script>` + `<style>` 부분만

```
<script>
import posts from "/public/json/_posts.json"; // 게시글 json파일 import

export default {
  name: "loggingList",
  data() {
    return {
      displayPosts: null,
      rows: 0,
    };
  },
  created() {
    // vue 생성 시
    // ① data 기본 세팅
    this.displayPosts = this.getAllPosts(posts);
  },
  methods: {
    // 게시글 전체 가져오기
    getAllPosts(posts) {
      // json 파일 javascript 배열형태로 표시
      let tmpPostsList = JSON.parse(JSON.stringify(posts));

      // 작성일로부터의 날짜 차이 설정
      this.dateDiff(tmpPostsList);

      // seq 역순으로 정렬하여 return
      return tmpPostsList.sort(function (a, b) {
        return b.seq - a.seq;
      });
    },
    // dateDiff 설정
    dateDiff(posts) {
      let rst = "";

      for (var i in posts) {
        var dateParam = posts[i].date.substr(0, 10).split("-"); // date 값 년,월,일로 분할한 배열
        var timeParam = posts[i].date.substr(10).trim().split(":"); // date 값 시,분,초로 분할한 배열

        // milliseconds로 오늘과 작성일의 차이를 구함
        let diff =
          new Date().getTime() -
          new Date(
            dateParam[0],
            dateParam[1] - 1,
            dateParam[2],
            timeParam[0],
            timeParam[1],
            timeParam[2]
          ).getTime();

        // millisecond / 1000 => 초단위로 변경
        var t = Math.ceil(diff / 1000);

        if (t < 60) {
          // t가 60초 보다 작으면 n초 전
          rst = t + "초 전";
        } else if (t >= 60 && t < 60 * 60) {
          // t가 60초보다 크거나 같고 60분보다 작으면 n분 전
          rst = Math.ceil(t / 60) + "분 전";
        } else if (t >= 60 * 60 && t < 60 * 60 * 24) {
          // t가 60분보다 크거나 같고 24시간보다 작으면 n시간 전
          rst = Math.ceil(t / (60 * 60)) + "시간 전";
        } else if (t >= 60 * 60 * 24 && t < 60 * 60 * 24 * 30) {
          // t가 24시간보다 크거나 같고 30일보다 작으면 n일 전
          rst = Math.ceil(t / (60 * 60 * 24)) + "일 전";
        } else if (t >= 60 * 60 * 24 * 30 && t < 60 * 60 * 24 * 365) {
          // t가 30일보다 크거나 같고 365일보다 작으면 n개월 전
          rst = Math.ceil(t / (60 * 60 * 24 * 30)) + "개월 전";
        } else if (t >= 60 * 60 * 24 * 365) {
          // t가 365일보다 크거나 같으면 n년 전
          rst = Math.ceil(t / (60 * 60 * 24 * 365)) + "년 전";
        }

        // dateDiff에 값 설정
        posts[i].dateDiff = rst;
      }
    },
    // 랜덤 배경색 설정
    setPostBg() {
      let postTitle = document.querySelectorAll(".postTitle");
      for (var i = 0; i < postTitle.length; i++) {
        var rColor = Math.floor(Math.random() * 256);
        var gColor = Math.floor(Math.random() * 256);
        var bColor = Math.floor(Math.random() * 256);

        postTitle[i].style.backgroundColor =
          "rgb(" + rColor + "," + gColor + "," + bColor + ", 0.1)";
      }
    },
  },
  watch() {
    // data 값 변경 감지
    displayPosts(v) {
      // row 수 설정
      this.rows = Math.ceil(v.length / 3);
      // displayPosts 값 변경 시, 10ms 뒤에 setPostBg() 실행
      setTimeout(this.setPostBg, 10);
    }
  }
};
</script>

<style lang="scss">
.category {
  margin: 0.3rem;
}

.post:hover {
  top: -0.3em;
  box-shadow: 0.3em 0.3em 1em lightgray;
}
.v-card-title {
  display: flex !important;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: pre-wrap !important;
  height: 10em;
}

.keywords {
  padding: 0.3rem;
  height: 6em;

  .keyword {
    margin: 0.2rem;
  }
}

.dateDiff {
  padding: 10px 20px 10px 20px;
  text-align: right;
  font-style: italic;
  color: darkgrey;
}
</style>

```

쓰다보니 너무 복잡하다.. script 부분을 하나씩 떼어내서 살펴보자.🤦‍♂️
<br/><br/>

&nbsp;① data()<br/>
­ + 화면에서 사용할 동적으로 바인딩되는 데이터<br/>
­ + json 파일을 parsing하여 배열 형태의 게시글 전체 데이터와 3개씩 표시했을 때 row의 개수를 정의했다.<br/>
­ + 이 데이터를 template에서 v-for문으로 불러와 조건에 맞게 출력했다.<br/>
­­ + template에서 같은 vue파일 내 script 변수를 불러올 때는 변수명을 그대로 입력 (this.displayPosts (x) / displayPosts (o))
<br/><br/>

&nbsp;② created()<br/>
­­ + vue 파일이 로드되어 생성된 상태로 아직 html element가 생성되기 전이다.<br/>
­­ + data와 같이 element 요소 생성 전 미리 설정할 값을 이 부분에서 작업한다.<br/>
­­ + 아래 methods 에 정의한 메서드를 불러올 때는 this.메서드명으로 불러온다.
<br/><br/>

&nbsp;③ methods<br/>
­­ + 해당 vue에서 사용할 메서드들을 정의한다.
<br/><br/>

&nbsp;④ watch<br/>
­­ + data 변수 값 변경을 감지하는 부분이다.<br/>
­­ + data변수명() {//실행 로직} 형식으로 입력하면 자동으로 해당 data 변수 값 변경 때마다 실행된다.<br/>
­­ + 동적으로 displayPosts가 변경되어 화면에 뿌려지면, 10ms후에 random으로 배경색을 지정하도록 설정했다.
<br/><br/>

다음 포스트에서는 제목 검색 게시글을 검색하여 리스트를 변경하는 기능을 구현해보겠다.😎
