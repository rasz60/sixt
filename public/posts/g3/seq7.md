### 게시물 작성 기능 구현하기 (2/2)

게시물 작성을 위한 backend 단 구현이 완료되었다. 다음으로는 화면 구성을 해보자!<br/>
화면은 틀이되는 layout 파일에 작성/수정, 상세 화면을 import하여 구분 값에 따라 화면을 뿌리도록 구현하려고 한다.<br/>
아래 소스는 작성 화면만 import한 상태이다.
<br/><br/>

##### ① NoticeItemLayout.vue

/frontend/src/components/board/NoticeItemLayout.vue

```
<script setup>
import NoticeForm from "./NoticeForm.vue"; // 작성/수정 화면
</script>

<template>
  <v-layout id="noticeLayout">
    <div id="title">
      <h1>NoTiCe</h1>
    </div>
    <NoticeForm
      v-if="flag != 'details'"          // flag가 details이 아닐 때 작성/수정 화면 활성화
      :flag="flag"                      // 작성/수정 화면으로 전달할 파리미터 값
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
  },
  data: () => NoticeItemLayoutDatas,
  async created() {
    this.seq = this.$route.params.seq;
    this.flag = this.$route.params.flag;
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

/frontend/src/assets/js/board/layout/NoticeItemLayoutDatas.js

```
export default {
  flag: "",             // 작성 : form / 수정 : edit / 상세 : details
  seq: "",              // 작성 : 0 / 수정, 삭제 : 게시물 번호(seq)
  readonly: false,      // 작성/수정 : false / 상세 : true
};

```

/frontend/src/assets/js/board/layout/NoticeItemLayoutMethods.js

```
export default {
  fnSendMessage(v) {
    this.flag = v.flag;
    this.seq = v.seq;

    var param = this.flag ? "/" + this.flag : "";
    param += this.seq ? "/" + this.seq : "";

    this.$router.push("/board/notice" + param);
  },
};
```
