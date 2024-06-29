<template>
  <v-card id="details">
    <v-card-title id="detailsTitle">
      {{ post.title }}
    </v-card-title>

    <span id="subTitle">{{ post.date }} ({{ post.dateDiff }})</span>
    <div id="keywords">
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
    <div id="btnBox">
      <v-btn
        size="small"
        prepend-icon="mdi-format-list-bulleted"
        @click="this.$router.push('/logging')"
        color="secondary"
        >go to list</v-btn
      >
    </div>
    <v-divider></v-divider>
    <div id="doc" v-html="contents"></div>
    <v-divider></v-divider>
    <v-row id="relatedPosts">
      <v-col cols="6">
        <v-list>
          <v-list-item class="relatedPostTitle"
            >다른 시리즈 게시물 보기</v-list-item
          >
          <v-list-item
            class="relatedPostList"
            link
            v-for="serizePost in serizePosts"
            :key="serizePost"
            @click="movePost(serizePost.seq)"
          >
            {{ serizePost.title }}
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="6">
        <v-list>
          <v-list-item class="relatedPostTitle">관련 게시물 보기</v-list-item>
          <v-list-item
            class="relatedPostList"
            link
            v-for="relatedPost in relatedPosts"
            :key="relatedPost"
            @click="movePost(relatedPost.seq)"
          >
            {{ relatedPost.title }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import datas from "@/assets/js/logging/details/loggingDetailsDatas.js";
import methods from "@/assets/js/logging/details/loggingDetailsMethods.js";

export default {
  name: "LoggingDetails",
  data() {
    return datas;
  },
  created() {
    this.setPost();
  },
  mounted() {
    this.setRelatedPosts();
  },
  methods: methods,
};
</script>

<style lang="scss">
@import "@/assets/style/loggingDetails.scss";
@import "@/assets/style/markdownDoc.scss";

#btnBox {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}

#relatedPosts {
  padding-left: 20px;
  padding-right: 20px;

  .relatedPostTitle {
    padding: 0.4rem 0 0.4rem 0;
  }

  .relatedPostList {
    padding-left: 0.4rem;
    min-height: 2rem;

    color: darkgray;
    text-decoration: underline;
  }
}
</style>
