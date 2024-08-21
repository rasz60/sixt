import emailjs from "@emailjs/browser";

export default {
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
        this.success = true;
        this.dialog = false;
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
};
