import htmlConverter from "@/utils/HTMLConverter";

export default {
  async setPost() {
    const param = this.$route.params.seq;
    let displayPost = this.commonjs
      .getAllPosts()
      .filter((e) => e.seq == param)[0];
    this.post = displayPost;
    const post = await import(
      "/public/posts/" + this.post.serizes + "/" + this.post.name + ".md"
    );
    this.contents = htmlConverter(post.default);
  },

  setRelatedPosts() {
    var serizes = this.post.serizes;
    var seq = this.post.seq;
    this.serizePosts = new Array();
    this.relatedPosts = new Array();

    this.commonjs.getAllPosts().filter((e) => {
      if (e.serizes == serizes && e.seq != seq) {
        if (e.type == "dev" && this.serizePosts.length < 5) {
          this.serizePosts.push(e);
        }

        if (e.type != "dev" && this.relatedPosts.length < 5) {
          this.relatedPosts.push(e);
        }
      }
    });
  },

  async movePost(seq) {
    this.$router.push({ name: "loggingDetails", params: { seq: seq } });
  },
};
