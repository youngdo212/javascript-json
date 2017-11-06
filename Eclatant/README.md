### 기본적인 구조 정리

`ParseError`
- 에러를 보여주기 위한 커스텀 객체

`isArray`
- 배열여부 검사

`isObject`
- 객체여부 검사

`isNum`
- 숫자여부 검사

`isBool`
- 불린여부 검사

`isStr`
- 문자여부 검사

`checkType`
- element 또는 value에 대한 타입 검사
- 숫자 -> 불린 -> 아니면 문자 순으로 체킹

`getCastedValue`
- `checkType`의 결과에 맞추어 해당하는 값을 리턴

`controller`
- try/catch 처리

`printCheckedResult`
- 검사결과를 바탕으로 출력

`checkArray`
- 배열 검사 로직
- Nested Array일 때,
  - [ 이 나오면 ]이 나올 때까지를 추출하여 `checkArray`의 인수로 전달하며 호출
- Nested Object일 때,
  - { 이 나오면 }이 나올 때까지를 추출하여 `checkObject`의 인수로 전달하며 호출
- ,를 시점에 지정한 구간의 데이터를 `checkType`에게 전달하여 검사결과를 받고, `getCastedValue`를 parsed에 저장

`checkObject`
- 객체 검사 로직
- Nested Array일 때,
  - [ 이 나오면 ]이 나올 때까지를 추출하여 `checkArray`의 인수로 전달하며 호출
- Nested Object일 때,
  - { 이 나오면 }이 나올 때까지를 추출하여 `checkObject`의 인수로 전달하며 호출
- ,를 시점에 지정한 구간의 데이터를 `checkType`에게 전달하여 검사결과를 받고, `getCastedValue`를 parsed에 저장

---

### 추가적인 요구사항을 만들어보고, 왜 실패하는지 파악해보자

`[ "a", [ "b" ], [ [ "c" ] ] ]` => `[ 'a', [ 'b' ], [], [] ]` / [ 가 몇 개 들어와있는지 체크하는 로직이 없어서 ]를 처음 만나는 순간 바로 처리하려고 함
`[ { "a" : [ "b" , { "c": { "d" : "e" } } ] } ]` => `[ [ 'b"', { d: 'e' }, {} ], {} ]`/ 상동
`[ 0.5 ]` => `[ 0 ]` / 소수점이 사라짐, 평소 숫자 변환에 `parseInt`를 사용한 탓
`[ 012345 ]` => `[ 12345 ]` / 0으로 시작하는 숫자에 대한 에러처리를 해주지 않은 탓
`[ 1 23 ]` => `[ 1 ]`/ `parseInt`로 처리하므로 결과가 이렇게 나오게 됨, 에러 처리 부족 및 숫자 변환에 보다 좋은 로직이 필요
`[ undefined ]` => `[ 'ndefine' ]` 숫자 또는 불린이 아닐 경우 모두 문자열로 처리하며, ""가 있을 것으로 생각하여 처리하므로 앞뒤 문자가 잘려서 보이는 것
