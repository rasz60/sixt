<script setup></script>

<template>
  <v-card class="pa-3">
    <!-- title -->
    <v-card-title class="main-title">웹티비티한 개발자적 사고 ;)</v-card-title>

    <!-- main skills -->
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

    <!-- subtitle -->
    <v-list-item type="subheader" class="subhd">
      <v-icon icon="mdi-account" size="small" class="mr-4" />devsixt
    </v-list-item>

    <v-list>
      <!-- contact info start -->
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
      <!-- contact info end -->

      <!-- career start -->

      <!-- Career - Maintitle -->
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
        <!-- Career - Subtitle(year) -->
        <v-row @click="fnToggleProjects(y)" class="careerY">
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

        <!-- Career - Contents -->
        <v-card
          v-show="y.fold"
          v-for="(p, idx) in y.projectCnt"
          :key="p"
          class="pa-2 my-2 careerC"
        >
          <v-row>
            <v-col cols="12">
              <v-row>
                <!-- Career - Contents - seq-icon -->
                <v-col cols="1"
                  ><v-icon :icon="`mdi-numeric-` + y.projects[idx].seq"
                /></v-col>

                <!-- Career - Contents - prepend-icon -->
                <v-col cols="11" sm="1" class="pjLabel">
                  <v-icon icon="mdi-calendar-clock" size="small" />
                </v-col>

                <!-- Career - Contents - start / end date -->
                <v-col cols="11" sm="10">
                  {{ fnSetDateStr(y.projects[idx]) }}
                </v-col>
              </v-row>

              <!-- Career - Contents - Project Title -->
              <v-row>
                <v-spacer></v-spacer>
                <v-col cols="11" sm="1" class="pjLabel">
                  <v-icon icon="mdi-format-title" size="small" />
                </v-col>
                <v-col cols="11" sm="10">{{
                  y.projects[idx].projectTitle
                }}</v-col>
              </v-row>

              <!-- Career - Contents - subTitle -->
              <v-row>
                <v-spacer></v-spacer>
                <v-col cols="11" sm="1" class="pjLabel">
                  <v-icon icon="mdi-information-outline" size="small" />
                </v-col>
                <v-col cols="11" sm="10">{{
                  y.projects[idx].projectSubTitle
                }}</v-col>
              </v-row>

              <!-- Career - Contents - Skills -->
              <v-row>
                <v-spacer></v-spacer>
                <v-col cols="11" sm="1" class="pjLabel">
                  <v-icon icon="mdi-tag-multiple-outline" size="small" />
                </v-col>
                <v-col cols="11" sm="10">
                  <v-chip
                    v-for="s in fnSetSkills(y.projects[idx].projectSkills)"
                    :key="s"
                    :text="s"
                    :icon="s.icon"
                    size="small"
                    class="mx-1"
                  />
                </v-col>
              </v-row>

              <!-- Career - Contents - Details -->
              <v-row>
                <v-spacer></v-spacer>
                <v-col cols="11" sm="1" class="pjLabel">
                  <v-icon icon="mdi-text-search-variant" size="small" />
                </v-col>
                <v-col cols="11" sm="10">
                  <pre>{{ y.projects[idx].projectDetails }}</pre>
                </v-col>
              </v-row>

              <!-- Career - Contents - Improvements -->
              <v-row>
                <v-spacer></v-spacer>
                <v-col cols="11" sm="1" class="pjLabel">
                  <v-icon icon="mdi-chevron-triple-up" size="small" />
                </v-col>
                <v-col cols="11" sm="10">
                  <pre>{{ y.projects[idx].projectImprovements }}</pre>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-list-item>
    </v-list>
    <!-- career end -->

    <!-- skills info start -->
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
    <!-- skills info end -->
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
      var careerStart = new Date(2022, 5, 13);

      this.diff = this.fnDateDiffStr(careerStart, new Date());

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
    fnSetDateStr(pjtime) {
      var str = "";

      if (pjtime.projectStartDate && pjtime.projectEndDate) {
        var s = pjtime.projectStartDate;
        var e = pjtime.projectEndDate;
        str =
          s +
          " ~ " +
          e +
          " (" +
          this.fnDateDiffStr(new Date(s), new Date(e)) +
          ")";
      }
      return str;
    },
    fnDateDiffStr(s, e) {
      var str = "";

      var diff = e.getTime() - s.getTime();

      var d = 24 * 60 * 60 * 1000;
      var m = 30 * d;
      var y = 365 * d;

      if (diff > y) {
        str += Math.floor(diff / y) + "년";
        diff = diff % y;
      }

      if (diff > 0) {
        str += str != "" ? " " : str;
        str += Math.ceil(diff / m) + "개월";
        diff = diff % m;
      }

      return str;
    },
    fnSetSkills(skills) {
      var sks = skills.split("|");

      for (var i in sks.length) {
        console.log(sks[i]);

        sks[i].icon = this.skills.filter((s) => {
          if (s.name == sks[i]) return s.logo;
        });
      }

      return sks;
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
