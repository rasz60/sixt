# :no_good_man: 맞는 말이겠지만, 나를 치유하지는 못했던 참고 자료 [:link:](https://www.inflearn.com/questions/35438/eslint-%EC%84%A4%EC%A0%95%EC%9D%80-%EB%AA%A8%EB%91%90-%EC%99%84%EB%A3%8C-%ED%96%88%EB%8A%94%EB%8D%B0-%EC%BD%94%EB%93%9C%EC%97%90%EC%84%9C-%EB%AC%B8%EC%A0%9C-%EB%8C%80%EC%83%81-%EB%9D%BC%EC%9D%B8%EC%97%90-%ED%91%9C%EC%8B%9C%EA%B0%80-%EB%90%98%EC%A7%80%EC%95%8A%EC%8A%B5%EB%8B%88%EB%8B%A4)

#### 1. VS CODE 최상단 검색창에 settings.json 검색

#### 2. 제일 마지막 속성에 추가

```
"eslint.workingDirectories": ["./vue-til"]
```

#### 3. 추가 dependency 설치

```
npm install eslint-plugin-import --save-dev
npm install eslint-plugin-node --save-dev
npm install eslint-plugin-promise --save-dev
npm install eslint-plugin-standard --save-dev
```
