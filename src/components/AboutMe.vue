<script setup></script>

<template>
  <v-card class="pa-3">
    <v-card-title class="main-title">웹티비티한 개발자적 사고 ;)</v-card-title>
    <div class="pa-2 text-center">
      <v-icon class="mr-2" icon="mdi-tag-multiple" size="small" />
      <v-chip
        v-for="s in skills.filter((s) => {
          if (s.main) return s;
        })"
        :key="s"
        size="small"
        class="ma-1"
        :prepend-icon="skillGroup[s.type].icon"
        :color="skillGroup[s.type].color"
        variant="tonal"
      >
        {{ s.name }}
      </v-chip>
    </div>
    <v-divider></v-divider>

    <v-list-item type="subheader" class="subhd">
      <v-icon icon="mdi-account" size="small" class="mr-4" />devsixt
    </v-list-item>

    <v-list>
      <v-list-item class="pa-5 pl-10">
        <v-row>
          <v-col cols="3" sm="1">
            <v-icon icon="mdi-email-outline" size="small" />
          </v-col>
          <v-col cols="9" sm="3">devsixt60@gmail.com</v-col>
          <v-col cols="3" sm="1">
            <v-icon icon="mdi-bug-play-outline" size="small" />
          </v-col>
          <v-col cols="9" sm="3">rasz60.github.io/sixt</v-col>
          <v-col cols="3" sm="1">
            <v-icon icon="mdi-github" size="small" />
          </v-col>
          <v-col cols="9" sm="3">github.com/rasz60</v-col>
        </v-row>
      </v-list-item>

      <v-list-item
        type="subheader"
        class="subhd"
        :append-icon="career ? `mdi-menu-up` : `mdi-menu-down`"
        @click="career = !career"
      >
        <v-icon icon="mdi-briefcase" size="small" class="mr-4" />Career
        <span class="subcontent">({{ diff }})</span>
      </v-list-item>
      <v-list-item
        v-if="career"
        class="pl-7"
        :prepend-icon="
          current ? `mdi-timeline-check` : `mdi-timeline-check-outline`
        "
        :append-icon="current ? `mdi-menu-up` : `mdi-menu-down`"
        @click="current = !current"
      >
        2024
        <div v-if="current" class="pa-5 pl-10">현재</div>
      </v-list-item>
      <v-list-item
        v-if="career"
        class="pl-7"
        :prepend-icon="year1 ? `mdi-timeline-check` : `mdi-timeline-outline`"
        :append-icon="year1 ? `mdi-menu-up` : `mdi-menu-down`"
        @click="year1 = !year1"
      >
        2023
        <div v-if="year1" class="pa-5 pl-10">2023</div>
      </v-list-item>
      <v-list-item
        v-if="career"
        class="pl-7"
        :prepend-icon="year2 ? `mdi-timeline-check` : `mdi-timeline-outline`"
        :append-icon="year2 ? `mdi-menu-up` : `mdi-menu-down`"
        @click="year2 = !year2"
      >
        2022
        <div v-if="year2" class="pa-5 pl-10">과거</div>
      </v-list-item>
      <v-list-item
        v-if="career"
        class="pl-7"
        :prepend-icon="past ? `mdi-timeline-check` : `mdi-timeline-outline`"
        :append-icon="past ? `mdi-menu-up` : `mdi-menu-down`"
        @click="past = !past"
      >
        2017 - 2021
        <div v-if="past" class="pa-5 pl-10">과거</div>
      </v-list-item>
    </v-list>

    <v-list-item
      type="subheader"
      class="subhd"
      :append-icon="skill ? `mdi-menu-up` : `mdi-menu-down`"
      @click="skill = !skill"
    >
      <v-icon icon="mdi-magic-staff" size="small" class="mr-4" />Skills
    </v-list-item>

    <v-list-item
      v-show="skill"
      v-for="(g, idx) in skillGroup"
      :key="g"
      :class="`py-2 pl-7 ` + (idx < skillGroup.length - 1 ? `skills` : ``)"
      :prepend-icon="g.icon"
      link
    >
      <v-tooltip activator="parent" location="start">
        {{ g.name }}
      </v-tooltip>

      <v-row>
        <v-col cols="12">
          <v-chip
            v-for="s in skills.filter((s) => {
              if (s.type == g.type) return s;
            })"
            :key="s"
            :prepend-icon="s.logo != null ? s.logo : g.icon"
            :color="g.color"
            size="small"
            class="ma-1"
          >
            {{ s.name }}
          </v-chip>
        </v-col>
      </v-row>
    </v-list-item>
  </v-card>
</template>

<script>
import aboutMeDatas from "@/assets/js/aboutMe/aboutMeDatas";

export default {
  name: "aboutMe",
  data() {
    return aboutMeDatas;
  },
  async created() {
    this.fnSetCareer();
    this.pj = await this.commonjs.getProject(2024);
    this.skillGroup = await this.commonjs.getAllSkillGroup();
    this.skills = await this.commonjs.getAllSkills();
    this.displayPj = this.pj;
  },
  methods: {
    fnSetCareer() {
      var currY = new Date();
      var s = new Date(2022, 5, 13);
      var timeDiff = currY.getTime() - s.getTime();

      var d = 24 * 60 * 60 * 1000;
      var m = 30 * d;
      var y = 365 * d;

      var diffY = Math.floor(timeDiff / y);
      var diffM = Math.ceil((timeDiff - diffY * y) / m);

      this.diff = diffY + "년 " + diffM + "개월";
    },
  },
  watch: {
    career(v) {
      if (!v) {
        this.past = false;
        this.current = false;
      }
    },
  },
};
</script>
