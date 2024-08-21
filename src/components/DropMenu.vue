<script setup>
import SendMail from "@/components/SendMail.vue";
</script>

<template>
  <v-list>
    <v-list-item class="d-flex" @click="moveMenu('/about')">
      <v-btn
        icon="mdi-account-question-outline"
        @click.stop="moveMenu('/about')"
        size="small"
      />
      <span class="bg-white title">
        <v-icon
          v-for="char in `aboutme`"
          :key="char"
          :icon="`mdi-alpha-` + char"
        ></v-icon>
      </span>
    </v-list-item>
    <v-list-item @click="moveMenu('/logging')">
      <v-btn
        icon="mdi-math-log"
        @click.stop="moveMenu('/logging')"
        size="small"
      />
      <span class="bg-white title">
        <v-icon
          v-for="char in `devlog`"
          :key="char"
          :icon="`mdi-alpha-` + char"
        ></v-icon>
      </span>
    </v-list-item>
    <v-list-item @click="fnSendMail">
      <v-dialog v-model="dialog" max-width="800">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            icon="mdi-email-fast-outline"
            v-bind="activatorProps"
            @click.stop="fnSendMail"
            size="small"
          ></v-btn>
          <span class="bg-white title">
            <v-icon
              v-for="char in `send email`"
              :key="char"
              :icon="`mdi-alpha-` + char"
            ></v-icon>
          </span>
        </template>
        <SendMail @sendMessage="fnSendMailDone" />
      </v-dialog>
    </v-list-item>
    <v-list-item @click="newWindow(`https://github.com/rasz60`)">
      <v-btn
        icon="mdi-github"
        @click.stop="newWindow(`https://github.com/rasz60`)"
        size="small"
      />
      <span class="bg-white title">
        <v-icon
          v-for="char in `github`"
          :key="char"
          :icon="`mdi-alpha-` + char"
        ></v-icon>
      </span>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "DropMenu",
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    moveMenu(url) {
      if (this.$route.fullPath == url) {
        this.$router.go(0);
      } else {
        this.$router.push(url);
      }
      this.$emit("sendMessage");
    },
    fnSendMail() {
      this.dialog = true;
    },
    fnSendMailDone(v) {
      this.dialog = v.dialog;
      if (v.success) {
        this.$emit("sendMessage");
      }
    },
    newWindow(url) {
      window.open("about:blank").location.href = url;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-list {
  background-color: transparent;
  width: fit-content;
  text-align: left;

  .v-list-item {
    border: none !important;
  }

  span.title {
    margin: 1em;
  }
}
</style>
