export default {
  async seeAll() {
    this.displayPosts = [];
    this.post = await this.commonjs.getAllPosts();
    this.displayPosts = await this.posts;
  },
  setPostWithKeyword(type) {
    let conditionPosts = [];
    for (var i in this.posts) {
      var keywords = this.posts[i].keywords;
      for (var j = 0; j < keywords.length; j++) {
        if (keywords[j].type.toUpperCase() == type.toUpperCase()) {
          conditionPosts.push(this.posts[i]);
          break;
        }
      }
    }
    return conditionPosts;
  },
  setPostWithStatus(value) {
    let conditionPosts = new Array();

    for (var i = 0; i < this.posts.length; i++) {
      if (this.posts[i].proceeding == value) {
        conditionPosts.push(this.posts[i]);
      }
    }
    return conditionPosts;
  },
  setPostContainsKeyword(type) {
    let conditionPosts = new Array();
    for (var i in this.posts) {
      var chk = false;
      var keywords = this.posts[i].keywords;
      for (var j = 0; j < keywords.length; j++) {
        if (keywords[j].type.toUpperCase().indexOf(type.toUpperCase()) > -1) {
          conditionPosts.push(this.posts[i]);
          chk = true;
          break;
        }
        if (keywords[j].value.toUpperCase().indexOf(type.toUpperCase()) > -1) {
          conditionPosts.push(this.posts[i]);
          chk = true;
          break;
        }
      }
      if (!chk) {
        var title = this.posts[i].title;
        if (title.toUpperCase().indexOf(type.toUpperCase()) > -1) {
          conditionPosts.push(this.posts[i]);
          chk = true;
        }
      }
    }
    return conditionPosts;
  },
  async setPosts(type, value) {
    var keywordFlag = value == null;
    var statusFlag = type == "status" || type == null;

    if (keywordFlag && statusFlag) {
      if (this.searchKeyword == "") {
        alert("검색어를 입력해주세요.");
      } else {
        // 키워드, 제목에 포함된 포스트 찾기
        this.displayPosts = this.setPostContainsKeyword(this.searchKeyword);
      }
    } else {
      if (type == "status") {
        this.displayPosts = this.setPostWithStatus(value);
      } else {
        this.displayPosts = this.setPostWithKeyword(type);
      }
    }
  },
  searchKeyup(evt) {
    if (evt.keyCode == "13") {
      this.setPosts(null, null);
    }
  },
  fnListType() {
    this.listType = this.listType == 0 ? 1 : 0;
  },
  fnSetPostList(groupSeq, i) {
    return this.displayPosts
      .filter((dp) => dp.groupSeq == groupSeq)
      .filter((p, idx) => {
        if (idx >= i * this.postCnt && idx < (i + 1) * this.postCnt) return p;
      });
  },
  fnSetGroupRows(groupSeq) {
    return Math.ceil(
      this.displayPosts.filter((p) => p.groupSeq == groupSeq).length /
        this.postCnt
    );
  },
};
