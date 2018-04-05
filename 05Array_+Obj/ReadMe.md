### 요구사항 

Object 타입 ( { key: value} ) 도 지원한다.
배열안에 object, object안에 배열이 자유롭게 포함될 수 있다.
지금까지의 코드를 리팩토링한다.
복잡한 세부로직은 반드시 함수로 분리해본다.
최대한 작은 단위의 함수로 만든다.
중복된 코드역시 함수로 분리해서 일반화한다.
객체형태의 class로 만든다.
실행결과

```javascript

var s = "['1a3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]";
var result = ArrayParser(str);
console.log(JSON.stringify(result, null, 2));

```