### arguments 접근 불가 이슈

vuex store 구현 중, module의 state, mutations, getters, actions의 속성이 있는데, 제일 먼저 state를 작성한 후에 나머지 속성을 작성했다.<br/>
나머지 속성을 작성할 때 state 구문을 복사 붙여넣기해서 작성했는데 여기서 문제가 발생했다.<br/>
아래와 같이 state 구문을 작성하는 방식으로 mutations, getters, actions 구문을 작성하니 vue파일에서 불러오지 못했다.<br/>

```
actions: () => ({
    .
    .
    .
})
```

### 🙆‍♂️해결

개발자 도구 debugging으로 한 단계씩 거슬러가보고 별의 별 노력을 했지만 결국 작성 방식의 문제였다.<br/>
actions, mutations, getters는 여러가지 메서드를 담고있는 객체형으로 작성하여 각 객체의 속성으로 정의된 메서드들을 호출해야한다.<br/>
하지만 위에 선언한 방식은 메서드로 ({...}) 안에 구현된 값을 반환하는 형태로 작성했다. 그것이 마이뽈트다..🤦‍♂️
<br/><br/>

```
actions: {
    .
    .
    .
}
```
