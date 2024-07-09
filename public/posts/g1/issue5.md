### vue.config.js > publicPath 설정

모든 설정을 마치면 짜자잔〰❕ 하고 페이지가 나오길 기대했다.<br/>
그치만 아무것도 나오지 않는다..😮💥<br/>
개발자 도구 콘솔에 not found 404가 뜨는 것을 확인했다.
<br/><br/>

확인해보니, Github Pages는 기본적으로 아래와 같이 url을 설정한다.<br/>

```
https://${githubId}.github.com/${repositoryName}
```

그런데 우리가 배포한 소스에서는 root url 즉, `https://${githubId}.github.com/`에서 부터 소스들을 찾고 있다.<br/>
프로젝트의 base url을 repository 이름으로 변경해주어야 Github Pages에서 정상적으로 작동한다.
<br/><br/>

vue.config.js

```
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.module
      .rule("*.md")
      .test(/\.md?$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  indexPath: "index.html",
  publicPath: "/${repositoryName}/", // 본인의 git repository 이름 작성
});
```
