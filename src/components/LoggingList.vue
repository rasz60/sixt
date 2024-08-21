<template>
  <v-row id="listTop">
    <v-col :cols="postCnt == 1 ? 12 : 9" id="categorys">
      <v-chip
        :prepend-icon="postCnt > 1 ? `mdi-list-box-outline` : null"
        link
        @click="seeAll"
        >전체보기</v-chip
      >
      <v-chip
        class="category"
        v-for="category in categorys"
        :key="category"
        :prepend-icon="postCnt > 1 ? category.icon : null"
        :color="category.color"
        link
        @click="setPosts(category.type, category.value)"
        >{{ category.title }}</v-chip
      >
    </v-col>

    <v-col :cols="postCnt == 1 ? 12 : 3">
      <v-text-field
        variant="underlined"
        append-icon="mdi-magnify"
        v-model="searchKeyword"
        @click:append="setPosts"
        @keyup="searchKeyup"
        placeholder="검색어 입력"
        hide-details
      ></v-text-field>
    </v-col>
  </v-row>
  <!-- 그룹형 -->
  <v-row v-for="g in displayGroups" :key="g" :class="`group g` + g.groupSeq">
    <v-col cols="12" class="groupTitle">
      <h2>{{ g.groupTitle }}</h2>
    </v-col>
    <v-divider></v-divider>
    <v-col
      cols="12"
      v-for="(row, i) in Math.ceil(
        displayPosts.filter((dp) => dp.groupSeq == g.groupSeq).length / postCnt
      )"
      :key="row"
      class="loggingRow"
    >
      <v-row>
        <v-col
          v-for="post in displayPosts
            .filter((dp) => dp.groupSeq == g.groupSeq)
            .filter((p, idx) => {
              if (idx >= i * postCnt && idx < (i + 1) * postCnt) return p;
            })"
          :key="post"
          :cols="12 / postCnt"
        >
          <v-badge
            class="newPostsBadge"
            v-show="post.newPost"
            color="red"
            content="new"
          ></v-badge>
          <router-link :to="'/logging/' + post.seq" class="postLink">
            <v-card class="post" link>
              <v-card-title
                class="postTitle"
                :style="`background-color: ` + post.bgcolor"
              >
                {{ post.dpTitle }}
              </v-card-title>

              <v-divider></v-divider>

              <div class="keywords">
                <v-chip
                  v-for="keyword in post.keywords"
                  :key="keyword"
                  :prepend-icon="this.commonjs.keywordPIcon(keyword.type)"
                  :color="this.commonjs.keywordColor(keyword.type)"
                  size="small"
                  link
                  class="keyword"
                  >{{ keyword.value }}</v-chip
                >
              </div>

              <div class="lastRow">
                <v-row>
                  <v-col cols="12" class="dateDiff">
                    {{ post.dateDiff }}
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import datas from "@/assets/js/logging/list/loggingListDatas.js";
import methods from "@/assets/js/logging/list/loggingListMethods.js";
import { ref, onMounted, onBeforeUnmount } from "vue";
export default {
  name: "loggingList",
  data() {
    return datas;
  },
  async created() {
    this.groups = this.commonjs.getAllGroups().reverse();
    this.displayGroups = this.groups;
    this.posts = this.commonjs.getAllPosts().reverse();
    this.displayPosts = this.posts;

    for (var i = 0; i < this.categorys.length; i++) {
      var t = this.categorys[i].type;
      var v = this.categorys[i].value;

      this.categorys[i].icon = this.commonjs.keywordPIcon(t, v);
      this.categorys[i].color = this.commonjs.keywordColor(t, v);
    }
    this.updateScreenWidth();
  },
  setup() {
    const screendWidth = ref(window.innerWidth);
    const postCnt = ref(0);

    const updateScreenWidth = () => {
      screendWidth.value = window.innerWidth;

      if (screendWidth.value >= 1850) {
        postCnt.value = 3;
      } else if (screendWidth.value >= 1200) {
        postCnt.value = 2;
      } else {
        postCnt.value = 1;
      }
    };
    onMounted(() => {
      window.addEventListener("resize", updateScreenWidth);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScreenWidth);
    });

    return {
      screendWidth,
      postCnt,
      updateScreenWidth,
    };
  },
  methods: methods,
  watch: {
    displayPosts() {
      this.rows = Math.ceil(this.posts.length / 3);
    },
    listType(v) {
      if (v == 1) {
        this.groups = this.commonjs.getAllGroups();
        this.displayGroups = this.groups;
        this.displayPosts = this.commonjs.getAllPosts().reverse();
      } else {
        this.seeAll();
      }
    },
    screendWidth(v) {
      if (v >= 1850) {
        this.postCnt = 3;
      } else if (v >= 1200) {
        this.postCnt = 2;
      } else {
        this.postCnt = 1;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/assets/style/loggingList.scss";
.group {
  margin-top: 2rem !important;

  .groupTitle {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    @media (width <= 800) {
      h2 {
        font-size: 14px !important;
      }
    }
  }

  hr {
    margin-bottom: 1em;
  }
}
</style>
