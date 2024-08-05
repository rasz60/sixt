### arguments 접근 불가 이슈

vuex store 구현 중, module 파일에 아래와 같이
<br/>

```
① actions: () => ({
    .
    .
    .
})

② actions: {
    .
    .
    .
}
```

두 가지 방식으로 선언한 mutations에 ①번은 접근 불가, ②번은 접근 가능한 이슈가 발생했다.
