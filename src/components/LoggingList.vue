<template>
  <v-row class="loggingRow">
    <v-col
      v-for="post in posts"
      :key="post"
      cols="4"
      @click="this.$router.push('/logging/' + post.seq)"
    >
      <v-card class="post" link>
        <v-card-title class="postTitle">
          {{ post.title }}
        </v-card-title>

        <v-divider></v-divider>

        <div class="keywords">
          <v-chip
            v-for="keyword in post.keywords"
            :key="keyword"
            color="indigo"
            size="small"
            link
            class="keyword"
            >{{ keyword }}</v-chip
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

export default {
  data() {
    return {
      posts: posts,
    };
  },
  created() {
    this.posts = JSON.parse(posts);
  },
  mounted() {
    this.randomColor();
  },
  methods: {
    randomColor() {
      let postTitle = document.querySelectorAll(".postTitle");

      for (var i = 0; i < postTitle.length; i++) {
        const rColor = Math.floor(Math.random() * 128 + 64);
        const gColor = Math.floor(Math.random() * 128 + 64);
        const bColor = Math.floor(Math.random() * 128 + 64);

        postTitle[i].style.backgroundColor =
          "rgb(" + rColor + "," + gColor + "," + bColor + ", 0.1)";
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
