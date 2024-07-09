<template>
  <v-row id="listTop">
    <v-col cols="8" id="categorys">
      <v-chip prepend-icon="mdi-list-box-outline" link @click="seeAll"
        >전체보기</v-chip
      >
      <v-chip
        class="category"
        v-for="category in categorys"
        :key="category"
        :prepend-icon="
          this.commonjs.keywordPIcon(category.type, category.value)
        "
        :color="this.commonjs.keywordColor(category.type, category.value)"
        link
        @click="setPosts(category.type, category.value)"
        >{{ category.title }}</v-chip
      >
    </v-col>

    <v-col cols="3">
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
    <v-col cols="1" id="listType">
      <v-btn
        :icon="listTypeIcon"
        @click="fnListType"
        variant="tonal"
        color="lime-lighten-1"
      ></v-btn>
    </v-col>
  </v-row>
  <v-row v-for="(row, i) in rows" :key="row" class="loggingRow">
    <v-col
      v-for="post in displayPosts.filter((p, idx) => {
        if (idx >= i * 3 && idx < (i + 1) * 3) return p;
      })"
      :key="post"
      cols="4"
    >
      <v-badge
        class="newPostsBadge"
        v-show="post.newPost"
        color="red"
        content="new"
      ></v-badge>
      <router-link :to="'/logging/' + post.seq" class="postLink">
        <v-card class="post" link>
          <v-card-title class="postTitle">
            {{ post.title }}
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

          <div class="dateDiff">
            {{ post.dateDiff }}
          </div>
        </v-card>
      </router-link>
    </v-col>
  </v-row>
</template>

<script>
import datas from "@/assets/js/logging/list/loggingListDatas.js";
import methods from "@/assets/js/logging/list/loggingListMethods.js";

export default {
  name: "loggingList",
  data() {
    return datas;
  },
  created() {
    this.posts = this.commonjs.getAllPosts();
    this.displayPosts = this.posts;
  },
  mounted() {
    setTimeout(this.setPostBg, 50);
  },
  methods: methods,
  watch: {
    displayPosts() {
      this.rows = Math.ceil(this.posts.length / 3);
      setTimeout(this.setPostBg, 50);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "@/assets/style/loggingList.scss";
</style>
