### 게시물 수정/삭제 기능 구현하기 (2/2)

게시물 수정/삭제를 위해서 호출할 back단 소스를 완성하였다. 이제 API를 호출할 화면을 구현해보자.<br/>
추가되는 화면은 없고, 기존 작성 화면에 flag가 edit일 때의 몇 가지만 추가해준다.
<br/><br/>

##### ① NoticeItemLayout.vue

/frontend/src/components/board/NoticeItemLayout.vue

```
<script setup>
import NoticeDetails from "./NoticeDetails.vue";
import NoticeForm from "./NoticeForm.vue";
</script>

<template>
  <v-layout id="noticeLayout">
    .
    .
    .
    <NoticeForm
      v-if="flag == 'form' || flag == 'edit'"
      :flag="flag"
      :seq="seq"
      :items="items"            // 게시물 정보 props 추가
    />
  </v-layout>
</template>

<script>
import NoticeItemLayoutDatas from "@/assets/js/board/layout/NoticeItemLayoutDatas";
import NoticeItemLayoutMethods from "@/assets/js/board/layout/NoticeItemLayoutMethods";

export default {
  .
  .
  .

  watch: {                      // flag가 edit으로 변하면 상세 정보 조회 호출
    async flag(v) {
      if (v == "edit") {
        await this.getDetails();
      }
    },
  },
};
</script>

```

##### ② NoticeForm.vue

/frontend/src/components/board/NoticeForm.vue

```
<template>

  .
  .
  .

</template>

<script>
import NoticeBoardFormDatas from "@/assets/js/board/form/NoticeBoardFormDatas";
import NoticeBoardFormComputed from "@/assets/js/board/form/NoticeBoardFormComputed";
import NoticeBoardFormMethods from "@/assets/js/board/form/NoticeBoardFormMethods";

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
    items: {                        // 부모 component에서 보내주는 게시물 정보
      type: Map,
      required: true,
    },
  },
  name: "NoticeForm",
  data() {
    return NoticeBoardFormDatas;
  },
  async created() {
    await this.getHeaders();
    this.item = this.items;         // 부모 component가 보내준 게시물 정보 저장, 직접 변경할 수 있도록 자체 변수 처리
  },
  computed: NoticeBoardFormComputed,
  methods: NoticeBoardFormMethods,
  watch: {                          // 저장된 해시태그 뿌려주기
    "item.itemKeywords"(v) {
      if (v) this.item.hashtags = v.substring(1).split("#");
      else this.item.hashtags = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.
.
.
</style>
```

/frontend/src/assets/js/board/form/NoticeBoardFormDatas.js

```
export default {
  item: {                   // 부모 component가 보내준 게시물 정보 저장, 직접 변경할 수 있도록 자체 변수 처리
    itemUuid: "",
    title: "",
    keywords: "",
    contents: "",
    itemStatus: 0,
    itemHeader: "",
    itemHeaderName: "",
    itemKeywords: "",
    itemLikesCnt: 0,
    itemHitsCnt: 0,
    hashtags: [],
  },
  headers: [],
};
```

##### ③ NoticeDetails.vue

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
  async fnItemDel() {                           // 게시물 삭제 메서드 추가
    if (confirm("게시물을 삭제할까요?")) {
      var data = {
        itemUuid: this.items.itemUuid,
      };

      await this.axios({
        method: "put", // HTTP 메서드
        url: "/rest/delItem", // 요청할 URL
        data: data, // 전송할 데이터
        headers: {
          Accept: "application/json", // 서버로부터 JSON 응답을 기대
          "Content-Type": "application/json", // 요청의 콘텐츠 타입을 JSON으로 설정
        },
      })
        .then((res) => {
          var rst = res.data;
          alert(rst.resultMessage);
          if (rst.resultCode != "500") {
            this.$router.push("/board/notice");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
```

게시물 수정/삭제 기능 구현이 완료되었다. 이번엔 좋아요, 댓글 기능을 구현해보려고 한다.😎
