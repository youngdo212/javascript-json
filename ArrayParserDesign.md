# 중첩된 배열을 위한 ArrayParser 설계
깊이에 따라 값을 따로 저장
```
result = {
  step1(깊이) : value(배열), 
  step2: [],
  step3: [],
  ...
}
```
### 변수
* result: 결과값
* temp: 배열에 추가될 값
* step: 깊이(0부터 시작)

### 로직
for(let i = 0; i < input.len; i++)

1. `[`을 만났을 때
    * 현재 배열에 다음 step 추가: result[step]에 step+1추가
    * 다음 깊이로 시작: result[step+1] 초기화
2. `]`을 만났을 때
    * 누적된 값(temp)를 현재 단계에 추가: result[step]에 temp추가
    * 전 단계로 내려 옴: step = step -1;
    * temp 초기화
3. `,` 경우
    * 누적된 값(temp)을 현재 단계에 추가 : result[step]에 temp추가
    * temp 초기화
4. ` ` (공백문자열)일 경우
    * continue
5. 해당사항없음
    * temp 생성: temp에 input[i]추가