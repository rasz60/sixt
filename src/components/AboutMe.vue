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
          <v-col cols="12" sm="1">
            <v-icon icon="mdi-email-outline" size="small" />
          </v-col>
          <v-col cols="12" sm="3">devsixt60@gmail.com</v-col>
          <v-col cols="12" sm="1">
            <v-icon icon="mdi-bug-play-outline" size="small" />
          </v-col>
          <v-col cols="12" sm="3">rasz60.github.io/sixt</v-col>
          <v-col cols="12" sm="1">
            <v-icon icon="mdi-github" size="small" />
          </v-col>
          <v-col cols="12" sm="3">github.com/rasz60</v-col>
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
export default {
  name: "aboutMe",
  data() {
    return {
      skillGroup: [
        {
          type: 0,
          name: "Backend",
          icon: "mdi-code-greater-than-or-equal",
          color: "primary",
        },
        {
          type: 1,
          name: "Database",
          icon: "mdi-database",
          color: "success",
        },
        { type: 2, name: "DevOps", icon: "mdi-dev-to", color: "cyan" },
        { type: 3, name: "Frontend", icon: "mdi-code-json", color: "warning" },
        {
          type: 4,
          name: "ETC",
          icon: "mdi-power-plug-outline",
          color: "purple",
        },
      ],
      skills: [
        {
          main: true,
          type: 0,
          name: "JAVA",
          logo: "mdi-language-java",
        },
        {
          main: true,
          type: 0,
          name: "Spring-Framework",
          logo: null,
        },
        {
          main: false,
          type: 0,
          name: "Spring-Boot",
          logo: null,
        },
        {
          main: true,
          type: 0,
          name: "RestAPI",
          logo: "mdi-api",
        },
        {
          main: false,
          type: 0,
          name: "MyBatis",
          logo: null,
        },
        {
          main: false,
          type: 0,
          name: "JPA",
          logo: null,
        },

        {
          main: true,
          type: 1,
          name: "ORACLE",
          logo: null,
        },
        {
          main: true,
          type: 1,
          name: "MSSQL",
          logo: null,
        },
        {
          main: false,
          type: 1,
          name: "MySQL",
          logo: null,
        },

        {
          main: true,
          type: 2,
          name: "OpneShift-PaaS",
          logo: "mdi-redhat",
        },
        {
          main: false,
          type: 2,
          name: "Github",
          logo: "mdi-github",
        },
        {
          main: false,
          type: 2,
          name: "Gitlab",
          logo: "mdi-gitlab",
        },
        {
          main: false,
          type: 2,
          name: "Maven",
          logo: "mdi-wrench-outline",
        },
        {
          main: false,
          type: 2,
          name: "Gradle",
          logo: "mdi-wrench-outline",
        },
        {
          main: true,
          type: 3,
          name: "JAVASCRIPT",
          logo: "mdi-language-javascript",
        },
        {
          main: false,
          type: 3,
          name: "JQuery",
          logo: "mdi-jquery",
        },
        {
          main: true,
          type: 3,
          name: "Ajax",
          logo: null,
        },
        {
          main: false,
          type: 3,
          name: "HTML5",
          logo: "mdi-language-html5",
        },
        {
          main: false,
          type: 3,
          name: "JSP",
          logo: null,
        },
        {
          main: false,
          type: 3,
          name: "CSS3",
          logo: "mdi-language-css3",
        },
        {
          main: false,
          type: 4,
          name: "Vue.js",
          logo: "mdi-vuejs",
        },
        {
          main: false,
          type: 4,
          name: "vuetify",
          logo: "mdi-vuetify",
        },
        {
          main: false,
          type: 4,
          name: "WebSquare5",
          logo: null,
        },
      ],
      info: true,
      skill: true,
      career: true,
      diff: "",
      year1: false,
      year2: false,
      past: false,
      current: true,
    };
  },
  created() {
    this.fnSetCareer();
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

<style scoped lang="scss">
.v-list-item {
  border-bottom: 1px solid lightgray !important;
}

.subhd {
  background-color: rgba(236, 236, 236, 0.2);
}

.skills {
  border: none !important;
}

.subcontent {
  font-size: 14px;
  color: darkgray;
}
</style>
