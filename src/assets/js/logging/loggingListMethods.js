export default {
  async setPostBg() {
    let postTitle = document.querySelectorAll(".postTitle");

    for (var i = 0; i < postTitle.length; i++) {
      postTitle[i].style.backgroundColor =
        "rgb(" + this.commonjs.randomColor() + ", 0.1)";
    }
  },
  async seeAll() {
    this.displayPosts = this.posts;
    if ((await this.displayPosts.length) > 0) {
      this.setPostBg();
    }
  },
  setPostWithKeyword(type) {
    let conditionPosts = new Array();
    for (var i in this.posts) {
      var keywords = this.posts[i].keywords;
      for (var j = 0; j < keywords.length; j++) {
        if (keywords[j].type == type) {
          conditionPosts.push(this.posts[i]);
          break;
        }
      }
    }
    return conditionPosts;
  },
  setPostWithStatus(value) {
    let conditionPosts = new Array();
    for (var i in this.posts) {
      if (this.posts[i].proceeding == value) {
        conditionPosts.push(this.posts[i]);
      }
    }
    return conditionPosts;
  },
  setPostContainsKeyword(type) {
    let conditionPosts = new Array();
    for (var i in this.posts) {
      var keywords = this.posts[i].keywords;
      for (var j = 0; j < keywords.length; j++) {
        if (keywords[j].type.indexOf(type) > -1) {
          conditionPosts.push(this.posts[i]);
          break;
        }
        if (keywords[j].value.indexOf(type) > -1) {
          conditionPosts.push(this.posts[i]);
          break;
        }
      }
    }
    return conditionPosts;
  },
  async setPosts(type, value) {
    this.displayPosts = new Array();

    var keywordFlag = value == null;
    var statusFlag = type == null;

    if (keywordFlag && statusFlag) {
      if (this.searchKeyword == "") {
        alert("검색어를 입력해주세요.");
      } else {
        this.displayPosts = this.setPostContainsKeyword(this.searchKeyword);
        this.posts.filter((p) => {
          p.title.indexOf(this.searchKeyword) > -1
            ? this.displayPosts.filter((p2) =>
                p2.seq != p.seq ? this.displayPosts.push(p) : false
              )
            : false;
        });
      }
    } else {
      if (keywordFlag) {
        this.displayPosts = this.setPostWithKeyword(type);
      }

      if (statusFlag) {
        this.displayPosts = this.setPostWithStatus(value);
      }
    }

    if ((await this.displayPosts.length) > 0) this.setPostBg();
  },
};
