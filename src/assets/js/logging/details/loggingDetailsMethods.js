import htmlConverter from "@/utils/HTMLConverter";

export default {
  async setPost() {
    const param = this.$route.params.seq;
    let displayPost = this.commonjs
      .getAllPosts()
      .filter((e) => e.seq == param)[0];
    this.post = displayPost;
    const post = await import("/public/posts/" + this.post.name + ".md");
    this.contents = htmlConverter(post.default);
  },
};
