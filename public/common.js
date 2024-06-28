import posts from "@/utils/posts";

const keywordColor = (type, value) => {
  var color = "";
  if (type == "dev") {
    color = "cyan";
  } else if (type == "issue") {
    color = "red";
  } else if (type == "full") {
    color = "indigo";
  } else if (type == "back") {
    color = "green";
  } else if (type == "front") {
    color = "orange";
  } else if (type == "db") {
    color = "primary";
  } else if (type == "lib") {
    color = "secondary";
  } else if (type == "status") {
    if (value) {
      color = "green-darken-4";
    } else {
      color = "red-darken-4";
    }
  }
  return color;
};
const keywordPIcon = (type, value) => {
  var icon = "";
  if (type == "dev") {
    icon = "mdi-math-log";
  } else if (type == "issue") {
    icon = "mdi-alert-circle-outline";
  } else if (type == "full") {
    icon = "mdi-set-all";
  } else if (type == "back") {
    icon = "mdi-code-greater-than-or-equal";
  } else if (type == "front") {
    icon = "mdi-palette";
  } else if (type == "db") {
    icon = "mdi-database";
  } else if (type == "lib") {
    icon = "mdi-plus-box-multiple";
  } else if (type == "status") {
    if (value) {
      icon = "mdi-play-box-outline";
    } else {
      icon = "mdi-stop-circle-outline";
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
  let postsCnt = JSON.parse(posts).filter((p) => p.newPost);
  return postsCnt.length;
};

export default {
  keywordColor: keywordColor,
  keywordPIcon: keywordPIcon,
  randomColor: randomColor,
  newPostCnt: newPostCnt,
};
