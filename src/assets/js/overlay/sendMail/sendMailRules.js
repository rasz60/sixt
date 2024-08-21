export default {
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

    const regChk = (v) => {
      var regExp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regExp.test(v)) return true;
      else return "이메일 형식을 확인해주세요";
    };
    rules.push(regChk);

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
};
