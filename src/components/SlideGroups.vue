<template>
  <v-slide-group show-arrows>
    <v-slide-group-item v-for="p in displayPosts" :key="p">
      <v-card
        class="ma-3"
        :title="p.dpTitle"
        :style="`background-color:` + p.bgcolor"
        link
        @click="$router.push('/logging/' + p.groupSeq + '/' + p.seq)"
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
  },
};
</script>
