### Gradle Version 이슈

Spring Starter에서 생성한 프로젝트를 import하여 build하는 과정에서 이슈가 발생했다.<br/>
`Could not move temporary workspace` 라는 에러메시지를 띄우면서 build를 실패하였다.<br/>

### 🙆‍♂️ 해결

구글링해본 결과, Gradle 버전에 호환되지 않아 발생하는 문제였다.[🔗참고](https://velog.io/@jyl9311/IntelliJ-Could-not-move-temporary-workspace-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0)
<br/><br/>

gradle/wrapper/gradle-wrapper.properties

```
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.3-bin.zip // 8.8 -> 8.3으로 변경
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```
