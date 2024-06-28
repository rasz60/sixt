const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    //빌드 시 빌드되어 나오는 js파일을 js폴더 아래로 묶어 빌드한다
    config.output.filename("js/[name].js");
    config.module
      .rule("*.md")
      .test(/\.md?$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  indexPath: "index.html",
  publicPath: "/sixt/",
});
