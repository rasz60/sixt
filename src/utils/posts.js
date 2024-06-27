const dateDiff = (posts) => {
  let rst = "";

  for (var i in posts) {
    var dateParam = posts[i].date.split("-");

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
      if (hours > 0) {
        rst = hours + "시간 전";
      } else if (minutes > 0) {
        rst = minutes + "분 전";
      } else {
        rst = seconds + "초 전";
      }
    }

    posts[i].dateDiff = rst;
  }
};

const posts = [
  {
    seq: 1,
    group: "g-1",
    name: "README",
    title: "[WEB] Spring-boot, Vue3, MySql 웹페이지 만들기🔨",
    date: "2024-06-26",
    dateDiff: null,
    keywords: ["keyword0", "keyword1", "keyword2"],
    proceeding: true,
  },
  {
    seq: 2,
    group: "g-2",
    name: "ISSUE",
    title: "[WEB] GitHub Pages Blog 만들기 issue🩺",
    date: "2024-06-26",
    dateDiff: null,
    keywords: ["keyword0", "keyword1", "keyword2"],
    proceeding: true,
  },
];

dateDiff(posts);

export default JSON.stringify(posts);
