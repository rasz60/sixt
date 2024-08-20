import jsonPosts from "/public/json/_posts.json";
import jsonGroups from "/public/json/_groups.json";
import keywordConfig from "/public/json/_keyword.json";

// 모든 post array 가져오기
const getAllPosts = () => {
  let posts = jsonPosts;

  for (var i in posts) {
    posts[i].bgcolor = "rgb(" + randomColor() + ", 0.1)";
  }

  dateDiff(posts);
  setPostListTitle(posts);
  return posts.sort(function (a, b) {
    return a.realDateDiff - b.realDateDiff;
  });
};

const getAllGroups = () => {
  let groups = jsonGroups;

  return groups.sort(function (a, b) {
    return a.groupSeq - b.groupSeq;
  });
};

// 키워드별 chip 배경색 설정
const keywordColor = (type, value) => {
  var color = "";
  for (var i in keywordConfig) {
    let config = keywordConfig[i];
    if (config.type == type) {
      if (config.value != null) {
        color = config.value == value ? config.color : "";
      } else {
        color = config.color;
      }
      if (color != "") break;
    }
  }

  return color;
};

// keywordPIcon
const keywordPIcon = (type, value) => {
  var icon = "";
  for (var i in keywordConfig) {
    let config = keywordConfig[i];
    if (config.type == type) {
      if (config.value != null) {
        icon = config.value == value ? config.icon : "";
      } else {
        icon = config.icon;
      }
      if (icon != "") break;
    }
  }

  return icon;
};

const randomColor = () => {
  const rColor = Math.floor(Math.random() * 256);
  const gColor = Math.floor(Math.random() * 256);
  const bColor = Math.floor(Math.random() * 256);

  return rColor + "," + gColor + "," + bColor;
};

const newPostCnt = () => {
  let postsCnt = getAllPosts().filter((p) => p.newPost);
  return postsCnt.length;
};

const dateDiff = (posts) => {
  let rst = "";

  for (var i in posts) {
    var dateParam = posts[i].date.substr(0, 10).split("-");
    var timeParam = posts[i].date.substr(10).trim().split(":");

    dateParam.forEach((v) => {
      parseInt(v);
    });

    let now = new Date();

    posts[i].realDateDiff =
      now.getTime() -
      new Date(
        dateParam[0],
        dateParam[1] - 1,
        dateParam[2],

        timeParam[0],
        timeParam[1],
        timeParam[2]
      ).getTime();

    var t = Math.ceil(posts[i].realDateDiff / 1000);

    if (t < 60) {
      rst = t + "초 전";
    } else if (t >= 60 && t < 60 * 60) {
      rst = Math.ceil(t / 60) + "분 전";
    } else if (t >= 60 * 60 && t < 60 * 60 * 24) {
      rst = Math.ceil(t / (60 * 60)) + "시간 전";
    } else if (t >= 60 * 60 * 24 && t < 60 * 60 * 24 * 30) {
      rst = Math.ceil(t / (60 * 60 * 24)) + "일 전";
    } else if (t >= 60 * 60 * 24 * 30 && t < 60 * 60 * 24 * 365) {
      rst = Math.ceil(t / (60 * 60 * 24 * 30)) + "개월 전";
    } else if (t >= 60 * 60 * 24 * 365) {
      rst = Math.ceil(t / (60 * 60 * 24 * 365)) + "년 전";
    }

    posts[i].dateDiff = rst;
  }
};
const setPostListTitle = (posts) => {
  var max = 130;
  for (var i = 0; i < posts.length; i++) {
    var t = posts[i].title;
    posts[i].dpTitle = t.length > max ? t.substr(0, max) + " ..." : t;

    var gs = posts[i].groupSeq;
    posts[i].gTitle = jsonGroups[gs - 1].groupTitle;
    posts[i].gColor = jsonGroups[gs - 1].groupColor;
  }
};

export default {
  getAllPosts: getAllPosts,
  getAllGroups: getAllGroups,
  keywordColor: keywordColor,
  keywordPIcon: keywordPIcon,
  randomColor: randomColor,
  newPostCnt: newPostCnt,
};
