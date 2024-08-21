<template>
  <v-layout id="header" :class="scrolled ? `notScrolled` : `scrolled`">
    <v-app-bar id="headerMenu" :class="scrolled ? `notScrolled` : `scrolled`">
      <v-row>
        <v-col cols="4">
          <v-btn
            id="menuDrop"
            icon="mdi-menu"
            @click.stop="fnMenu"
            :variant="!scrolled ? `tonal` : null"
            :color="!scrolled ? `orange` : null"
          ></v-btn>
        </v-col>
        <v-col cols="4" id="logo">
          <v-avatar
            id="avatar"
            size="80"
            @click.stop="moveMenu('/')"
            v-if="scrolled"
          >
            <v-img src="https://avatars.githubusercontent.com/u/96821067?v=4" />
          </v-avatar>
        </v-col>
        <v-col cols="4" id="btnbox">
          <v-btn
            id="home"
            v-if="!scrolled"
            icon="mdi-home"
            variant="tonal"
            color="primary"
            @click.stop="moveMenu('/')"
          ></v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
  </v-layout>
</template>

<script>
export default {
  name: "HeaderView",
  props: {
    scrolled: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    newWindow(url) {
      window.open("about:blank").location.href = url;
    },
    fnMenu() {
      this.$emit("sendMessage");
    },
    moveMenu(url) {
      if (this.$route.fullPath == url) {
        this.$router.go(0);
      } else {
        this.$router.push(url);
      }
    },
  },
};
</script>
