### [WEB] GitHub Pages Blog 만들기 중 오류 발생 [🔗](#/logging/1/1)

① vue create 로 만든 vue 프로젝트에서 eslint, prettier 오류 발생

###### ㄴ포맷팅을 제대로 하지 못하고, 시스템은 정상적으로 작동하나 소스 코드에 빨간 줄 표시

② 과거 sideproject 때, 사용했던 eslint-plugin-vue dependency 추가

```
npm i -d eslint-plugin-vue --no-fund
```

③ [eslint] failed to load plugin 'prettier' declared in 'package.json': cannot find module 'eslint-plugin-prettier' 에러 발생
<br/><br/>

### 🙅‍♂️ 맞는 말이겠지만, 나를 치유하지는 못했던 참고 자료 [🔗](https://www.inflearn.com/questions/35438/eslint-%EC%84%A4%EC%A0%95%EC%9D%80-%EB%AA%A8%EB%91%90-%EC%99%84%EB%A3%8C-%ED%96%88%EB%8A%94%EB%8D%B0-%EC%BD%94%EB%93%9C%EC%97%90%EC%84%9C-%EB%AC%B8%EC%A0%9C-%EB%8C%80%EC%83%81-%EB%9D%BC%EC%9D%B8%EC%97%90-%ED%91%9C%EC%8B%9C%EA%B0%80-%EB%90%98%EC%A7%80%EC%95%8A%EC%8A%B5%EB%8B%88%EB%8B%A4)

① VS CODE 최상단 검색창에 settings.json 검색

② 제일 마지막 속성에 추가

```
"eslint.workingDirectories": ["./vue-til"]
```

③ 추가 dependency 설치

```
npm install eslint-plugin-import --save-dev
npm install eslint-plugin-node --save-dev
npm install eslint-plugin-promise --save-dev
npm install eslint-plugin-standard --save-dev
```

<br/><br/>

### 🙆‍♂️ 해결

① create vue 로 생성 시 자동으로 설정되는 package.json 속성 수정

② eslintConfig > extends 수정

```
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/vue3-essential",
      "eslint:recommended",
      //"plugin:prettier/recommended" //삭제
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    },
    "rules": {}
  },
```
