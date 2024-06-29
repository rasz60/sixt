### [WEB] GitHub Pages Blog 만들기 #1 중 오류 발생 [🔗](#/logging/1)

vs code terminal에서 vue create 실행 시 아래와 같은 오류 발생

```
vue : 이 시스템에서 스크립트를 실행할 수 없으므로 c:\users\user\appdata\roaming\npm\vue.ps1 파일을 로드할 수 없습니다. 자세한 내용은 about_Execution_
Policies(https://go.microsoft.com/fwlink/?LinkID=135170)을 참조하십시오.

위치 줄:1 문자:1
  + vue create sixt.github.io
  + ~~~
```

### 🙆‍♂️ 해결

vs code에서 실행하는 window powershell의 실행 정책을 변경해야한다.[#참고](https://zakkum.tistory.com/84)

&nbsp;⑴ window powershell 관리자 모드로 실행<br/>
&nbsp;⑵ Set-ExecutionPolicy -ExcutionPolicy Unrestricted 입력
<br/><br/>

그 다음 다시 vue create를 실행하면 정상 동작😎
