import jsonPosts from "/public/storages/_posts.json";
import keywordConfig from "/public/storages/_keyword.json";

// 모든 post array 가져오기
const getAllPosts = () => {
  let posts = jsonPosts;

  dateDiff(posts);

  return posts.sort(function (a, b) {
    return a.realDateDiff - b.realDateDiff;
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
      break;
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
      break;
    }
  }

  return icon;
};

const randomColor = () => {
  const rColor = Math.floor(Math.random() * 128 + 64);
  const gColor = Math.floor(Math.random() * 128 + 64);
  const bColor = Math.floor(Math.random() * 128 + 64);

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

export default {
  getAllPosts: getAllPosts,
  keywordColor: keywordColor,
  keywordPIcon: keywordPIcon,
  randomColor: randomColor,
  newPostCnt: newPostCnt,
};
