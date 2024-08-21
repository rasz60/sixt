<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";

const screendWidth = ref(window.innerWidth);
const postCnt = ref(0);

const updateScreenWidth = () => {
  screendWidth.value = window.innerWidth;

  if (screendWidth.value >= 1850) {
    postCnt.value = 3;
  } else if (screendWidth.value >= 1200) {
    postCnt.value = 2;
  } else {
    postCnt.value = 1;
  }
};
onMounted(() => {
  window.addEventListener("resize", updateScreenWidth);
  updateScreenWidth();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScreenWidth);
});
</script>

<template>
  <div id="contents">
    <RouterView :key="$route.fullPath" :cwidth="screendWidth" />
  </div>
</template>

<script>
export default {
  name: "contentSection",
};
</script>

<style lang="scss">
#contents {
  height: 100%;
}
</style>
