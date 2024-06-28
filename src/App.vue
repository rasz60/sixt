<script setup>
import MenuView from "@/views/MenuView.vue";
import ContentView from "@/views/ContentView.vue";
</script>

<template>
  <v-container id="container">
    <v-row id="main">
      <v-col sm="3" id="menu">
        <MenuView />
      </v-col>
      <v-col sm="9">
        <ContentView />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {
    MenuView,
    ContentView,
  },
  data() {
    return {
      target: null,
      scrollTop: 0,
      isScrollDown: false,
    };
  },
  mounted() {
    document.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      var scroll = document.scrollingElement.scrollTop;
      var target = document.querySelector("#menuSection");
      target.style.top = scroll + "px";
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/style/common.scss";

.v-container {
  padding-top: 3rem !important;
  min-height: 800px;

  #main {
    height: auto;
    padding: 0;
  }

  #menu {
    height: auto;
    padding-left: 1em;
    padding-right: 3em;
  }
}
</style>
