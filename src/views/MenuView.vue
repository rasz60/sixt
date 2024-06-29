<template>
  <v-layout id="menuSection">
    <v-list density="compact" nav id="nav">
      <v-list-item
        id="profile"
        prepend-avatar="https://avatars.githubusercontent.com/u/96821067?v=4"
        title="SIXT(Jinwoong Kim)"
        subtitle="devsixt60@gmail.com"
        @click="this.$router.push('/')"
      >
        <div id="social">
          <v-icon
            icon="mdi-github"
            @click="newWindow(`https://github.com/rasz60`)"
          />
          <v-icon icon="mdi-email-fast-outline"></v-icon>
        </div>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        prepend-icon="mdi-account-search"
        title="INTRODUCE"
        value="introduce"
        @click="this.$router.push('/about')"
        class="navItems"
      >
        <template v-slot:append>
          <v-badge
            v-show="updateIntroduce"
            color="error"
            content="new"
            inline
          ></v-badge>
        </template>
      </v-list-item>

      <v-list-item
        prepend-icon="mdi-note-edit-outline"
        title="LOGGING"
        value="blog"
        @click="this.$router.push('/logging')"
        class="navItems"
      >
        <template v-slot:append>
          <v-badge
            v-show="newPostCnt > 0"
            color="red"
            :content="newPostCnt"
            inline
          ></v-badge>
        </template>
      </v-list-item>
    </v-list>
  </v-layout>
</template>

<script>
export default {
  name: "menuView",
  data() {
    return {
      updateIntroduce: false,
      newPostCnt: 0,
    };
  },
  mounted() {
    this.newPostCnt = this.commonjs.newPostCnt();
  },
  methods: {
    newWindow(url) {
      window.open("about:blank").location.href = url;
    },
  },
};
</script>

<style lang="scss">
#menuSection {
  display: block;
  position: relative;
  height: 90vh;
  background-color: rgba(247, 165, 1, 0.65);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0.3em 0.3em 1em lightgray;

  transition: all 10ms linear;

  /* v-list custom */
  .v-list {
    background-color: transparent;
    color: #1a1a1a;

    .v-list-item-title {
      font-weight: 400;
    }
  }

  /* profile section custom */
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

  /* nav section custom */
  #nav .navItems {
    margin: 0.2rem;
    padding: 1.2rem;
    font-size: 1.2rem;

    .v-list-item-title {
      text-align: center;
      font-size: 1.2rem;
    }
  }
}
</style>
