```
import java.util.stream.IntStream;

class Solution {
    public int solution(int n) {
        int[] answer = IntStream
                .range(0, num_list.length)
                .map(i ->
                        num_list[(i + n) % num_list.length])
                .toArray();

        return answer;
}
```
