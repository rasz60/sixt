```
import java.util.stream.IntStream;

class Solution {
    public int solution(int n) {
        int answer = IntStream
                        .rangeClosed(0, n) // 0~n
                        .filter(i -> n%2 == i%2) // n과 i의 홀수/짝수 여부가 같을 때
                        .map(i -> i%2 == 0 ? i*i : i) // i가 짝수일 때만 제곱하기
                        .sum(); // 모든 수의 합

        return answer;
    }
}
```
