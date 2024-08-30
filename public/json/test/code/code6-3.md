```
import java.util.*;
import java.util.stream.IntStream;

class Solution {
    public Integer[] solution(int start, int end) {
        return IntStream.rangeClosed(end, start).boxed().sorted(Comparator.reverseOrder()).toArray(Integer[]::new);
    }
}
```
