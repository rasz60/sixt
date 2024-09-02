```
class Solution {
    public int solution(int n) {
        int answer = 0;

        for ( int i = 0; i <= n; i++ ) {
            answer += n%2 == i%2 ? (i%2 == 0 ? i*i : i) : 0;
        }

        return answer;
    }
}
```
