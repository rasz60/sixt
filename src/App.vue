<script setup>
import MenuSection from "@/components/MenuSection.vue";
</script>

<template>
  <v-container>
    <MenuSection />
    <router-view />
  </v-container>
</template>

<script>
export default {
  components: {
    MenuSection,
  },
};
</script>

<style lang="scss">
@import "@/assets/style/common.scss";

#app {
  background-color: #1a1a1a;

  .v-container {
    height: 1000px;
  }
}
</style>
