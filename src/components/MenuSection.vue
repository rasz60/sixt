<template>
  <v-layout id="menuSection">
    <v-list id="profile">
      <v-list-item
        prepend-avatar="https://avatars.githubusercontent.com/u/96821067?v=4"
        title="SIXT(Jinwoong Kim)"
        subtitle="rassayzsixt@gmail.com"
      >
        <div id="social">
          <v-icon icon="mdi-github" @click="goHref(0)" />
          <v-icon icon="mdi-instagram" @click="goHref(1)" />
        </div>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav> </v-list>
  </v-layout>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    goHref(idx) {
      var url = [
        "https://github.com/rasz60",
        "https://instagram.com/rasz_sixt",
      ];

      window.open("about:blank").location.href = url[idx];
    },
  },
};
</script>

<style lang="scss">
#menuSection {
  display: block;
  width: 20%;
  height: 95%;
  position: fixed;
  background-color: #f7a501;
  border-radius: 10px 10px 10px 10px;
  padding: 10px;

  #profile {
    width: 100%;
    margin-bottom: 10px;

    .v-avatar {
      width: 150px;
      height: 150px;
      background-color: ghostwhite;
    }
    .v-avatar img {
      width: 100%;
    }
    .v-avatar:hover {
      cursor: pointer;
    }
    .v-avatar:hover img {
      transition-property: all; /*모든부분 변화*/
      transition-duration: 0.2s; /*0.2s동안 변화*/
      transition-timing-function: linear; /*일정한 속도로 변화*/
      transition-delay: 0; /*즉시변화-> 0이 default값이므로 생략 가능*/
      transform: scale(1.15); /* 1.15배 크기로 변화*/
    }

    div#social {
      margin-top: 10px;

      .v-icon {
        padding: 18px !important;
        cursor: pointer;
      }

      .v-icon:hover {
        transition-property: all; /*모든부분 변화*/
        transition-duration: 0.2s; /*0.2s동안 변화*/
        transition-timing-function: linear; /*일정한 속도로 변화*/
        transition-delay: 0; /*즉시변화-> 0이 default값이므로 생략 가능*/
        transform: scale(1.15); /* 1.15배 크기로 변화*/
      }
    }
  }

  .v-list {
    background-color: transparent;
    color: #1a1a1a;

    .v-list-item-title {
      font-size: 16px;
      font-weight: 400;
    }
  }
}
</style>
