<script setup>
//import MenuView from "@/views/MenuView.vue"; //좌측메뉴 f/o
import HeaderView from "@/views/HeaderView.vue";
import ContentView from "@/views/ContentView.vue";
import DropMenu from "@/components/DropMenu.vue";
</script>

<template>
  <v-overlay v-model="dropMenu">
    <DropMenu @sendMessage="fnSendMessage" />
  </v-overlay>
  <HeaderView :scrolled="scrolled" @sendMessage="fnSendMessage" />
  <v-container id="container">
    <v-row id="main">
      <!-- 좌측메뉴 f/o
      <v-col cols="3" id="menu">
        <MenuView />
      </v-col>
      -->
      <v-spacer></v-spacer>
      <v-col cols="12" sm="8">
        <ContentView :scrolled="scrolled" />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-btn
      v-show="!scrolled"
      variant="tonal"
      icon="mdi-arrow-up"
      color="cyan"
      id="dial"
      @click="goTop"
    >
    </v-btn>
  </v-container>
</template>

<script>
import appMethods from "@/assets/js/app/appMethods.js";

export default {
  name: "app",
  components: {
    //MenuView, //좌측메뉴 f/o
    HeaderView,
    ContentView,
    DropMenu,
  },
  data() {
    return {
      scrolled: false,
      dropMenu: false,
      dialog: false,
    };
  },
  mounted() {
    this.scrolled = document.scrollingElement.scrollTop <= 0;
    document.addEventListener("scroll", this.handleScroll);
  },
  methods: appMethods,
};
</script>
