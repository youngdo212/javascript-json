# Json Parser
이 프로젝트는 javascript built-in JSON.parse 함수를 직접 구현한 프로젝트 입니다. JSON format의 기본 type인 String, Number, Array, Object, null을 동일하게 지원하며 배열과 객체의 중첩구조도 지원합니다. 그러나 실제 JSON.parse함수와는 다르게, parse함수의 인자로 전달되는 문자열에 escaping character가 포함된 경우를 지원하지 않습니다. 본 프로젝트에서 구현한 parse함수는 함수 인자로 전달 받은 문자열에 대해 개별 문자 단위로 순회하며 미리 [정의된 상태](#states)와 유효한 character set에 따라 문법 검사를 실행하며 [parser객체](#parser)에 존재하는 여러 tokenizing 메서드를 이용하여 문자열 형태의 token을 추출하고 type에 맞는 값으로 변환하여 반환될 객체의 프로퍼티 혹은 배열 원소로 추가해 나가며 parsing이 진행됩니다.

## Example
- run
``` shell
$node index.js
[ { "test": 123 , "test2": 0.2e-3 }, [true , false, null, { "test3": "abc" }] ]
```

- output:
```
총 2개의 배열 데이터 중에 객체 1개, 배열 1개가 포함되어 있습니다.
[
    {"test" : 123, "test2" : 0.0002},
    [
        true,
        false,
        null,
        {"test3" : "abc"}
    ]
]
```

## Modules
### state
- properties
  - name : String  
    해당 상태를 가리키는 문자열
  - validCharacters : Object or Array  
    해당 상태에서 유효한 문자 값들을 배열로 가진다.
  - nextState : Object or Array  
    validCharacters의 배열과 매핑되며 해당 문자를 입력받았을 때 파서의 다음 상태값에 대한 index를 가지고 있는 배열이다.

- methods
  - isNotValidCharacter(type, char)  
    return : true | false  
    매개변수로 입력받은 type을 파싱할 때, 현재 상태에서 char 문자가 유효하지 않은지 검사하는 메서드이다.
  - getNextState(type, char)  
    return : state  
    매개변수로 입력받은 type을 파싱할 때, 현재 상태에서 char 문자를 입력받은 다음에 파서가 가져야할 상태 객체를 리턴한다.

### states
미리 정의해둔 state 객체들을 담고있는 배열. parser객체의 state 프로퍼티가 아래의 상태값 중 하나를 가진다. 아래 상태와 유효한 문자 셋으로 문법 검사를 실행한다.

#### 상태(state) 정의
**1. INITIAL**  
: 입력 받기 전 초기 상태.

- array
  - ' ' => INITIAL
  - '[' => WAITING_FOR_INPUT_VALUE

- object
  - ' ' => INITIAL
  - '{' => WAITING_FOR_INPUT_KEY

**2. WAITING_FOR_INPUT_VALUE**  
: 배열의 element값 혹은 객체의 property값 입력 대기.

- array
  - ' ' => WAITING_FOR_INPUT_VALUE
  - '-' => ENCOUNTER_SIGN
  - '0' => ENCOUNTER_ZERO
  - '1~9' => ECOUNTER_NATURE_NUMBER
  - '\'' => (다음 따옴표 찾아서 건너 뜀) => WAITING_FOR_CONTINUE_OR_END
  - '\"' => (다음 쌍따옴표 찾아서 건너 뜀) => WAITING_FOR_CONTINUE_OR_END
  - '{' => (parse 재귀호출) => WAITING_FOR_CONTINUE_OR_END
  - '[' => (parse 재귀호출) => WAITING_FOR_CONTINUE_OR_END

- object
  - ' ' => WAITING_FOR_INPUT_VALUE
  - '-' => ENCOUNTER_SIGN
  - '0' => ENCOUNTER_ZERO
  - '1~9' => ECOUNTER_NATURE_NUMBER
  - '\"' => (다음 쌍따옴표 찾아서 건너 뜀) => WAITING_FOR_CONTINUE_OR_END
  - '{' => (parse 재귀호출) => WAITING_FOR_CONTINUE_OR_END
  - '[' => (parse 재귀호출) => WAITING_FOR_CONTINUE_OR_END

**3. WAITING_FOR_CONTINUE_OR_END**  
: 콤마(',')를 만나 추가적인 값을 입력받거나 괄호를 닫는 문자('}', ']')를 만나서 파싱을 종료할 수 있다.

- array
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_VALUE
  - ']' => END

- object
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_KEY
  - '}' => END

**4. WAITING_FOR_INPUT_KEY**  
: object를 파싱할 때만 가지는 상태값으로 프로퍼티의 키 값 입력을 대기. 공백과 쌍따옴표만 입력 가능.

- object
  - ' ' => WAITING_FOR_INPUT_KEY
  - '\"' => (다음 쌍따옴표 찾아서 건너 뜀) => ENCOUNTER_KEY

**5. ENCOUNTER_KEY**  
: 프로퍼티의 키 값을 입력받은 상태. 공백이나 콜론 문자만 입력 가능.

- object
  - ' ' => ENCOUNTER_KEY
  - ':' => WAITING_FOR_INPUT_VALUE

**6. ENCOUNTER_SIGN**  
: 부호 문자(+, -)를 입력받은 상태. 숫자만 입력 가능한 상태이다.

- '0' => ENCOUNTER_ZERO
- '1~9' => ECOUNTER_NATURE_NUMBER

**7. ENCOUNTER_ZERO**  
: 문자 '0'를 입력받은 상태. 뒤에 숫자가 올 수 없기 때문에 **ENCOUNTER_NATURE_NUMBER** 상태와 구분된다.

- array
  - '.' => ENCOUNTER_DOT
  - 'e' => ENCOUNTER_EXPONENT_SYMBOL
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_VALUE
  - ']' => END

- object
  - '.' => ENCOUNTER_DOT
  - 'e' => ENCOUNTER_EXPONENT_SYMBOL
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_KEY
  - '}' => END

**8. ENCOUNTER_DOT**  
: 문자 '.'를 입력받은 상태. 숫자만 입력 가능한 상태이다.

- '0~9' => ENCOUNTER_FRACTIONAL_PARTS

**9. ENCOUNTER_FRACTIONAL_PARTS**  
: '.'문자 다음의 실수부 문자 입력.

- array
  - '0~9' => ENCOUNTER_FRACTIONAL_PARTS
  - 'e' => ENCOUNTER_EXPONENT_SYMBOL
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_VALUE
  - ']' => END

- object
  - '0~9' => ENCOUNTER_FRACTIONAL_PARTS
  - 'e' => ENCOUNTER_EXPONENT_SYMBOL
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_KEY
  - '}' => END

**10. ECOUNTER_NATURE_NUMBER**  
: 1~9까지의 자연수를 입력받은 상태.

- array
  - '0~9' => ENCOUNTER_FRACTIONAL_PARTS
  - 'e' => ENCOUNTER_EXPONENT_SYMBOL
  - '.' => ENCOUNTER_DOT
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_VALUE
  - ']' => END

- object
  - '0~9' => ENCOUNTER_FRACTIONAL_PARTS
  - 'e' => ENCOUNTER_EXPONENT_SYMBOL
  - '.' => ENCOUNTER_DOT
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_KEY
  - '}' => END

**11. ENCOUNTER_EXPONENT_SYMBOL**  
: 지수표현문자 'e'를 입력받은 상태.

- '0~9' => ENCOUNTER_EXPONENT_SYMBOL
- '+' => ENCOUNTER_SIGN_OF_EXPONENT
- '-' => ENCOUNTER_SIGN_OF_EXPONENT

**12. ENCOUNTER_SIGN_OF_EXPONENT**  
: 'e'를 입력받은 이후에 부호 문자를 입력받은 상태. 부호문자 이후에 최소 1개의 숫자가 입력되는지 검증하기 위한 상태이다.

- '0~9' => ENCOUNTER_EXPONENT_VALUE

**13. ENCOUNTER_EXPONENT_VALUE**  
: 부호문자 이후에 최소 1개 이상의 숫자를 입력받은 상태이다. 추가로 숫자를 더 입력 받거나 종료할 수 있다.

- array
  - '0~9' => ENCOUNTER_EXPONENT_VALUE
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_VALUE
  - ']' => END

- object
  - '0~9' => ENCOUNTER_EXPONENT_VALUE
  - ' ' => WAITING_FOR_CONTINUE_OR_END
  - ',' => WAITING_FOR_INPUT_KEY
  - '}' => END

**14. END**

- methods
  - getStateByName(name : String)  
    인자로 전달받은 name과 일치하는 name프로퍼티 값을 가지는 state객체를 찾아 반환한다.

### parser
- properties
  - state : state
  - input : String
  - index : Number
  - depth : Number
  - resultObject : Object or Array
  - typeOfObject : String ('object' or 'array')

- methods
  - findIndexOfNextQuote()  
    현재 index 다음에 존재하는 quote를 찾아 index를 반환한다. 백슬래쉬로('\') escaping된 quote는 건너 뜀.
  - getStringToken()  
    quote를 만났을 때 호출하는 함수. 현재 index부터 다음 quote까지의 문자열 token을 반환.
  - getKeywordToken()  
    't' or 'f', 'n' 문자를 만났을 때 호출하는 함수. 각각 'true', 'false', 'null' 문자열 까지 tokenizing한 후에 비교하여 알맞은 값을 반환한다.
  - getContext()  
    parser 객체의 현재 프로퍼티 값을 담은 객체를 반환해 준다.
  - getObjectToken()  
    '{', '['를 만났을 때 호출하는 함수. 현재 index부터 재귀적으로 호출된 parse()메서드를 통해 parsing된 object를 token으로 반환한다.
  - parseToken()  
    token값의 type에 따라 primitive값 혹은 object값으로 변환하여 리턴한다.
  - getTypeOfObject()  
    현재 parsing중인 Object가 객체이면 'object', Array이면 'array'를 반환.
  - isEmptyObject()  
    현재 index이후에 나오는 배열 혹은 객체가 비이었는지 검사.
  - validateRestOfInput()  
    파싱 종료 후 나머지 문자가 모두 공백인지 검사.
  - parse(input)  
    파라미터로 입력받은 문자열을 반복문으로 순회하면서 각 문자에 알맞게 문법 검사, tokenizing, parsing 실행

## Testing
https://github.com/shine1594/javascript-json/blob/testing/data.json 데이터 1000개를 담은 배열을 JSON.parse()함수와 직접 구현한 parse()로 각각 100번 실행하여 소요된 시간을 측정함. [참조](https://github.com/shine1594/javascript-json/blob/testing/index.js)

- 실행 결과
``` shell
$node index.js
thisParser: 207.560ms
builtInParser: 94.431ms
*test2*
thisParser: 146.918ms
builtInParser: 72.031ms
*test3*
thisParser: 141.177ms
builtInParser: 29.255ms
*test4*
thisParser: 160.525ms
builtInParser: 30.837ms
*test5*
thisParser: 121.279ms
builtInParser: 27.000ms
*test6*
thisParser: 123.879ms
builtInParser: 15.720ms
*test7*
thisParser: 134.878ms
builtInParser: 17.012ms
*test8*
thisParser: 160.340ms
builtInParser: 29.693ms
*test9*
thisParser: 137.853ms
builtInParser: 13.843ms
*test10*
thisParser: 128.470ms
builtInParser: 25.734ms
...
```

첫 2번 실행시 속도차이가 2배 정도나지만 테스트 횟수가 3회 이상인 경우 차이가 점점 많이 나고 평균적으로는 built-in pase()함수가 직접 구현한 parse()함수 보다 평균적으로 7~8배 정도 빠른 것으로 보인다. built-in parse()함수가 점점 빨라지는 것은 내부 구현을 보지 못했지만 아마도 메모제이션 패턴을 이용하여 로직을 최적화한 것 같다. 직접 구한한 parse함수에 가독성을 포기하고 재귀 호출 대신 state변화로 중첩구조를 처리한다면 buit-in parse함수와 성능 차이가 크지 않게 만들 수 있을지 않을까 생각된다.
