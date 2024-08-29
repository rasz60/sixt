import { POSTS } from "../mutations_type.js";
import jsonPosts from "/public/json/_posts.json";
import jsonGroups from "/public/json/_groups.json";

export const posts = {
  namespaced: true,
  state: () => ({
    sGroup: [],
    sPost: [],
  }),

  mutations: {
    [POSTS.GET_ALL_POSTS](state) {
      let postJson = jsonPosts;

      for (var i in postJson) {
        postJson[i].bgcolor = "rgb(" + [POSTS.RANDOM_COLOR]() + ", 0.1)";
      }

      [POSTS.DATE_DIFF](postJson);
      [POSTS.SET_POST_LIST_TITLE](postJson);

      state.sPost = postJson.sort(function (a, b) {
        return a.realDateDiff - b.realDateDiff;
      });
    },
    [POSTS.DATE_DIFF](state, v) {
      let rst = "";

      for (var i in v) {
        var dateParam = v[i].date.substr(0, 10).split("-");
        var timeParam = v[i].date.substr(10).trim().split(":");

        dateParam.forEach((d) => {
          parseInt(d);
        });

        let now = new Date();

        v[i].realDateDiff =
          now.getTime() -
          new Date(
            dateParam[0],
            dateParam[1] - 1,
            dateParam[2],

            timeParam[0],
            timeParam[1],
            timeParam[2]
          ).getTime();

        var t = Math.ceil(v[i].realDateDiff / 1000);

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

        v[i].dateDiff = rst;
      }
    },
    [POSTS.SET_POST_LIST_TITLE](state, v) {
      var max = 130;
      for (var i = 0; i < v.length; i++) {
        var t = v[i].title;
        v[i].dpTitle = t.length > max ? t.substr(0, max) + " ..." : t;

        var gs = v[i].groupSeq;
        v[i].gTitle = jsonGroups[gs - 1].groupTitle;
        v[i].gColor = jsonGroups[gs - 1].groupColor;
      }
    },
    [POSTS.RANDOM_COLOR]() {
      const rColor = Math.floor(Math.random() * 256);
      const gColor = Math.floor(Math.random() * 256);
      const bColor = Math.floor(Math.random() * 256);

      return rColor + "," + gColor + "," + bColor;
    },
  },

  getters: {
    getAllMenus: (state) => {
      this.GET_MENUS();
      return state.menus;
    },
  },

  actions: {
    getMenus: ({ commit }, v) => {
      commit(POSTS.GET_MENUS, v);
    },
  },
};
