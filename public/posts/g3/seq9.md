### 게시물 상세 조회 기능 구현하기 (2/2)

게시물 상세 조회를 위한 backend 단 구현이 완료되었다. 다음으로는 화면을 만들어보자.<br/>
먼저 게시물의 상세 정보를 출력할 화면을 작성해보자.
<br/><br/>

##### ① NoticeDetails.vue

/frontend/src/components/board/NoticeDetails.vue

```
<template>
  <!-- details -->
  <v-sheet id="details">
    <v-row>
      <v-col cols="10" id="itemTitle">
        <h2>{{ itemHeaderName }}&nbsp;{{ items.title }}</h2>
      </v-col>
      <v-col cols="2" class="info">
        <v-icon icon="mdi-eye-outline" size="small" />
        &nbsp;{{ items.itemHitsCnt }}

        &nbsp;&nbsp;

        <v-icon
          :icon="likeItem ? `mdi-heart` : `mdi-heart-outline`"
          :color="likeItem ? `red` : ``"
          size="small"
        />
        &nbsp;{{ itemLikes }}
      </v-col>
      <v-divider></v-divider>
    </v-row>

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="3" class="info">
        <v-icon icon="mdi-account" size="small" />
        {{ items.itemRegUuid.memId }}

        &nbsp;&nbsp;

        <v-icon icon="mdi-clock-outline" size="small" />
        {{ items.itemRegDate }}
      </v-col>
      <v-divider></v-divider>
    </v-row>

    <v-row>
      <v-col cols="12">
        <pre id="contents">{{ items.contents }}</pre>
      </v-col>
      <v-divider></v-divider>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-chip label class="mr-2" color="primary">
          Tags&nbsp;<v-icon icon="mdi-label" />
        </v-chip>
        <v-chip
          v-for="tag in items.hashtags"
          :key="tag"
          class="mr-1"
          color="success"
          variant="tonal"
        >
          <v-icon icon="mdi-pound" start></v-icon>
          {{ tag }}
        </v-chip>
      </v-col>
      <v-divider></v-divider>
    </v-row>

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="3" class="text-right">
        <v-btn
          prepend-icon="mdi-content-save-all"
          color="warning"
          v-if="items.eAuth"                    // 수정 권한 있을 때 보여지기
          variant="tonal"
          >수정하기</v-btn
        >
        <v-btn
          prepend-icon="mdi-close"
          color="red"
          v-if="items.dAuth"                    // 삭제 권한 있을 때 보여지기
          variant="tonal"
          >삭제하기</v-btn
        >
        <v-btn
          prepend-icon="mdi-format-list-bulleted-square"
          color="default"
          variant="tonal"
          @click="fnMove()"
          >목록으로</v-btn
        >
      </v-col>
      <v-divider></v-divider>
    </v-row>
  </v-sheet>
</template>

<script>
import NoticeDetailsDatas from "@/assets/js/board/details/NoticeDetailsDatas";
import NoticeDetailsMethods from "@/assets/js/board/details/NoticeDetailsMethods";

export default {
  props: {
    flag: {
      type: String,
      required: true,
    },
    seq: {
      type: String,
      required: true,
    },
    items: {
      type: Map,
      required: true,
    },
  },
  name: "NoticeDetails",
  data() {
    return NoticeDetailsDatas;
  },
  mounted() {
    this.itemHeaderName = this.items.itemHeaderName
      ? "[" + this.items.itemHeaderName + "]"
      : "";
    this.itemLikes = this.items.itemLikesCnt;
    this.likeItem = this.items.likeItem;
  },
  methods: NoticeDetailsMethods,
};
</script>
```

/frontend/src/assets/js/board/details/NoticeDetailsDatas.js

```
export default {
  itemHeaderName: "",
  likeItem: false,
  itemLikes: 0,
};
```

/frontend/src/assets/js/board/details/NoticeDetailsMethods.js

```
export default {
  fnMove(flag, seq) {
    var param = {
      flag: flag,
      seq: seq,
    };

    this.$emit("sendMessage", param);
  },
};
```

/frontend/src/assets/style/components/noticeDetails.scss

```
#details {
  .v-row {
    width: 95%;
    margin-left: 2em;
    margin-right: 2em;

    .v-col {
      margin: auto 0;

      #commentTo {
        margin-bottom: 0.4em;
      }

      .v-btn {
        margin: 0.2em;
      }

      #contents {
        min-height: 20em;
        font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
          Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo",
          "Noto Sans KR", "Malgun Gothic", sans-serif;
      }

      #commentDrop {
        font-size: 16px;
        width: 100%;
      }
    }

    #itemTitle {
      text-align: left;
    }

    .info {
      text-align: right;
    }
  }
  .comments {
    margin: 2em;
    cursor: pointer;

    .rdate {
      margin: 0.5em;
      font-size: 12px;
      color: darkgray;
    }
  }
  .comments:hover {
    background-color: aliceblue;
  }
  .depth-1 {
    padding-left: 0.5em;
  }

  .depth-2 {
    padding-left: 1em;
  }

  .depth-3 {
    padding-left: 1.5em;
  }

  .depth-4 {
    padding-left: 2em;
  }

  .depth-5 {
    padding-left: 2.5em;
  }
}
```

/frontend/src/assets/style/common.scss

```
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css");

$font-stack: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto,
  "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR",
  "Malgun Gothic", sans-serif;

$min-height: 85vh;

body {
  font-family: $font-stack;
}

@import "views/header";
@import "views/content";

@import "components/main";
@import "components/signup";
@import "components/settings";

@import "components/noticeList";
@import "components/noticeDetails.scss"; // 추가

```

<br/>

다음으로는 현재는 작성 화면만 import 되어있는 layout 화면에 상세 화면 분기처리를 추가해야한다.<br/>
flag가 details로 들어왔을 때, 해당 게시물의 상세 정보를 조회하여 import된 상세 화면으로 전달하여 출력하는 방식이다.
<br/><br/>

##### ② NoticeItemLayout.vue

/frontend/src/components/board/NoticeItemLayout.vue

```
<script setup>
import NoticeDetails from "./NoticeDetails.vue";            // 상세 화면 import 추가
import NoticeForm from "./NoticeForm.vue";
</script>

<template>
  <v-layout id="noticeLayout">
    <div id="title">
      <h1>NoTiCe</h1>
    </div>
    <NoticeDetails                                          // 상세 화면 import 추가
      v-if="flag == 'details' && items.itemUuid != ``"
      @sendMessage="fnSendMessage"
      :flag="flag"
      :seq="seq"
      :items="items"
    />
    <NoticeForm
      v-if="flag == 'form' || flag == 'edit'"
      :flag="flag"
      :seq="seq"
    />
  </v-layout>
</template>

<script>
import NoticeItemLayoutDatas from "@/assets/js/board/layout/NoticeItemLayoutDatas";
import NoticeItemLayoutMethods from "@/assets/js/board/layout/NoticeItemLayoutMethods";

export default {
  name: "NoticeItemLayout",
  components: {
    NoticeForm,
    NoticeDetails,
  },
  data: () => NoticeItemLayoutDatas,
  async created() {
    this.seq = this.$route.params.seq || "";
    this.flag = this.$route.params.flag || "";

    if (this.flag == "details") {               // 상세 화면일 때, 게시물 DB 조회 API 호출
      await this.getDetails();
    }
  },
  methods: NoticeItemLayoutMethods,
};
</script>

<style lang="scss">
#noticeLayout {
  display: block;
  width: 100%;

  div#title {
    border-left: 6px solid red;
    padding-left: 2em;
    margin-left: 1em;
    margin-top: 1em;
    margin-bottom: 1.5em;
  }
}
</style>

```

/frontend/src/assets/js/board/details/NoticeDetailsDatas.js

```
export default {
  flag: "",
  seq: "",
  readonly: false,
  items: {          // 게시물 상세 정보 model 추가
    itemUuid: "",
    title: "",
    keywords: "",
    contents: "",
    itemStatus: 0,
    itemHeader: "",
    itemHeaderName: "",
    itemKeywords: "",
    itemRegUuid: "",
    itemRegDate: "",
    itemLikesCnt: 0,
    itemHitsCnt: 0,
    likeItem: false,
    headers: [],
    hashtags: [],
  },
};

```

/frontend/src/assets/js/board/details/NoticeDetailsMethods.js

```
export default {
  fnSendMessage(v) {
    this.flag = v.flag || "";
    this.seq = v.seq || "";

    var param = this.flag ? "/" + this.flag : "";
    param += this.seq ? "/" + this.seq : "";

    var to = param != "" ? "/board/notice" + param : "/board/notice";

    this.$router.push(to);
  },

  async getDetails() {                      // 게시물 DB 조회 API 호출
    var seq = this.$route.params.seq;
    await this.axios
      .get("/rest/item/" + seq)
      .then((res) => {
        var rst = res.data;
        var resultCode = rst.resultCode;

        if (resultCode == 200) {
          var rstItem = rst.result.item;

          this.items.itemUuid = rstItem.itemUuid;
          if (rstItem.itemHeader != null)
            this.items.itemHeader = rstItem.itemHeader.itemHeaderId;
          this.items.itemHeaderName = rstItem.itemHeaderName;
          this.items.title = rstItem.itemTitle;
          this.items.contents = rstItem.itemContents;
          this.items.itemKeywords = rstItem.itemKeywords;
          if (this.items.itemKeywords) {
            this.items.hashtags = this.items.itemKeywords
              .substring(1)
              .split("#");
          }
          this.items.itemStatus = rstItem.itemStatus;
          this.items.itemLikesCnt = rstItem.itemLikesCnt;
          this.items.itemHitsCnt = rstItem.itemHitsCnt;
          this.items.itemCommentsCnt = rstItem.itemCommentsCnt;
          this.items.itemRegUuid = rstItem.itemRegUuid;
          this.items.itemRegDate = rstItem.itemRegDate.replace("T", " ");
          this.items.likeItem = rstItem.likeItem;
          this.items.eAuth = rstItem.eauth;
          this.items.dAuth = rstItem.dauth;
          this.items.cAuth = rstItem.cauth;
        } else {
          alert(rst.resultMessage);
          this.$router.push("/board/notice");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
```

이렇게 해서 상세 조회 화면까지 작성을 완료했다.<br/>
다음으로는 상세 조회 화면 하단 수정/삭제 버튼을 클릭했을 때의 동작을 구현해보자.😎
