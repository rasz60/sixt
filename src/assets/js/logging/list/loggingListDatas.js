export default {
  searchKeyword: "",
  posts: null,
  displayPosts: new Array(),
  postStatus: [],
  categorys: [
    { type: "dev", value: "dev" },
    { type: "full", value: "fullstack" },
    { type: "back", value: "backend" },
    { type: "front", value: "frontend" },
    { type: "db", value: "database" },
    { type: "issue", value: "issue" },
    { type: "lib", value: "library" },
    { type: "status", title: "진행중", value: true },
    { type: "status", title: "마감", value: false },
  ],
  rows: 0,
};
