### 게시판 리스트 구현하기 (2/2)

앞선 포스트에서 저장 상태로 있는 게시물 리스트를 불러오는 API 등록을 완료했다.<br/>
이번에는 결과를 출력해줄 화면을 구성해보자.<br/>

화면은 간단하게 구성했고, 해당 게시물 정보가 출력된 row를 클릭하면 상세 페이지로,<br/>
하단에 '작성' 버튼 클릭 시 작성 페이지로 이동하도록 했다.
<br/><br/>

/frontend/src/components/board/NoticeBoard.vue

```
<template>
  <v-layout>
    <div id="board">
      <div id="title">
        <h1>NoTiCe</h1>
      </div>
      <v-row class="title">
        <v-col cols="1">
          <v-card>#</v-card>
        </v-col>
        <v-col cols="1">
          <v-card>말머리</v-card>
        </v-col>
        <v-col cols="5">
          <v-card>제목</v-card>
        </v-col>
        <v-col cols="1">
          <v-card>작성자</v-card>
        </v-col>
        <v-col cols="2">
          <v-card>작성일자</v-card>
        </v-col>
        <v-col cols="1">
          <v-card>조회수</v-card>
        </v-col>
        <v-col cols="1">
          <v-card>좋아요</v-card>
        </v-col>
      </v-row>

      <!-- 조회된 게시물이 있을 때 -->
      <v-row
        v-for="item in list"
        :key="item"
        v-show="!notContents"
        class="items"
        @click="fnMove(item.itemSeq)"
      >
        <v-col cols="1">{{ item.itemSeq }}</v-col>
        <v-col cols="1">{{ item.itemHeaderName }}</v-col>
        <v-col cols="5" class="itemTitle">
          <span> {{ item.itemTitle }} ({{ item.itemCommentsCnt }}) </span>
        </v-col>
        <v-col cols="1"> {{ item.itemRegUuid.memId }} </v-col>
        <v-col cols="2"> {{ item.itemRegDate.replace("T", " ") }} </v-col>
        <v-col cols="1"> {{ item.itemHitsCnt }} </v-col>
        <v-col cols="1"> {{ item.itemLikesCnt }} </v-col>
      </v-row>

      <!-- 조회된 게시물이 없을 때 -->
      <v-row class="items" v-show="notContents">
        <v-col cols="12">게시물을 찾을 수 없습니다.</v-col>
      </v-row>

      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="10">
          <div class="text-center">
            <!-- vuetify pagenation component -->
            <v-pagination
              v-model="page"
              :length="totalPages"
              total-visible="6"
              @click="getBoardList"
              next-icon="mdi-menu-right"
              prev-icon="mdi-menu-left"
            ></v-pagination>
          </div>
        </v-col>
        <v-col cols="1">
          <v-btn
            prepend-icon="mdi-plus-box-multiple-outline"
            color="primary"
            variant="tonal"
            @click="fnMove()"
          >
            작성
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-layout>
</template>

<script>
import NoticeBoardMethods from "@/assets/js/board/NoticeBoardMethods.js";
import NoticeBoardDatas from "@/assets/js/board/NoticeBoardDatas.js";
export default {
  name: "NoticeBoard",
  data() {
    return NoticeBoardDatas;
  },
  async created() {
    await this.getBoardList();
  },
  methods: NoticeBoardMethods,
};
</script>
```

<br/>

/frontend/src/assets/js/board/NoticeBoardDatas.js

```
export default {
  itemStatus: 1,
  list: [],
  notContents: false,
  totalPages: 0,
  page: 0,
  limit: 10,
};

```

<br/>

/frontend/src/assets/js/board/NoticeBoardMethods.js

```
export default {
  async getBoardList() {
    var pg = this.page != 0 ? this.page - 1 : 0; // 페이지, server로 보낼 때는 페이지 - 1 로 인덱스 전달
    var url =
      "/rest/boardList/" + this.itemStatus + "/" + pg + "/" + this.limit;
    await this.axios
      .get(url)
      .then((res) => {
        var rst = res.data;
        var resultCode = rst.resultCode;

        if (resultCode == 200) { // 정상 수행
          var rstList = rst.result.boardList; // 페이지 정보 포함 결과 값
          this.list = rstList.content; // DB 조회 결과 값

          if (rstList.content.length > 0) { // 결과가 있을 때
            this.page = rstList.pageable.pageNumber + 1;
            this.totalPages = rstList.totalPages;
            this.notContents = false;
          } else { // 결과가 없을 때
            this.page = 1;
            this.totalPages = 1;
            this.notContents = true;
          }
        } else { // server 에러
          alert(rst.resultMessage);
        }
      })
      .catch((err) => { // http 에러
        console.log(err);
      });
  },
  fnMove(itemSeq) { // itemSeq가 있으면 게시물 상세, 아니면 작성 폼으로 이동
    var path = itemSeq != null ? "details/" + itemSeq : "from/0";
    this.$router.push("./notice/" + path);
  },
};

```

다음으로는 게시물 작성 기능을 구현해보겠다.😎
