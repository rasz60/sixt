<template>
  <v-slide-group show-arrows v-if="widthFlag">
    <v-slide-group-item v-for="p in displayPosts" :key="p">
      <v-card
        class="ma-3"
        :title="p.dpTitle"
        :style="`background-color:` + p.bgcolor"
        link
        @click="this.$router.push('/logging/' + p.seq)"
      ></v-card>
    </v-slide-group-item>
  </v-slide-group>
</template>

<script>
export default {
  props: {
    displayPosts: {
      type: Array,
      required: true,
    },
    widthFlag: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
