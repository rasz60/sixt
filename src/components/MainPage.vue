<script setup>
import SlideGroups from "@/components/SlideGroups.vue";
import WindowGroups from "@/components/WindowGroups.vue";
</script>

<template>
  <!--
  <v-sheet class="mx-auto" width="100%">
    <h4>devsixt's CODE-Level🧐</h4>
    <v-row class="py-10">
      <v-col cols="2" class="d-flex justify-center align-center">
        <p>Lv.0</p>
      </v-col>
      <v-col cols="2" class="d-flex justify-center align-center">
        <p>Lv.1</p>
      </v-col>
      <v-col cols="2" class="d-flex justify-center align-center">
        <p>Lv.2</p>
      </v-col>
      <v-col cols="2" class="d-flex justify-center align-center">
        <p>Lv.3</p>
      </v-col>
      <v-col cols="2" class="d-flex justify-center align-center">
        <p>Lv.4</p>
      </v-col>
      <v-col cols="2" class="d-flex justify-center align-center">
        <p>Lv.5</p>
      </v-col>
    </v-row>
  </v-sheet>
  <v-divider></v-divider>
  -->
  <v-sheet class="mx-auto" width="100%">
    <h4>
      최신 deVLOG&nbsp;<v-chip size="small" color="red" class="px-2"
        >new</v-chip
      >
    </h4>
    <!-- 1200px 이상 -->
    <SlideGroups :displayPosts="fnRecentPosts()" v-if="widthFlag" />

    <!-- 1200px 이하 -->
    <WindowGroups :displayPosts="fnRecentPosts()" v-if="!widthFlag" />
    <v-divider></v-divider>
  </v-sheet>
  <v-sheet class="mx-auto" width="100%" v-for="g in groups" :key="g">
    <h4>
      {{ g.groupTitle }}&nbsp;
      <v-chip size="small" :color="g.proceeding ? `primary` : ``" class="px-2">
        {{ g.proceeding ? `ing` : `done` }}
      </v-chip>
    </h4>
    <!-- 1200px 이상 -->
    <SlideGroups :displayPosts="fnGroupPosts(g.groupSeq)" v-if="widthFlag" />
    <!-- 1200px 이하 -->
    <WindowGroups :displayPosts="fnGroupPosts(g.groupSeq)" v-if="!widthFlag" />
    <v-divider></v-divider>
  </v-sheet>
</template>

<script>
export default {
  name: "mainPage",
  props: {
    cwidth: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      posts: [],
      groups: [],
      widthFlag: true,
      lv: {
        0: "Lv.0",
        1: "Lv.1",
        2: "Lv.2",
        3: "Lv.3",
        4: "Lv.4",
        5: "Lv.5",
      },
      icons: ["mdi-leaf", "", "", "", "", "mdi-fire"],
    };
  },
  async created() {
    this.posts = await this.commonjs.getAllPosts();
    this.groups = await this.commonjs.getAllGroups();
    this.widthFlag = this.cwidth >= 1200;
  },
  methods: {
    fnRecentPosts() {
      return this.posts.filter((p, idx) => {
        if (idx < 10) return p;
      });
    },
    fnGroupPosts(groupSeq) {
      return this.posts
        .filter((p) => p.groupSeq == groupSeq && p.type == "dev")
        .reverse();
    },
    season(val) {
      return this.icons[val];
    },
  },
  watch: {
    cwidth(v) {
      this.widthFlag = v >= 1200;
    },
  },
};
</script>

<style scoped lang="scss">
.shadow-n {
  box-shadow: none !important;
}
</style>
