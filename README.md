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