<template>
  <v-card>
    <v-item-group class="py-2">
      <v-item-prepend class="pl-3">
        <v-icon icon="mdi-email-fast-outline" />
      </v-item-prepend>
      <v-item-cotent class="pl-3">To. {{ emailTo }}</v-item-cotent>
    </v-item-group>
    <v-card-text>
      <v-form ref="mailFrm">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              label="NAME"
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

      <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

      <v-btn
        color="primary"
        text="Send"
        variant="tonal"
        @click="validate"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import sendMailDatas from "@/assets/js/overlay/sendMail/sendMailDatas";
import sendMailRules from "@/assets/js/overlay/sendMail/sendMailRules";
import sendMailMethods from "@/assets/js/overlay/sendMail/sendMailMethods";

export default {
  name: "SendMail",
  data() {
    return sendMailDatas;
  },
  computed: sendMailRules,
  methods: sendMailMethods,
  watch: {
    dialog(v) {
      this.$emit("sendMessage", {
        dialog: v,
        success: this.success,
      });
    },
  },
};
</script>
