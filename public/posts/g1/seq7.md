### 게시글 목록 페이지 만들기

저번 포스트에서는 블로그 글 목록 페이지를 만들어보았다.<br/>
다음으로 목록 페이지에 부여하기로 했던 기능들을 순서대로 구현해보자.
<br/><br/>

&nbsp;① 한 줄에 3개씩 게시글 표시 - 완료<br/>
&nbsp;② 검색 기능<br/>
&nbsp;③ 전체 목록을 표시하는 버튼<br/>
&nbsp;④ 게시글을 클릭하면 상세 페이지로 이동
<br/><br/>

##### ② 게시글 검색, ③ 전체 목록 표시 기능 구현

현재 보고 있는 블로그에는 여러가지 항목 검색이 가능하지만, 여기서는 제목 검색 기능만 작성해보았다.<br/>
우선 검색어를 입력하는 input에 event를 부여하였고, input 입력 값을 동적으로 data 변수에 바인딩하도록 v-model을 설정했다.<br/>
그리고 전체보기 버튼을 클릭하면 다시 전체 게시글 목록을 불러오는 메서드를 바인딩했다.
<br/><br/>

src/components/LogList.vue

```
<template>
  <v-row class="category">
    <v-col cols="9">
      <v-chip prepend-icon="mdi-list-box-outline" link @click="fnSeeAll"
        >전체보기</v-chip
      >
    </v-col>

    <v-col cols="3">
      <v-text-field
        variant="underlined"
        v-model="searchKeyword" // v-model 설정
        append-icon="mdi-magnify"
        placeholder="검색어 입력"
        @click:append="fnSearchPosts" // click 이벤트
        @keyup="fnSearchPosts" // keyup 이벤트
      ></v-text-field>
    </v-col>
  </v-row>
  .
  .
  .
</template>
```

① v-model="데이터 변수명"<br/>
­­ + 해당 input의 값이 변경될 때마다, script data에 선언한 변수에 동적으로 바인딩된다.
<br/><br/>

② @이벤트="로직 or 메서드"<br/>
­­ + 해당 element에 지정한 이벤트가 발생했을 때, 호출할 로직을 설정한다.<br/>
­­ + click, keyup, keydown 등등 javascript에서 사용하던 event이름을 입력한다.<br/>
­­ + @click:append는 vuetify component를 사용하는 경우, append-icon에 이벤트 부여하는 방식이다.
<br/><br/>

다음으로는 v-model로 동적으로 바인딩될 data 변수 선언과 click, keyup 시 실행할 메서드를 작성했다.

src/components/LogList.vue

```
<script>
import posts from "/public/json/_posts.json";

export default {
  name: "loggingList",
  data() {
    return {
      displayPosts: null,
      rows: 0,
      searchKeyword: "", // data searchKeyword 추가
    };
  },
  .
  .
  .
  methods: {
    .
    .
    .
    // 검색 기능 메서드 추가
    fnSearchPosts(evt) {
      if (
        evt.keyCode == null || // 1. 검색 버튼 마우스 클릭
        (evt.keyCode != null && evt.keyCode == "13") // 2. 엔터입력
      ) {
        // 동적으로 변경되는 data 값 변수 선언
        var key = this.searchKeyword.trim();

        // 검색어 null 체크
        if (key == "") {
          alert("검색어를 입력해주세요.");
          return false;
        }

        // displayPosts 변경
        // 전체 포스트 get -> title에 key가 포함된 게시물만 조회
        this.displayPosts = this.getAllPosts(posts).filter(
          (post) => post.title.toUpperCase().indexOf(key.toUpperCase()) > -1
        );

        // rows 설정
        this.rows = this.displayPosts.length / 3;
      }
    },
  }
```

제목 검색과 전체 목록 보기 기능 구현에 필요한 설정이 완료되었고, 자세하게는 아래와 같이 동작한다.
<br/><br/>

① 검색 기능<br/>
&nbsp;⑴ 검색 input에 값을 입력하면 동적으로 searchKeyword에 바인딩<br/>
&nbsp;⑵ 검색 버튼 혹은 엔터를 입력했을 때, 검색 메서드 실행<br/>
&nbsp;⑶ 검색어를 입력하지 않으면 alert를 띄우고 return false<br/>
&nbsp;⑷ 검색어 입력 시, 검색어가 제목에 포함된 post를 조회하여 displayPosts 값 변경<br/>
&nbsp;⑸ displayPosts 변경된 값을 화면에 출력<br/>
&nbsp;⑹ watch에서 displayPosts 값 변경을 감지하여 전체 row수 설정<br/>
&nbsp;⑺ watch에서 10ms 후 setPostBg() 실행하여 랜덤으로 게시물 배경색 지정
<br/><br/>

② 전체 목록 보기 기능<br/>
&nbsp;⑴ 전체 보기 버튼 클릭 시 fnSeeAll() 메서드 실행<br/>
&nbsp;⑵ displayPosts 값을 전체 posts 값으로 변경<br/>
&nbsp;⑶ displayPosts 변경된 값을 화면에 출력<br/>
&nbsp;⑷ watch에서 displayPosts 값 변경을 감지하여 전체 row수 설정<br/>
&nbsp;⑸ watch에서 10ms 후 setPostBg() 실행하여 랜덤으로 게시물 배경색 지정
<br/><br/>

다음으로는 게시물 상세 내용을 확인하는 기능을 구현해보자.😎
