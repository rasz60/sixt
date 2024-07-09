### .gitignore

프로젝트를 github repository와 연동하기 위해서 git init 설정을 하고 나면, .git 폴더와 .gitigonre 파일이 생성된다.
<br/><br/>

.gitignore 파일에는 git에 업로드하지 않아도 되는 경로나 파일들이 정의되어있다.<br/>
업무 중에도 개인 로컬 PC에서 개발환경 세팅이나, 테스트용 파일 등 실제로 형상관리가 필요없는 소스들이 있기 마련이다.<br/>
이런 경로들을 정의해두면 프로젝트 내 다른 개발자가 git에서 pull 받아 작업할 때 발생할 수 있는 이슈를 사전에 방어할 수 있다.
<br/><br/>

파일 설명이 중요한게 아니라..아무튼 ❗ ❗ Vue 프로젝트를 배포하려고 소스를 build하였다.<br/>
`npm run build`를 실행하면 dist라는 폴더가 생성되고, module화된 파일들로 소스가 build된다.
<br/><br/>

그리고나서 git에 소스를 push하고 확인했지만 아무것도 나오지 않는다..🤦‍♂️<br/>

확인해보니 소스가 build된 dist 폴더가 .gitignore 파일에 정의되어있었다.<br/>
아무것도 수정하지 않았다면 모두가 그럴 것이다. 우리는 이 소스를 통해 화면을 출력하기 때문에 이 부분을 제거해준다!

```
.DS_Store
node_modules
/dist ---> 삭제
.
.
.
```
