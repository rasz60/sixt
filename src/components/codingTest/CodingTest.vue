<template>
  <v-row id="listTop">
    <v-col :cols="12" id="categorys">
      <v-chip
        v-for="i in 6"
        :key="i"
        class="ma-1"
        @click="fnGetLvTests(i - 1)"
        :color="dpLv != i - 1 ? `default` : `purple`"
      >
        Lv.{{ i - 1 }}
      </v-chip>
    </v-col>
  </v-row>

  <v-divider class="my-5" />

  <v-card class="pa-3 mb-5" v-for="t in dptest" :key="t" v-show="!ndp">
    <h2 class="question" @click="t.fold = !t.fold">
      <v-chip color="secondary" :text="`Lv.` + t.level" size="small" />&nbsp;Q{{
        t.seq
      }}.&nbsp;{{ t.question }}
    </h2>
    <v-divider class="my-3" />
    <v-sheet class="answer" v-show="!t.fold">
      <v-row v-for="a in t.answer" :key="a">
        <v-col cols="12">
          <h4 class="ma-2">A{{ a.seq }}. {{ a.title }}</h4>
          <pre class="pa-4">{{ a.code }}</pre>
        </v-col>
      </v-row>
    </v-sheet>
  </v-card>
  <h3 v-show="ndp == null" class="text-center">레벨을 선택해주세요.</h3>
  <h3 v-show="ndp" class="text-center">아직 미지의 영역입니다.😊</h3>
</template>

<script>
export default {
  name: "CodingTest",
  data() {
    return {
      dpLv: null,
      dptest: [],
      ndp: null,
    };
  },
  methods: {
    async fnGetLvTests(lv) {
      this.dptest = await this.commonjs.getAllLvTests(lv);
      this.dpLv = lv;
      this.ndp = this.dptest.length == 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.lvBadge {
  position: relative;
  z-index: 1;
}

.question:hover {
  cursor: pointer;
}

pre {
  background-color: rgb(239, 239, 239, 0.4);
  border-radius: 0.5em;
}
</style>
