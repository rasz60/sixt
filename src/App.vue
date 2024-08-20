<script setup>
//import MenuView from "@/views/MenuView.vue"; //좌측메뉴 f/o
import HeaderView from "@/views/HeaderView.vue";
import ContentView from "@/views/ContentView.vue";
</script>

<template>
  <v-overlay v-model="dropMenu">
    <v-list>
      <v-list-item>
        <v-btn
          icon="mdi-account-question-outline"
          @click="moveMenu('/about')"
        />
        <v-tooltip activator="parent" location="start">About Me</v-tooltip>
      </v-list-item>
      <v-list-item>
        <v-btn icon="mdi-math-log" @click="moveMenu('/logging')" />
        <v-tooltip activator="parent" location="start">deVLOG</v-tooltip>
      </v-list-item>
      <v-list-item>
        <v-dialog v-model="dialog" max-width="800">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              icon="mdi-email-fast-outline"
              v-bind="activatorProps"
              @click.stop="fnSendMail"
            ></v-btn>
          </template>

          <v-card prepend-icon="mdi-email-fast-outline">
            <v-card-text>
              <v-form ref="mailFrm">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="TO"
                      hide-details
                      v-model="emailTo"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      label="FROM"
                      v-model="fromName"
                      :rules="fromNameChk"
                      placeholder="보내는 사람"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      label="FROM"
                      v-model="fromAddr"
                      :rules="fromAddrChk"
                      placeholder="답장받을 메일 주소"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="TITLE"
                      v-model="title"
                      :rules="titleChk"
                      placeholder="제목"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Contents"
                      v-model="fromContents"
                      :rules="fromContentsChk"
                      placeholder="내용"
                      rows="10"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text="Close"
                variant="plain"
                @click="dialog = false"
              ></v-btn>

              <v-btn
                color="primary"
                text="Send"
                variant="tonal"
                @click="validate"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-tooltip activator="parent" location="start">Send E-mail</v-tooltip>
      </v-list-item>
    </v-list>
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
      <v-col cols="9">
        <ContentView />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-btn
      v-show="!scrolled"
      variant="tonal"
      icon="mdi-home"
      color="primary"
      id="home"
      @click="moveMenu(`/`)"
    >
    </v-btn>
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
import emailjs from "@emailjs/browser";

export default {
  name: "app",
  components: {
    //MenuView, //좌측메뉴 f/o
    HeaderView,
    ContentView,
  },
  data() {
    return {
      scrolled: false,
      dropMenu: false,
      dialog: false,
      emailTo: "devsixt@gmail.com",
      fromName: "",
      fromAddr: "",
      title: "",
      fromContents: "",
    };
  },
  mounted() {
    this.scrolled = document.scrollingElement.scrollTop <= 0;
    document.addEventListener("scroll", this.handleScroll);
  },
  computed: {
    titleChk() {
      const rules = [];

      const nullChk = (v) => {
        if (v) return true;
        else return "필수 입력사항입니다.";
      };
      rules.push(nullChk);

      const lengthChk = (v) => {
        if (v.length <= 100) return true;
        else return "100자를 초과할 수 없습니다.";
      };
      rules.push(lengthChk);

      return rules;
    },
    fromNameChk() {
      const rules = [];

      const lengthChk = (v) => {
        if (v.length <= 10) return true;
        else return "10자를 초과할 수 없습니다.";
      };
      rules.push(lengthChk);

      return rules;
    },
    fromAddrChk() {
      const rules = [];

      const nullChk = (v) => {
        if (v) return true;
        else return "필수 입력사항입니다.";
      };
      rules.push(nullChk);

      const lengthChk = (v) => {
        if (v.length <= 200) return true;
        else return "200자를 초과할 수 없습니다.";
      };
      rules.push(lengthChk);

      return rules;
    },
    fromContentsChk() {
      const rules = [];

      const nullChk = (v) => {
        if (v) return true;
        else return "필수 입력사항입니다.";
      };
      rules.push(nullChk);

      const lengthChk = (v) => {
        if (v.length <= 5000) return true;
        else return "5000자를 초과할 수 없습니다.";
      };
      rules.push(lengthChk);

      return rules;
    },
  },
  methods: {
    handleScroll() {
      var scroll = document.scrollingElement.scrollTop;
      this.scrolled = scroll <= 0;

      /*
      좌측 메뉴 이동 로직 : f/o
      var target1 = document.querySelector("#menuSection");

      if (target1 != null) {
        target1.style.top = scroll + "px";
      }
      */
      var dial = document.querySelector("#dial");
      var home = document.querySelector("#home");
      if (dial != null) {
        dial.style.marginTop = scroll > 0 ? "92vh" : "0";
        dial.style.top = scroll + "px";
      }

      if (home != null) {
        home.style.marginTop = scroll > 0 ? "92vh" : "0";
        home.style.top = scroll + "px";
      }
    },
    goTop() {
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    },
    fnSendMessage() {
      this.dropMenu = !this.dropMenu;
    },
    moveMenu(url) {
      if (this.$route.fullPath == url) {
        this.$router.go(0);
      } else {
        this.$router.push(url);
      }
      this.dropMenu = false;
    },
    fnSendMail() {
      this.dialog = true;
    },

    async validate() {
      var chk = await this.$refs.mailFrm.validate();
      if (chk.valid) this.sendEmail();
    },
    async sendEmail() {
      try {
        // EmailJS 초기화
        emailjs.init("5hySWbttq9fiGLQfh");

        // 이메일 전송
        const response = await emailjs.send(
          "service_crjinns",
          "template_kmhu5ku",
          {
            from_name: this.fromName,
            from_email: this.fromAddr,
            subject: "[New Message From sixt.github.io] : " + this.title,
            message: this.fromContents,
          }
        );

        if (response.status == 200) {
          alert("이메일 전송에 성공했습니다. 확인 후 답변드리겠습니다. :)");
          this.dialog = !this.dialog;
          this.fromName = "";
          this.fromAddr = "";
          this.title = "";
          this.fromContents = "";
        } else {
          alert("오류가 발생하여 이메일 발송에 실패하였습니다. :(");
        }
      } catch (error) {
        console.error("FAILED...", error);
      }
    },
  },
};
</script>

<style lang="scss">
.v-overlay__content {
  padding-top: 7em;
  width: 100%;

  .v-list {
    background-color: transparent;
    width: 5vw;
    text-align: center;
  }
}

.v-container {
  padding-top: 10em !important;
  min-height: 800px;

  #main {
    height: auto;
    padding: 0;
  }

  #menu {
    height: auto;
    padding-left: 1em;
    padding-right: 3em;
  }

  #home {
    position: absolute;
    right: 5.5rem;
    width: 2em;
    height: 2em;
    font-size: 1.3em;
    top: 0;
  }

  #dial {
    position: absolute;
    right: 2.5rem;
    width: 2em;
    height: 2em;
    font-size: 1.3em;
    top: 0;
  }
}
</style>
