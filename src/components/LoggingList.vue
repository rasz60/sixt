<template>
  <v-row class="category">
    <v-col cols="9">
      <v-chip prepend-icon="mdi-list-box-outline" link @click="seeAll"
        >전체보기</v-chip
      >
      <v-chip
        class="category"
        v-for="category in categorys.filter((e) => e.type == 'status')"
        :key="category"
        :prepend-icon="
          this.commonjs.keywordPIcon(category.type, category.value)
        "
        :color="this.commonjs.keywordColor(category.type, category.value)"
        @click="setPosts(null, category.value)"
        link
        >{{ category.title }}</v-chip
      >
      <v-chip
        class="category"
        v-for="category in categorys.filter((e) => e.type != 'status')"
        :key="category"
        :prepend-icon="this.commonjs.keywordPIcon(category.type)"
        :color="this.commonjs.keywordColor(category.type)"
        link
        @click="setPosts(category.type, null)"
        >{{ category.value }}</v-chip
      >
    </v-col>

    <v-col cols="3">
      <v-text-field
        variant="underlined"
        append-icon="mdi-magnify"
        v-model="searchKeyword"
        @click:append="setPosts(undefined, undefined)"
      ></v-text-field>
    </v-col>
  </v-row>
  <v-row class="loggingRow">
    <v-col
      v-for="post in displayPosts"
      :key="post"
      cols="4"
      @click="this.$router.push('/logging/' + post.seq)"
    >
      <v-badge
        class="newPostsBadge"
        v-show="post.newPost"
        color="red"
        content="new"
      ></v-badge>
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
    </v-col>
  </v-row>
</template>

<script>
import posts from "@/utils/posts";
import datas from "@/assets/js/logging/list/loggingListDatas.js";
import methods from "@/assets/js/logging/list/loggingListMethods.js";

export default {
  data() {
    return datas;
  },
  created() {
    this.posts = JSON.parse(posts);
    this.displayPosts = this.posts;
  },
  mounted() {
    this.setPostBg();
  },
  methods: methods,
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#postsList {
  height: 100%;
  padding: 1.2rem;
}

.newPostsBadge {
  position: absolute;
  z-index: 1;
}

.category {
  margin: 0.3rem;
}

.post:hover {
  top: -0.3em;
  box-shadow: 0.3em 0.3em 1em lightgray;
}
.v-card-title {
  display: flex !important;
  align-items: center;
  text-align: center;
  white-space: pre-wrap !important;
  height: 10em;
}

.keywords {
  padding: 0.3rem;
  height: 6em;

  .keyword {
    margin: 0.2rem;
  }
}

.dateDiff {
  padding: 10px 20px 10px 20px;
  text-align: right;
  font-style: italic;
  color: darkgrey;
}
</style>
