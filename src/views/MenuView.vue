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
            @click.stop="newWindow(`https://github.com/rasz60`)"
          />
          <v-dialog v-model="dialog" max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <v-icon
                icon="mdi-email-fast-outline"
                v-bind="activatorProps"
              ></v-icon>
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
        </div>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        prepend-icon="mdi-account-search"
        title="INTRODUCE"
        value="introduce"
        @click.stop="moveMenu('/about')"
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
        title="deVLOG"
        value="blog"
        @click="moveMenu('/logging')"
        class="navItems"
      >
        <template v-slot:append>
          <v-badge
            v-show="newPostCnt > 0"
            color="error"
            :content="newPostCnt"
            inline
          ></v-badge>
        </template>
      </v-list-item>
    </v-list>
  </v-layout>
</template>

<script>
import emailjs from "@emailjs/browser";

export default {
  name: "menuView",
  data() {
    return {
      dialog: false,
      emailTo: "devsixt60@gmail.com",
      title: "",
      fromName: "",
      fromAddr: "",
      fromContents: "",
      status: "",
      updateIntroduce: false,
      newPostCnt: 0,
    };
  },
  mounted() {
    this.overlay = this.overlayFlag;
    this.newPostCnt = this.commonjs.newPostCnt();
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
    newWindow(url) {
      window.open("about:blank").location.href = url;
    },
    moveMenu(url) {
      if (this.$route.fullPath == url) {
        this.$router.go(0);
      } else {
        this.$router.push(url);
      }
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
  watch: {
    dialog(v) {
      var menu = document.querySelector("#menuSection");
      if (v) {
        menu.style.position = "sticky";
        menu.style.marginTop = document.scrollingElement.scrollTop + "px";
      } else {
        menu.style.position = "relative";
        menu.style.marginTop = 0;
        this.fromName = "";
        this.fromAddr = "";
        this.title = "";
        this.fromContents = "";
      }
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
