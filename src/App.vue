<script setup>
import MenuSection from "@/components/MenuSection.vue";
import HomeView from "@/views/HomeView.vue";
</script>

<template>
  <v-container>
    <v-row id="main">
      <v-col sm="3">
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
};
</script>

<style lang="scss">
@import "@/assets/style/common.scss";

#app {
  .v-container {
    padding-top: 3rem;
    height: 1000px;
    min-height: 800px;
  }
  #main {
    height: 100%;
    padding: 0;
  }
}
</style>
