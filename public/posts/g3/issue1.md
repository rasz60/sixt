### vue-router 중복 경로 동적 설정

게시판 리스트 페이지와 다른 페이지를 아래와 같이 router로 지정해주었다.
<br/><br/>

`/board/notice` : 공지사항 게시판 리스트 화면<br/>
`/board/notice/:flag/:seq` : 공지사항 게시판 게시물 작성/상세/수정(flag) 화면<br/>

NoticeItemLayout 화면에서 flag가 form, edit일 때 작성화면을 <br/>
details일 때는 상세화면을 출력하도록 분기 처리하였으나
<br/><br/>

상세화면에서 목록보기 버튼을 눌러 `/board/notice`를 호출하면 작성 화면을 출력하는 오류가 발생했다.
<br/><br/>

### 🙆‍♂️ 해결

우선 궁극적인 문제는 `NoticeItemLayout.vue`에 작성 화면 v-if 조건문이 잘못되어 있었다.<br/>
flag 값이 'details'가 아닐 때로 분기하였기 때문에, flag와 seq가 null인 상태에서도 작성화면을 보여주고 있었다.
<br/><br/>

[AS-IS]

```
    <NoticeForm
      v-if="flag != 'details'"
      :flag="flag"
      :seq="seq"
      :items="items"
    />
```

[TO-BE]

```
    <NoticeForm
      v-if="flag == 'form' || flag == 'edit'"
      :flag="flag"
      :seq="seq"
      :items="items"
    />
```

<br/>

추가로 chatGPT에 문의하면서 알게된 사실은 지금처럼 `/board/notice`까지 중복되는 router를 지정할 때는,<br/>
router index.js 파일에 정의된 순서대로 찾아가기 때문에 조건이 더 많은 path를 우선적으로 작성해주는 것이 효율적이라고 한다.<br/>

[AS-IS]

```
    .
    .
    .

  {
    path: "/board/notice",
    name: "NoticeBoard",
    component: NoticeBoard,
  },
  {
    path: "/board/notice/:flag/:seq",
    name: "NoticeItemLayout",
    component: NoticeItemLayout,
  },

  .
  .
  .
```

[TO-BE]

```
    .
    .
    .

  {
    path: "/board/notice/:flag/:seq",
    name: "NoticeItemLayout",
    component: NoticeItemLayout,
  },
  {
    path: "/board/notice",
    name: "NoticeBoard",
    component: NoticeBoard,
  },

  .
  .
  .
```
