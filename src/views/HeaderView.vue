<template>
  <v-layout id="header" :class="scrolled ? `notScrolled` : `scrolled`">
    <v-app-bar id="headerMenu" :class="scrolled ? `notScrolled` : `scrolled`">
      <v-row>
        <v-col cols="12" sm="5" class="d-flex align-center pl-5">
          <v-btn icon="mdi-menu" @click.stop="fnMenu"></v-btn>
        </v-col>
        <v-col cols="12" sm="2" id="logo">
          <v-avatar
            id="avatar"
            size="80"
            @click.stop="moveMenu('/')"
            v-if="scrolled"
          >
            <v-img src="https://avatars.githubusercontent.com/u/96821067?v=4" />
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="5" id="btnbox" class="pr-10 pt-5">
          SIXT(Jinwoong Kim)
          <v-btn
            icon="mdi-github"
            @click.stop="newWindow(`https://github.com/rasz60`)"
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
  watch: {},
};
</script>

<style lang="scss">
#header {
  margin: 0 !important;
  width: 100%;
  height: 7em;
  overflow: visible !important;
  position: fixed !important;
  z-index: 2001 !important;
  top: 0;

  #headerMenu {
    height: 7em;
    box-shadow: none;

    .v-toolbar__content {
      height: 100% !important;
    }

    .v-row {
      height: 100%;

      #logo {
        text-align: center;
        margin-top: 0.25em;
        #avatar {
          background-color: whitesmoke;
        }

        #avatar:hover {
          cursor: pointer;
        }

        #avatar:hover img {
          transition-property: all; /*모든부분 변화*/
          transition-duration: 0.2s; /*0.2s동안 변화*/
          transition-timing-function: linear; /*일정한 속도로 변화*/
          transition-delay: 0; /*즉시변화-> 0이 default값이므로 생략 가능*/
          transform: scale(1.15); /* 1.15배 크기로 변화*/
        }
      }

      #btnbox {
        display: flex;
        justify-content: end;
        align-items: center;
      }
    }
  }
}
#header.notScrolled {
  background-color: white;
  border-bottom: 1px solid #ececec;
  #headerMenu.notScrolled {
    background-color: rgba(247, 165, 1, 0.55);
  }
}
#header.scrolled {
  background-color: transparent;
  border-bottom: none;
  #headerMenu.scrolled {
    background-color: transparent;
  }
}
</style>
