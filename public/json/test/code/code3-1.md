```
class Solution {
    public int solution(int n) {
        int answer = 0;


        for ( int i = 0; (i*i) <= n; i++ )
            answer = i*i == n ? 1 : 2;

        return answer;
    }
}
```
