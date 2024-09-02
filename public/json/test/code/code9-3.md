```
class Solution {
    public int solution(int n) {
        int answer = 0;
            for(int i = n; i >= 0; i -= 2) // n부터 2씩 차감 -> i의 홀짝여부 확인 불필요해짐
                answer += (n % 2 == 0) ? i * i : i; // n의 홀짝 여부 확인하여 연산
        return answer;
    }
}
```
