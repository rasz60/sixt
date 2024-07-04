<script setup></script>

<template>
  <v-sheet class="mx-auto" width="100%">
    <h2>최신 deVLOG&nbsp;<v-chip size="small" color="red">new</v-chip></h2>
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
    <v-divider></v-divider>
  </v-sheet>
  <v-sheet class="mx-auto" width="100%" v-for="g in groups" :key="g">
    <h2>
      {{ g.groupTitle }}&nbsp;<v-chip
        size="small"
        :color="g.proceeding ? `primary` : ``"
      >
        {{ g.proceeding ? `ing` : `done` }}
      </v-chip>
    </h2>
    <v-slide-group class="pa-4" show-arrows>
      <v-slide-group-item
        v-for="p in posts
          .filter((p) => p.groupSeq == g.groupSeq && p.type == 'dev')
          .reverse()"
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
    <v-divider></v-divider>
  </v-sheet>
</template>

<script>
export default {
  name: "mainPage",
  data() {
    return {
      posts: [],
      groups: [],
    };
  },
  created() {
    this.posts = this.commonjs.getAllPosts();
    this.groups = this.commonjs.getAllGroups();
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
