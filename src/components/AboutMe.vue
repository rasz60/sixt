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
      <v-list-item v-show="career" v-for="y in years" :key="y" class="pl-7">
        <v-row @click="fnToggleProjects(y)">
          <v-col cols="1">
            <v-icon :icon="y.fold ? y.activeIcon : y.defaultIcon" />
          </v-col>
          <v-col cols="10">{{ y.year }}</v-col>
          <v-col cols="1">
            <v-badge
              class="projectCnt"
              color="primary"
              :content="y.projectCnt"
            ></v-badge>
          </v-col>
        </v-row>
        <v-row v-show="y.fold" v-for="(p, idx) in y.projectCnt" :key="p">
          <v-col cols="12">
            <v-divider></v-divider>
            <v-row>
              <v-col cols="1"
                ><v-icon :icon="`mdi-numeric-` + y.projects[idx].seq"
              /></v-col>
              <v-col cols="3" class="pjLabel">프로젝트 명</v-col>
              <v-col cols="8">{{ y.projects[idx].projectTitle }}</v-col>
            </v-row>

            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="3" class="pjLabel">간략 소개</v-col>
              <v-col cols="8">{{ y.projects[idx].projectSubTitle }}</v-col>
            </v-row>

            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="3" class="pjLabel">사용 기술</v-col>
              <v-col cols="8">{{ y.projects[idx].projectSkills }}</v-col>
            </v-row>

            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="3" class="pjLabel">수행 기간</v-col>
              <v-col cols="8">{{ y.projects[idx].projectDueTime }}</v-col>
            </v-row>

            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="3" class="pjLabel">상세 내용</v-col>
              <v-col cols="8">{{ y.projects[idx].projectDetails }}</v-col>
            </v-row>

            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="3" class="pjLabel">개선 사항</v-col>
              <v-col cols="8">{{ y.projects[idx].projectImprovements }}</v-col>
            </v-row>
          </v-col>
        </v-row>
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
    this.skillGroup = await this.commonjs.getAllSkillGroup();
    this.skills = await this.commonjs.getAllSkills();
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

      this.fnSetYears();
    },
    async fnSetYears() {
      this.current = new Date().getFullYear();

      for (var i = 2024; i >= 2017; i--) {
        var thisYear = this.current == i;
        var idx = 2024 - i;

        this.years[idx] = {
          year: i,
          thisYear: thisYear,
          defaultIcon: thisYear
            ? `mdi-timeline-clock-outline`
            : `mdi-timeline-outline`,
          activeIcon: thisYear ? `mdi-timeline-clock` : `mdi-timeline-check`,
          fold: false,
          projects: await this.commonjs.getProject(i),
          projectCnt: 0,
        };

        this.years[idx].projectCnt =
          this.years[idx].projects != null
            ? this.years[idx].projects.length
            : 0;
      }
    },
    fnToggleProjects(y) {
      if (y.projectCnt == 0) {
        alert("준비중입니다. 조금만 기다려주세요.🤣");
      } else {
        y.fold = !y.fold;
      }
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
