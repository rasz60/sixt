const dateDiff = (posts) => {
  let rst = "";

  for (var i in posts) {
    var dateParam = posts[i].date.substr(0, 10).split("-");
    var timeParam = posts[i].date.substr(10).trim().split(":");

    dateParam.forEach((v) => {
      parseInt(v);
    });

    let now = new Date();

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    if (year != dateParam[0]) {
      rst = year - dateParam[0] + "년 전";
    } else if (month != dateParam[1]) {
      rst = month - dateParam[1] + "개월 전";
    } else if (date != dateParam[2]) {
      rst = date - dateParam[2] + "일 전";
    } else {
      posts[i].newPost = true;

      if (hours - timeParam[0] > 0) {
        rst = hours - timeParam[0] + "시간 전";
      } else if (minutes - timeParam[1] > 0) {
        rst = minutes - timeParam[1] + "분 전";
      } else {
        rst = seconds - timeParam[2] + "초 전";
      }
    }

    posts[i].realDateDiff =
      now.getTime() -
      new Date(dateParam[0], dateParam[1] - 1, dateParam[2]).getTime();
    posts[i].dateDiff = rst;
  }
};

const posts = [
  {
    seq: 1,
    group: "g-1",
    name: "README",
    title: "[WEB] Spring-boot, Vue3, MySql 웹페이지 만들기🔨",
    date: "2024-06-26 18:52:34",
    dateDiff: null,
    keywords: [
      { type: "dev", value: "dev" },
      { type: "full", value: "fullstack" },
      { type: "back", value: "java" },
      { type: "back", value: "spring-boot" },
      { type: "back", value: "spring-security" },
      { type: "front", value: "vue" },
      { type: "front", value: "vuetify" },
      { type: "db", value: "mysql" },
    ],
    newPost: false,
    proceeding: false,
  },
  {
    seq: 2,
    group: "g-2",
    name: "ISSUE",
    title: "[WEB] GitHub Pages Blog 만들기 issue🩺",
    date: "2024-06-27 11:50:12",
    realDateDiff: 0,
    dateDiff: null,
    keywords: [
      { type: "issue", value: "issue" },
      { type: "front", value: "frontend" },
      { type: "front", value: "vue" },
      { type: "front", value: "vuetify" },
    ],
    newPost: false,
    proceeding: true,
  },
];

dateDiff(posts);

posts.sort(function (a, b) {
  return a.realDateDiff - b.realDateDiff;
});

export default JSON.stringify(posts);
