export default {
  searchKeyword: "",
  groups: null,
  posts: null,
  displayPosts: new Array(),
  postStatus: [],
  categorys: [
    { type: "dev", title: "dev" },
    { type: "issue", title: "issue" },
    { type: "status", title: "진행중", value: true },
    { type: "status", title: "마감", value: false },
  ],
  rows: 0,
  listType: 0,
  listTypeIcon: "mdi-format-list-numbered",
  listTypeText: "목록형",
};
