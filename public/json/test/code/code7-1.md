```
import java.util.stream.IntStream;

class Solution {
    public int[] solution(int n, int k) {
        int[] answer = IntStream
                            .range(1, n+1) // 1부터 n까지
                            .filter(i -> (i%k) == 0) // k의 배수인 경우
                            .toArray(); // 배열화
        return answer;
    }
}
```
