<script setup>
import htmlConverter from "@/utils/HTMLConverter";
</script>

<template>
  <div v-html="contents"></div>
</template>

<script>
export default {
  data() {
    return {
      contents: null,
    };
  },
  async created() {
    try {
      const param = this.$route.params.title;
      const post = await import("@/posts/" + param + ".md");
      this.contents = htmlConverter(post.default);
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
