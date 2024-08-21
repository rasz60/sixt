<script setup>
import SlideGroups from "@/components/SlideGroups.vue";
//import WindowGroups from "@/components/WindowGroups.vue";
</script>

<template>
  <v-sheet class="mx-auto" width="100%">
    <h4>
      최신 deVLOG&nbsp;<v-chip size="small" color="red" class="px-2"
        >new</v-chip
      >
    </h4>
    <!-- 1200px 이상 -->
    <SlideGroups
      :displayPosts="
        posts.filter((p, idx) => {
          if (idx < 10) return p;
        })
      "
      :widthFlag="widthFlag"
    />

    <!-- 1200px 이하 -->
    <!-- 작업 중
    <WindowGroups
      :displayPosts="
        posts.filter((p, idx) => {
          if (idx < 5) return p;
        })
      "
      :widthFlag="widthFlag"
      @sendMessage="fnSendBoarding"
    />
    -->
    <v-window v-model="onboarding[0]" v-if="!widthFlag">
      <v-window-item
        v-for="p in posts.filter((p, idx) => {
          if (idx < 5) return p;
        })"
        :key="p"
      >
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
      <v-item-group v-model="onboarding[0]" class="text-center" mandatory>
        <v-item
          v-for="n in posts.filter((p, idx) => {
            if (idx < 5) return p;
          }).length"
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

    <v-divider></v-divider>
  </v-sheet>
  <v-sheet class="mx-auto" width="100%" v-for="(g, idx) in groups" :key="g">
    <h4>
      {{ g.groupTitle }}&nbsp;
      <v-chip size="small" :color="g.proceeding ? `primary` : ``" class="px-2">
        {{ g.proceeding ? `ing` : `done` }}
      </v-chip>
    </h4>
    <!-- 1200px 이상 -->
    <SlideGroups
      :displayPosts="
        posts
          .filter((p) => p.groupSeq == g.groupSeq && p.type == 'dev')
          .reverse()
      "
      :widthFlag="widthFlag"
    />
    <!-- 1200px 이하 -->
    <v-window v-model="onboarding[idx + 1]" v-if="!widthFlag">
      <v-window-item
        v-for="p in posts
          .filter((p) => p.groupSeq == g.groupSeq && p.type == 'dev')
          .reverse()"
        :key="p"
      >
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
      <v-item-group v-model="onboarding[idx + 1]" class="text-center" mandatory>
        <v-item
          v-for="n in posts
            .filter((p) => p.groupSeq == g.groupSeq && p.type == 'dev')
            .reverse().length"
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
    <v-divider></v-divider>
  </v-sheet>
</template>

<script>
export default {
  name: "mainPage",
  props: {
    cwidth: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      onboarding: [],
      posts: [],
      groups: [],
      widthFlag: true,
    };
  },
  async created() {
    this.onboarding[0] = 0;
    this.posts = await this.commonjs.getAllPosts();
    this.groups = await this.commonjs.getAllGroups();

    for (var i = 0; i < this.groups.length; i++) {
      this.onboarding[i + 1] = 0;
    }

    this.widthFlag = this.cwidth >= 1200;
  },
  methods: {
    fnSendBoarding(v) {
      this.onboarding[v.index] = v.value;
    },
  },
  watch: {
    cwidth(v) {
      this.widthFlag = v >= 1200;
    },
  },
};
</script>

<style lang="scss">
.v-sheet {
  padding: 1rem;

  .v-slide-group__content {
    justify-content: flex-start;
  }
  .v-card {
    width: 20rem;
  }

  .v-window-item {
    display: flex;
    justify-content: center;

    .v-card {
      width: 100%;
    }
  }

  .slideBtn {
    font-size: 10px;
  }
}
</style>
