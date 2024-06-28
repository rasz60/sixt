<template>
  <v-card>
    <v-card-title id="detailsTitle">
      {{ post.title }}
    </v-card-title>

    <span id="subTitle">{{ post.date }} ({{ post.dateDiff }})</span>
    <div id="keywords">
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
    <v-divider></v-divider>
    <div id="doc" v-html="contents"></div>
  </v-card>
</template>

<script>
import datas from "@/assets/js/logging/details/loggingDetailsDatas.js";
import methods from "@/assets/js/logging/details/loggingDetailsMethods.js";

export default {
  data() {
    return datas;
  },
  created() {
    this.setPost();
  },
  methods: methods,
};
</script>

<style lang="scss">
#detailsTitle {
  justify-content: center;
  font-size: 30px;
  width: 100%;
  height: 4em;
  padding-top: 3em;
  padding-bottom: 1em;
  font-weight: 700;
}

#subTitle {
  display: flex;
  justify-content: center;
  color: darkgray;
}

#keywords {
  padding: 1em;
  display: flex;
  justify-content: center;

  .keyword {
    margin: 2px;
  }
}
#doc {
  padding: 20px;

  * {
    margin: 5px;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.8em;
  }

  h3 {
    font-size: 1.6em;
  }

  h4 {
    font-size: 1.4em;
    margin: 1rem;
  }

  h5 {
    font-size: 1.2em;
    margin: 0.8rem;
  }

  h6 {
    font-size: 1em;
    margin: 0.6rem;
  }

  h1,
  h2,
  h3 {
    padding-bottom: 1.2rem;
    margin-bottom: 1.2rem;
    border-bottom: 1px solid lightgray;
  }

  h6 {
    color: darkgray;
    font-weight: 400;
  }

  code {
    background-color: #f7f7f7;
    padding: 5px;
    border-radius: 10px;
    margin: 0.3em;
    font-weight: 500;
  }

  pre {
    background-color: #f7f7f7;
    padding: 15px;
    border-radius: 10px;
    margin: 1em;

    code {
      padding: 0;
      background-color: transparent;
      border-radius: none;
      margin: 0;
      font-weight: 400;
    }
  }

  a {
    text-decoration: none;
  }

  a:hover {
    background-color: aliceblue;
  }

  hr {
    margin-top: 2em;
    margin-bottom: 2em;
  }
}
</style>
