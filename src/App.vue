<script setup>
import MenuView from "@/views/MenuView.vue";
import ContentView from "@/views/ContentView.vue";
</script>

<template>
  <v-container id="container">
    <v-row id="main">
      <v-col cols="3" id="menu">
        <MenuView />
      </v-col>
      <v-col cols="9">
        <ContentView />
      </v-col>
    </v-row>
    <v-btn
      v-show="scrolled"
      variant="tonal"
      icon="mdi-arrow-up"
      color="cyan"
      id="dial"
      @click="goTop"
    >
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "app",
  components: {
    MenuView,
    ContentView,
  },
  data() {
    return {
      scrolled: false,
    };
  },
  mounted() {
    document.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      var scroll = document.scrollingElement.scrollTop;

      this.scrolled = scroll > 0;

      var target1 = document.querySelector("#menuSection");

      if (target1 != null) {
        target1.style.top = scroll + "px";
      }

      var target2 = document.querySelector("#dial");
      if (target2 != null) {
        target2.style.marginTop = scroll > 0 ? "92vh" : "0";
        target2.style.top = scroll + "px";
      }
    },
    goTop() {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style lang="scss">
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

  #dial {
    position: absolute;
    right: 2.5rem;
    width: 2em;
    height: 2em;
    font-size: 1.3em;
    top: 0;
  }
}
</style>
