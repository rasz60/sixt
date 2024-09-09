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

<br/>

NoticeLayout에서 flag가 form으로 들어왔을 때, 보여줄 작성 화면을 구성해보았다.<br/>
실제로는 작성과 수정을 동시에 수행할 화면이지만 먼저 작성 기능만 구현해보았다.
<br/><br/>

##### ② NoticeForm.vue

/frontend/src/components/board/NoticeForm.vue

```
<template>
  <!-- form -->
  <v-form id="form" ref="boardFrm">
    <v-row>
      <v-col cols="2">
        <v-select
          label="말머리"
          v-model="item.itemHeader"
          :items="headers"
          variant="underlined"
        ></v-select>
      </v-col>
      <v-col cols="10">
        <v-text-field
          type="text"
          label="제목"
          variant="underlined"
          v-model="item.title"
          :rules="titleRules"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          label="내용"
          rows="10"
          variant="outlined"
          v-model="item.contents"
          :rules="contentRules"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          variant="underlined"
          type="text"
          label="#tags"
          @keyup="fnAddTags"
          v-model="item.keywords"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row id="keywords">
      <v-col cols="12">
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="3" class="text-right">
        <v-btn
          prepend-icon="mdi-content-save-all-outline"
          color="secondary"
          v-if="item.itemStatus == 0"
          variant="tonal"
          @click="fnValidate(0)"
          >임시저장</v-btn
        >
        <v-btn
          prepend-icon="mdi-content-save-all"
          color="primary"
          variant="tonal"
          @click="fnValidate(1)"
          >저장하기</v-btn
        >
        <v-btn
          prepend-icon="mdi-format-list-bulleted-square"
          color="default"
          variant="tonal"
          @click="fnMove()"
          >목록으로</v-btn
        >
      </v-col>
    </v-row>
  </v-form>
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
  },
  name: "NoticeForm",
  data() {
    return NoticeBoardFormDatas;
  },
  async created() {
    await this.getHeaders();
  },
  computed: NoticeBoardFormComputed,
  methods: NoticeBoardFormMethods,
};
</script>

<style lang="scss" scoped>
#form {
  width: 100%;

  .v-row {
    width: 95%;
    margin-left: 2em;
    margin-right: 2em;

    .v-col {
      text-align: center;

      .v-btn {
        margin: 0.2em;
      }
    }
  }

  #keywords {
    margin-top: 0;
    overflow-x: auto;
    .v-col {
      text-align: left;
    }
  }

  .v-chip {
    margin: 0.2em;
  }
}
</style>
```

/frontend/src/assets/js/board/form/NoticeBoardFormDatas.js

```
export default {
  headers: [],
};

```

/frontend/src/assets/js/board/form/NoticeBoardFormMethods.js

```
import { mapActions } from "vuex";

export default {
  ...mapActions("common", ["nullChk"]),
  initValue() { // 값 초기화 메서드
    this.item.title = "";
    this.item.keywords = "";
    this.item.contents = "";
    this.item.itemStatus = 0;
    this.item.itemHeader = "";
    this.item.itemKeywords = "";
    this.item.hashtags = [];
  },
  async getHeaders() { // 사용 가능한 말머리 조회 API 호출
    await this.axios
      .get("/rest/itemHeaders")
      .then((res) => {
        var rst = res.data;
        var resultCode = rst.resultCode;
        if (resultCode == 200) {
          var data = rst.result.itemHeaders;
          for (var i = 0; i < data.length; i++) {
            this.headers[i] = {
              title: data[i].itemHeaderName,
              value: data[i].itemHeaderId,
            };
          }
        } else {
          alert(rst.resultMessage);
          if (resultCode > 400 && resultCode < 500) location.href = "/logout";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  fnMove(flag, seq) { // 버튼 클릭 시 페이지 이동
    var param = "";

    param += flag ? "/" + flag : "";
    param += seq ? "/" + seq : "";

    this.$router.push("/board/notice" + param);
  },
  fnAddTags($event) { // 해시태그 추가
    var k = $event.keyCode;
    console.log($event.keyCode);
    if (k == 13) {
      if (!this.fnKeywordChk()) {
        this.item.keywords = "";
        return false;
      }

      if (this.item.hashtags.length < 30) {
        this.item.itemKeywords += "#" + this.item.keywords.trim();
        this.item.keywords = "";
      } else {
        alert("해시태그를 30개 이상 등록할 수 없습니다.");
      }
    } else {
      return false;
    }
  },
  fnKeywordChk() { // 해시태그 키워드 validation
    var chk = true;
    var t = this.item.keywords.trim();

    if (t.includes("#")) {
      alert("해시태그는 '#'을 포함할 수 없습니다.");
      return false;
    }

    var bytes = this.getByteSize(this.item.itemKeywords + "#" + t);

    if (bytes > 1000) {
      alert("모든 해시태그를 합쳐 1000bytes를 초과할 수 없습니다.");
      return false;
    }

    if (t) {
      for (var i = 0; i < this.item.hashtags.length; i++) {
        if (this.item.hashtags[i] == t) {
          chk = false;
          break;
        }
      }
    } else {
      chk = false;
    }
    return chk;
  },
  getByteSize(str) { // 바이트 수 체크
    let byteSize = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code <= 0x7f) {
        byteSize += 1; // ASCII 문자 (1 바이트)
      } else if (code <= 0x7ff) {
        byteSize += 2; // 2 바이트
      } else if (code <= 0xffff) {
        byteSize += 3; // 3 바이트
      } else {
        byteSize += 4; // 4 바이트 (JavaScript에서 UTF-16 서러게이트 페어 사용)
      }
    }
    return byteSize;
  },
  fnTagDel(k) { // 해시태그 삭제
    var tmp = "";
    for (var i = 0; i < this.item.hashtags.length; i++) {
      if (this.item.hashtags[i] != k) {
        tmp += "#" + this.item.hashtags[i];
      }
    }
    this.item.itemKeywords = tmp;
  },
  async fnValidate(status) { // 저장 시 validation
    var chk = await this.$refs.boardFrm.validate();

    if (chk.valid) {
      var data = {
        itemUuid: this.item.itemUuid,
        itemTitle: this.item.title,
        itemHeaderId: this.item.itemHeader,
        itemStatus: status,
        itemKeywords: this.item.itemKeywords,
        itemContents: this.item.contents,
      };
      await this.axios({
        method: "post",
        url: "/rest/board/save",
        data: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          var resultCode = res.data.resultCode;
          alert(res.data.resultMessage);
          if (resultCode == 200) {
            this.initValue();
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

/frontend/src/assets/js/board/form/NoticeBoardFormComputed.js

```
import { mapGetters } from "vuex";

export default {
  ...mapGetters("common", ["getCommChk"]),
  titleRules() { // 제목 validation
    const rules = [];

    const notNulls = (v) => { // nullCheck
      this.nullChk(v);
      return this.getChk;
    };
    rules.push(notNulls);

    const byteChk = (v) => { // byteCheck
      if (this.getByteSize(v) <= 200) return true;
      else return "200 bytes를 초과할 수 없습니다.";
    };
    rules.push(byteChk);

    return rules;
  },
  contentRules() { // 내용 validation
    const rules = [];

    const notNulls = (v) => { // nullCheck
      this.nullChk(v);
      return this.getChk;
    };
    rules.push(notNulls);

    return rules;
  },
};
```

이렇게 해서 게시판 리스트에서 글을 작성하는 기능까지 완료되었다.<br/>
다음으로는 게시글 상세 페이지와 수정 기능을 구현해보겠다.😎
