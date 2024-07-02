<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div id="contents">
    <RouterView :key="$route.fullPath" />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "contentSection",
};
</script>

<style lang="scss">
#contents {
  height: 100%;
  padding-left: 10px;
  padding-right: 2.2rem;
}
</style>
