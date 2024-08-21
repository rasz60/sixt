<template>
  <v-window v-model="onboarding">
    <v-window-item v-for="p in displayPosts" :key="p">
      <v-card
        class="ma-3"
        :title="p.dpTitle"
        :style="`background-color:` + p.bgcolor"
        link
        @click="$router.push('/logging/' + p.seq)"
      ></v-card>
    </v-window-item>
  </v-window>

  <div class="justify-space-between">
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
  </div>
</template>
<script>
export default {
  props: {
    displayPosts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      onboarding: 0,
    };
  },
};
</script>
