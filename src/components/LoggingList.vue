<template>
  <v-row id="listTop">
    <v-col :cols="postCnt == 1 ? 12 : 9" id="categorys">
      <v-chip
        :prepend-icon="postCnt > 1 ? `mdi-list-box-outline` : null"
        link
        @click="seeAll"
      >
        전체보기
      </v-chip>
      <v-chip
        class="category"
        v-for="category in categorys"
        :key="category"
        :prepend-icon="postCnt > 1 ? category.icon : null"
        :color="category.color"
        link
        @click="setPosts(category.type, category.value)"
      >
        {{ category.title }}
      </v-chip>
    </v-col>

    <v-col :cols="postCnt == 1 ? 12 : 3">
      <v-text-field
        variant="underlined"
        append-icon="mdi-magnify"
        v-model="searchKeyword"
        @click:append="setPosts(null, null)"
        @keyup="searchKeyup"
        placeholder="검색어 입력"
        hide-details
      ></v-text-field>
    </v-col>
  </v-row>

  <div v-for="g in displayGroups" :key="g">
    <v-row :class="`group g` + g.groupSeq" @click.stop="g.toggle = !g.toggle">
      <v-col cols="10" class="groupTitle">
        <h2>{{ g.groupSeq }}.&nbsp;{{ g.groupTitle }}</h2>
      </v-col>
      <v-col cols="1" class="groupTitle">
        <v-badge color="info" :content="g.childCnt" inline></v-badge>
      </v-col>
      <v-col cols="1" class="groupTitle">
        <v-icon :icon="g.toggle ? `mdi-menu-up` : `mdi-menu-down`" />
      </v-col>
    </v-row>

    <v-divider></v-divider><br />
    <v-row>
      <v-col
        cols="12"
        v-for="(row, i) in fnSetGroupRows(g.groupSeq)"
        :key="row"
        class="loggingRow"
        v-show="g.toggle"
      >
        <v-row>
          <v-col
            v-for="post in fnSetPostList(g.groupSeq, i)"
            :key="post"
            :cols="12 / postCnt"
          >
            <v-badge
              class="itemSeq"
              color="secondary"
              :content="`#` + post.groupItemSeq"
            ></v-badge>
            <router-link
              :to="'/logging/' + g.groupSeq + '/' + post.seq"
              class="postLink"
            >
              <v-card class="post" link>
                <v-card-title
                  class="postTitle"
                  :style="`background-color: ` + post.bgcolor"
                >
                  {{ post.dpTitle }}
                </v-card-title>

                <v-divider></v-divider>

                <div class="keywords">
                  <v-chip
                    v-for="keyword in post.keywords"
                    :key="keyword"
                    :prepend-icon="this.commonjs.keywordPIcon(keyword.type)"
                    :color="this.commonjs.keywordColor(keyword.type)"
                    size="small"
                    link
                    class="keyword"
                    >{{ keyword.value }}</v-chip
                  >
                </div>

                <div class="lastRow">
                  <v-row>
                    <v-col cols="12" class="dateDiff">
                      <span>
                        <v-icon icon="mdi-code-braces" size="small" />
                        {{ g.groupTitle }}
                      </span>
                      {{ post.dateDiff }}
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </router-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import datas from "@/assets/js/logging/list/loggingListDatas.js";
import methods from "@/assets/js/logging/list/loggingListMethods.js";

export default {
  name: "loggingList",
  props: {
    cwidth: {
      type: Number,
      required: true,
    },
  },
  data() {
    return datas;
  },
  created() {
    /* Groups settings */
    this.groups = this.commonjs.getAllGroups().reverse();
    this.displayGroups = this.groups;

    /* Posts settings */
    this.posts = this.commonjs.getAllPosts().reverse();
    this.displayPosts = this.posts;

    /* Keyword setting */
    for (var i = 0; i < this.categorys.length; i++) {
      var t = this.categorys[i].type;
      var v = this.categorys[i].value;

      this.categorys[i].icon = this.commonjs.keywordPIcon(t, v);
      this.categorys[i].color = this.commonjs.keywordColor(t, v);
    }

    /* row per post Count setting */
    if (this.cwidth >= 1850) {
      this.postCnt = 3;
    } else if (this.cwidth >= 1200) {
      this.postCnt = 2;
    } else {
      this.postCnt = 1;
    }
  },
  methods: methods,
  watch: {
    displayPosts(v) {
      this.rows = Math.ceil(this.posts.length / this.postCnt);
      this.displayGroups = [];
      this.groups.forEach((g) => {
        var gseq = g.groupSeq;
        var childCnt = 0;
        v.forEach((p) => {
          p.groupSeq == gseq ? childCnt++ : 0;
        });
        g.childCnt = childCnt;
        g.toggle = true;
        if (childCnt > 0) this.displayGroups.push(g);
      });
    },
    cwidth(v) {
      if (v >= 1850) {
        this.postCnt = 3;
      } else if (v >= 1200) {
        this.postCnt = 2;
      } else {
        this.postCnt = 1;
      }
    },
  },
};
</script>
