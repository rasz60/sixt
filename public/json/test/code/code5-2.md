```
import java.util.stream.IntStream;
class Solution {
    public int solution(int[] num_list) {
        int answer = IntStream
                        .range(0, num_list.length)
                        .filter(i -> num_list[i] < 0)
                        .findFirst()
                        .orElse(-1);

        return answer;
    }
}
```
