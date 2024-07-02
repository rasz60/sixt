<script setup></script>

<template>
  <v-sheet class="mx-auto" width="100%">
    <h2>간략 소개 🙋‍♂️</h2>
  </v-sheet>
  <v-divider></v-divider>
  <v-sheet class="mx-auto" width="100%">
    <h2>최신 LOG&nbsp;<v-chip size="small" color="red">new</v-chip></h2>
    <v-slide-group class="pa-5" show-arrows>
      <v-slide-group-item
        v-for="p in posts.filter((p, idx) => {
          if (idx < 5) return p;
        })"
        :key="p"
      >
        <v-card
          class="ma-3"
          :title="p.title"
          link
          @click="this.$router.push('/logging/' + p.seq)"
        ></v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
  <v-divider></v-divider>
  <v-sheet class="mx-auto" width="100%">
    <h2>
      현재 진행 중인 LOG&nbsp;<v-chip size="small" color="primary">ing</v-chip>
    </h2>
    <v-slide-group class="pa-4" show-arrows>
      <v-slide-group-item
        v-for="p in posts.filter((p) => {
          if (p.proceeding) return p;
        })"
        :key="p"
      >
        <v-card
          class="ma-3"
          :title="p.title"
          link
          @click="this.$router.push('/logging/' + p.seq)"
        ></v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
export default {
  name: "mainPage",
  data() {
    return {
      posts: [],
    };
  },
  created() {
    this.posts = this.commonjs.getAllPosts();
  },
  mounted() {
    this.setPostBg();
  },
  methods: {
    async setPostBg() {
      let postTitle = document.querySelectorAll(".v-card");

      for (var i = 0; i < postTitle.length; i++) {
        postTitle[i].style.backgroundColor =
          "rgb(" + this.commonjs.randomColor() + ", 0.1)";
      }
    },
  },
};
</script>

<style lang="scss">
.v-sheet {
  padding: 1rem;

  .v-card {
    width: 21.4rem;
  }
}
</style>
