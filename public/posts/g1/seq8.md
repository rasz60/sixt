### Github와 프로젝트 연동하기

Vue3로 만든 블로그를 실제 온라인에서 접속할 수 있게끔 하려한다.<br/>
여러가지 방법이 있지만 간단하게 Github Pages를 이용해서 호스팅해보겠다.
<br/><br/>

블로그를 만드는 포스트에서 말했듯이, 정적인 웹페이지만 올릴 수 있기 때문에 모델링한 데이터를 json파일로 저장하였고,<br/>
게시글 상세 내용도 markdown 파일로 작성하였다.

###### ㄴ [Vue3로 내 블로그 만들기 포스트 보러가기🔗](#/logging/1/1)

<br/>
우선 Vue3 프로젝트를 웹에 배포하기 위해 소스를 module화하여 build한다.<br/>
Vue3 블로그 프로젝트를 VS Code에 띄우고 터미널에 아래와 같이 입력한다.<br/>

```
npm run build
```

이렇게 하면 dist라는 폴더가 생성되고, 그 아래로 우리가 작성한 소스가 module화되어 저장된다.
<br/><br/>

다음으로 git repository를 생성하고 프로젝트에 github 연동 초기 설정을 해주었다. VS Code 터미널에서 git init을 입력한다.<br/>

```
git init
```

이렇게 하면 프로젝트 내에 숨김폴더로 .git이라는 폴더와 .gitignore 파일이 생성된다.<br/>
.gitignore 파일은 git에 소스를 commit할 때 제외할 소스를 정의해놓는 파일이다.<br/>
이 파일을 열어보면 /dist 경로가 제외 경로로 지정되어있는데 이 부분을 삭제한다. [@issue#1 .gitignore 설정](#/logging/1/12)

```
.DS_Store
node_modules
/dist ---> 삭제
.
.
.
```

<br/>
다음으로 github Pages를 통해 배포되는 웹페이지의 URL에 맞추어 프로젝트의 publicPath를 지정해주어야하는데,<br/>
vue.config.js 파일에 아래와 같이 publicPath를 추가해준다. [@issue#2 publicPath 지정](#/logging/1/13)
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
  publicPath: "/${git repository 이름}/", // 본인의 repository 이름 작성
});
```

다음으로 Github 로그인하여 새로운 repository를 생성하고, VS Code 터미널에서 아래 순서대로 입력하면 소스코드가 git repository에 올라간다.<br/>

```
// 현재 경로의 소스 전체 git 대기열에 추가
git add .

// 대기열에 추가된 소스 staging
git commit -m "${commit 상세 기록}"

// branch 생성
git branch -M ${branch 이름}

// 로컬과 git repository를 연결하는 remote 생성
git remote add ${remote이름} https://github.com/${본인계정}/${repository이름}.git

// remote로 연결된 git repository에 staging된 소스를 push
git push ${remote이름} ${branch 이름}
```

다음으로는 소스를 업로드한 Repository에 Github Pages 설정을 해야한다.
<br/><br/>

① git repository > Settings > 좌측 메뉴에서 Pages 선택<br/>
② Build and deployment 항목에 source를 GitHub Actions로 변경<br/>
③ 페이지 새로고침되고 하단에 static HTML의 Configure 클릭<br/>
④ 2가지 항목 수정 및 1가지 항목 추가 후 우측 상단 Commit Changes 버튼 클릭하여 commit

```
.
.
.
# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: true // 수정 : GitHub Actions workflows 실행 동시성 제어

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      .
      .
      .
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload entire repository
          path: "./dist" // 수정 : 실제 module화 된 build 소스가 있는 경로
      .
      .
      .
      // 추가 : vue3 프로젝트 실행 설정
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          # cache: 'npm'
      - run: npm ci --legacy-peer-deps
      - run: npm run build
        env:
          CI: false
```

Github Actions은 github repository의 commit이 생기면 자동으로 소스를 빌드하여 변경사항을 반영해준다.<br/>
git에 소스를 커밋한 후, github repository에서 Actions 탭으로 들어가면 현재 build 상태와 history를 확인할 수 있다.<br/>

이것으로 Github Pages로 블로그 소스를 배포하기 위한 설정을 마쳤다.<br/>
https://${git아이디}.github.io/${git repository 이름} 으로 접속하면 배포된 페이지를 확인할 수 있다.😎
<br/><br/>

다음 포스트에서는 로컬에서와 달리 제대로 동작하지 않는 몇 가지를 수정해보겠다.
