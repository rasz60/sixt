"use strict";(self["webpackChunksixt_github_io"]=self["webpackChunksixt_github_io"]||[]).push([[709],{8709:function(r,n,t){t.r(n),n["default"]="### Spring-boot 프로젝트 만들기\r\n\r\n이전 포스트에서 누누히(❓) 말했듯 나의 포지션은 백엔드이다.<br/>\r\n개인 공부로 유익했던 Github Pages Blog 만들기를 마치고 이번엔 back단까지 모두 손대보려한다.✌\r\n<br/><br/>\r\n\r\n우선은 이번 프로젝트 구성을 먼저 살펴보자.\r\n<br/>\r\n\r\n##### IDE\r\n\r\n`IntelliJ Community v.2023.2.6` | `Gradle v.8.3` | `VS Code v.1.91.0`\r\n\r\n##### RDBM\r\n\r\n`MySQL v.8.0.29`\r\n\r\n##### Backend (Dependencies)\r\n\r\n`JAVA 17` | `Spring-boot v3.3.1` | `JPA` | `Spring-security` | `MySQL Connector-j` | `Lombok`\r\n\r\n##### Frontend\r\n\r\n`Vue3` | `Vue-router` | `Axios` | `Vuetify`\r\n<br/><br/>\r\n\r\n시작 단계에서 구상한 프로젝트 구성 요소는 위와 같고, 기능 구현에 필요한 요소들을 하나씩 추가해보겠다.\r\n<br/><br/>\r\n\r\n#### ① JAVA 17 설치\r\n\r\nSpring Boot v3.x 이상 부터는 JAVA 17 버전 이상만 호환된다.<br/>\r\n[🔗JAVA 17 설치](https://ssue-dev.tistory.com/entry/%EC%84%A4%EC%B9%98-%EC%9C%88%EB%8F%84%EC%9A%B010%EC%97%90-Java-17-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)는 이미 되어 있어서, 링크를 참고하여 설치한다.\r\n<br/><br/>\r\n\r\n#### ② Spring Starter\r\n\r\n[🔗Spring Starter](https://start.spring.io/) 페이지로 접속해서 위와 같은 프로젝트 구성으로 프로젝트를 생성한다.<br/>\r\n해당 페이지는 접속할 때마다 선택할 수 있는 버전이 상이하다. 블로그 글을 보면서 따라만들 때 제일 고생한 부분이다.<br/>\r\nGradle build 파일에 버전을 명시하여 각각의 버전을 선택할 수 있어서 우선은 안정적인 버전으로 프로젝트를 생성하고나서 사용하는 라이브러리와 호환하는 버전으로 변경하는 방식으로 작업했다.\r\n<br/><br/>\r\n\r\n![img1](/sixt/spring-boot.jpg)\r\n\r\n<br/>\r\n캡처 이미지처럼 모든 선택사항을 추가하고 GENERATE 버튼을 클릭하면 ${프로젝트명}.zip파일 형태로 파일이 다운로드된다.<br/>\r\n이 파일의 압축을 풀어서 IntelliJ에서 불러와보자.\r\n<br/><br/>\r\n\r\n`IntelliJ` > File > Open을 클릭하여 압축 해제한 폴더 선택하면 Spring Starter로 만든 프로젝트를 불러올 수 있다.<br/>\r\n폴더를 불러온 후에 Gradle이 자동으로 build를 실행하는데, 여기서.. 첫 번째 이슈를 만났다.🤦‍♂️ [🔗issue#1. Gradle Version 이슈](/#/logging/16)<br/>\r\nGradle 버전에 의해서 Build가 되지 않는 현상이 있어 gradle-wrapper.properties의 gradle 버전을 변경해주었더니 해결되었다.\r\n<br/><br/>\r\n\r\n그 다음으로 `IntelliJ` > File > Project Structure .. > Platform Settings > SDKs 에서 설치한 자바 버전에 맞게 설정해주었다.\r\n<br/><br/>\r\n\r\n### Spring Boot 구동해보기\r\n\r\n일단 다른 설정을 추가하기 전에 모든 프로그래밍에 시작인 index 페이지에 'Hello, World!'를 띄워기를 해보자.<br/>\r\n기본 설정으로만 프로젝트를 run하기 위해서 아직 설정하지 않은 JPA dependency를 주석처리한다.\r\n<br/><br/>\r\n\r\nbuild.gradle\r\n\r\n```\r\n.\r\n.\r\ndependencies {\r\n\t//implementation 'org.springframework.boot:spring-boot-starter-data-jpa' //주석처리\r\n\t//implementation 'org.springframework.boot:spring-boot-starter-security' //주석처리\r\n\timplementation 'org.springframework.boot:spring-boot-starter-web'\r\n\tcompileOnly 'org.projectlombok:lombok'\r\n\tdevelopmentOnly 'org.springframework.boot:spring-boot-devtools'\r\n\truntimeOnly 'com.mysql:mysql-connector-j'\r\n\tannotationProcessor 'org.projectlombok:lombok'\r\n\ttestImplementation 'org.springframework.boot:spring-boot-starter-test'\r\n\ttestImplementation 'org.springframework.security:spring-security-test'\r\n\ttestRuntimeOnly 'org.junit.platform:junit-platform-launcher'\r\n}\r\n.\r\n.\r\n```\r\n\r\n<br/>\r\n\r\n다음으로는 프로젝트를 웹으로 띄우기 위한 port 설정을 추가한다. application.properties나 application.yml 둘 중 편한 형식으로 설정해준다.\r\n<br/><br/>\r\n\r\nsrc/main/resources/application.yml\r\n\r\n```\r\nserver:\r\n  port: ${설정할 포트번호}\r\n```\r\n\r\nsrc/main/resources/application.properties\r\n\r\n```\r\nserver.port=${설정할 포트번호}\r\n```\r\n\r\n<br/>\r\n\r\n그 다음 Hello, World! 라는 화면을 띄워 줄 index.html을 추가한다.\r\n<br/><br/>\r\n\r\nsrc/main/resources/static/index.html\r\n\r\n```\r\n<!doctype html>\r\n<html lang=\"ko\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\">\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\r\n    <title>Hello, world!</title>\r\n</head>\r\n<body>\r\nHello, world!\r\n</body>\r\n</html>\r\n```\r\n\r\n<br/>\r\n\r\n마지막으로 Project를 Run 시킬 설정을 추가한다. IntelliJ Community 버전을 사용하고 있기 때문에 위치와 설정 값이 조금씩 다를 수 있다.\r\n<br/><br/>\r\n\r\n⑴ 우측 상단 run 버튼 옆 Current File 옆 드롭단추 클릭<br/>\r\n⑵ Edit Configurations... 클릭<br/>\r\n⑶ 좌측 상단 '+' 버튼 혹은 Add New... 클릭<br/>\r\n⑷ Application 선택 > Name 입력, 값은 상관 없음<br/>\r\n⑸ Build and Run 아래 3개 선택 값 설정<br/>\r\n＋ 첫 번째 콤보 박스 : 설치된 자바 버전 선택<br/>\r\n＋ 두 번째 콤보 박스 : ${프로젝트명}.main 선택<br/>\r\n＋ 세 번째 콤보 박스 : 우측 리스트 버튼 클릭 후 ${프로젝트명}Application.java 클래스 선택\r\n<br/><br/>\r\n\r\n위와 같이 설정하여 run을 실행한 후, localhost:${설정한 포트번호}로 접속하면 Hello, world!가 출력된다.<br/>\r\n이 것으로 Spring-boot 프로젝트의 기본 설정을 마쳤고, 다음으로는 데이터 베이스를 설정해보겠다.😎\r\n"}}]);
//# sourceMappingURL=709.05f95767.js.map