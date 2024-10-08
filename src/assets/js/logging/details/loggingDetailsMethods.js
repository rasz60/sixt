import htmlConverter from "@/utils/HTMLConverter";

export default {
  async setPost() {
    const g = this.$route.params.g;
    const p = this.$route.params.p;

    let displayPost = this.commonjs.getAllPosts().filter((e) => {
      if (e.seq == p && e.groupSeq == g) return e;
    })[0];
    this.post = displayPost;
    const post = await import(
      "/public/posts/" + this.post.serizes + "/" + this.post.fileName
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

  async movePost(rp) {
    console.log(rp);

    this.$router.push({
      name: "loggingDetails",
      params: { g: rp.groupSeq, p: rp.seq },
    });
  },
};
