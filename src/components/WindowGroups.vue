<template>
  <v-window v-model="onboarding" v-if="!widthFlag">
    <v-window-item v-for="p in displayPosts" :key="p">
      <v-card
        class="ma-3"
        :title="p.dpTitle"
        :style="`background-color:` + p.bgcolor"
        link
        @click="this.$router.push('/logging/' + p.seq)"
      ></v-card>
    </v-window-item>
  </v-window>

  <v-sheet-actions class="justify-space-between" v-if="!widthFlag">
    <v-item-group v-model="onboarding" class="text-center" mandatory>
      <v-item
        v-for="n in displayPosts.length"
        :key="`btn-${n}`"
        v-slot="{ isSelected, toggle }"
        :value="n - 1"
      >
        <v-btn
          class="slideBtn"
          size="sm"
          :variant="isSelected ? 'text' : 'plain'"
          icon="mdi-record"
          @click="toggle"
        ></v-btn>
      </v-item>
    </v-item-group>
  </v-sheet-actions>
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
  data() {
    return {
      onboarding: [],
    };
  },
};
</script>
