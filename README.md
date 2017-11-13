# javascript-json
## 코드스쿼드 레벨2 과제
## TODO
- 에러처리 변경
~~~
  if (jsonData.parsingLetter === '"') return "String";
  if (/-|[1-9]/.test(jsonData.parsingLetter)) return "Number";
  if (/t|f/i.test(jsonData.parsingLetter)) return "Bool";
  throw new Error(errors.typeError);
~~~
  - 위와 같이 기본적으로 조건을 충족시키지 못하면 에러처리를 하는 것을 예외적인 상황을 검사해 에러처리를 하는 것으로 전체적으로 변경할 필요가 있다.
- jsonParser 객체 의존성 개선
  - 모든 메서드의 의존성이 복잡하게 맞물려있어 의존성 문제를 해결하지 않으면 코드 구조 개선이 어렵다.
  - 토크나이징 동작을 분리하는 것으로 개선 방향을 잡을 수 있을 것 같다.