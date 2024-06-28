<template>
  <div id="contents">
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ContentSection",
};
</script>

<style lang="scss">
#contents {
  height: 100%;
  padding-left: 10px;
}
</style>
