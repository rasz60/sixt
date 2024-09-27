### [WEB] GitHub Pages Blog 만들기 #1 중 이슈 [🔗](#/logging/1/1)

vue/cli 버전에 따라 기본적으로 설치되는 dependency가 다른 것 같다.<br/>
노트북으로 완성지은 프로젝트를 집에 있는 데스크탑으로 복기하면서 블로그를 작성하는데 차이가 있었다.<br/>
이 블로그를 보고 따라 만들다가 결과가 다를 수 있을 것 같아서 package.json 전체를 오픈한다.
<br/><br/>
만약 기본으로 설치되지 않은 dependency는 npm i ${dependency이름}으로 설치해주시면 됩니다!<br/>
설치한 후 제대로 작동하지 않으면 VS CODE를 완전히 끄고 다시 실행시켜주세요.😎
<br/><br/>
package.json

```
...

  "dependencies": {
    "@mdi/font": "^7.4.47",
    "core-js": "^3.8.3",
    "eslint-plugin-vue": "^8.0.3",
    "raw-loader": "^4.0.2",
    "showdown": "^2.1.0",
    "vue": "^3.2.13",
    "vue-router": "^4.0.13"
  },
  "devDependencies": {
    "@babel/core": "^7.12.16",
    "@babel/eslint-parser": "^7.12.16",
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-plugin-router": "^5.0.8",
    "@vue/cli-service": "~5.0.0",
    "eslint": "^7.32.0",
    "prettier": "^3.3.2",
    "sass": "^1.77.6",
    "sass-loader": "^10.5.2",
    "vite-plugin-vuetify": "^2.0.3",
    "vuetify": "^3.6.10"
  },
...
```
