
<template>
  <div class="hello">
    <div v-for="post in posts" :key="post">
      <a :href="post.name">
        {{ post.title }}
        {{ post.date }}
        {{ post.description }}
      </a>
      <ul>
        <li
          v-for="keyword in post.keywords"
          :key="keyword"
        >
          {{ keyword }}
        </li>
      </ul>
    </div>
  </div>
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
