<script setup>
import MenuSection from "@/components/MenuSection.vue";
import HomeView from "@/views/HomeView.vue";
</script>

<template>
  <v-container id="container">
    <v-row id="main">
      <v-col sm="3" id="menu">
        <MenuSection />
      </v-col>
      <v-col sm="9">
        <HomeView />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {
    MenuSection,
    HomeView,
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
  padding-top: 3rem;
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
