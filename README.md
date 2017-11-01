# javascript-json

## Array 분석
- 목적 : 배열의 선언을 문자열로 입력받아 문법이 유효한지 검사하고 입력한 데이터들의 type을 판별하여 각각의 개수를 출력한다.

- 요구사항 분석
  1. 대괄호의 열고 닫음이 올바른지 확인할 수 있어야 한다.
  2. double quote의 열고 닫음이 올바른지 확인할 수 있어야 한다.
  3. 공백을 처리할 수 있어야 한다.
  4. 문자열로 입력된 데이터들을 comma(,)단위로 나눌 수 있어야 한다.
  5. 데이터의 type을 판별할 수 있어야 한다.

- flow chart
  1. 사용자로부터 데이터를 문자열로 입력 받는다.
  2. 입력받은 전체 문자열을 loop로 돌면서 문법을 검사한다.
    (아래 문법 검사 방법 참조)
  3. 문법 검사 통과?
    - [yes]: GOTO(4)
    - [no]: Error
  4. 문법 검사를 완료한 입력을 다시 순회하면서 만나는 각 문자에 따라 아래 로직 실행
    - 따옴표('\'' OR '\"')
      닫는 따옴표를 찾아 문자열을 결과 배열에 저장한 후 loop index도 그 다음으로 이동.
    - 숫자(0~9)
      다음 콤마 혹은 닫는 대괄호(']')를 찾아 숫자 값을 Number type으로 변환한 후 결과 배열에 저장. loop index를 숫자값 다음으로 이동.
    - 't'
      true값을 결과 배열에 저장한 후 'true'문자열 다음으로 loop index를 이동.
    - 'f'
      false값을 결과 배열에 저장한 후 'false'문자열 다음으로 loop index를 이동.
    - 나머지 문자
      loop index++
  5. 결과 배열을 순회하면서 각 요소의 type의 개수를 계산하여 출력.

- syntax 검사 방법
  아래 상태에 따라 다음에 읽은 문자열이 유효한지 아닌지 판별함.
  - initial (초기 상태)
    - ' ' => initial
    - '['
      - 다음 문자가 ']'이면 => end array
      - 아니면 => waiting input item

  - waiting input item (입력 대기)
    - ' ' => waiting input item
    - '{' => validateObject() => waiting for continue or end
    - '-' => encounter sign
    - '0' => encounter zero
    - '1~9' => encounter nature number
    - '\'' => encounter single quote
    - '\"' => encounter double quote

  - waiting for continue or end
    - ' ' => waiting for continue or end
    - ',' => waiting input item
    - ']' => end

  - encounter sign (부호 입력)
    - '0' => encounter zero
    - '1~9' => encounter nature number

  - encounter zero (0 입력)
    - '.' => encounter dot
    - 'e' => encounter exponent symbol

    - ',' => waiting input item
    - ']' => end

  - encounter dot (점 입력)
    - '0~9' => encounter fractional parts

  - encounter fractional parts (실수부 입력)
    - '0~9' => encounter fractional parts
    - 'e' => encounter exponent symbol

    - ',' => waiting input item
    - ']' => end

  - encounter nature number (자연수 입력)
    - '0~9' => encounter nature number
    - 'e' => encounter exponent symbol
    - '.' => encounter dot

    - ',' => waiting input item
    - ']' => end

  - encounter exponent symbol (e 입력)
    - '0~9' => encounter exponent symbol
    - '+' => encounter sign of exponent
    - '-' => encounter sign of exponent

  - encounter sign of exponent (e-notation 지수부 입력 최소한 숫자 1개 값이 들어오는지 검증)
    - '0~9' => encounter exponent value

  - encounter exponent value (e-notation 지수부 입력)
    - '0~9' => encounter exponent value

    - ',' => waiting input item
    - ']' => end

  - encounter double quote (쌍따옴표 입력)
    - 다음 쌍따옴표 찾아서 건너뜀 => waiting for continue or end
    - 따옴표 못찾으면 Error

  - encounter boolean true ('t' 입력)
    - 'true' 문자열과 일치 => waiting for continue or end
    - 'true' 문자열과 일치하지 않음 => Error

  - encounter boolean false ('f' 입력)
    - 'false' 문자열과 일치 => waiting for continue or end
    - 'false' 문자열과 일치하지 않음 => Error

  - end

## Object 분석
- 목적 : 객체를 문자열 형태로 입력받아 문법이 유효한지 검사하고 입력한 프로퍼티들의 type을 판별하여 각각의 개수를 출력한다.

- 요구사항 분석
  1. 위에서 구현한 배열 파싱기능을 유지할 것.
  2. 중괄호의 쌍이 알맞은지 확인 가능해야 함.
  3. property key값이 반드시 쌍따옴표로 표현한 문자열인지 검사해야 함.
  4. 콜론(':')의 위치가 올바른지 검사해야 함.
  5. property value값은 숫자, 문자열, boolean값만 지원.
  6. property value가 문자열일때 double quotes 표현식만 가능
  7. 객체들을 배열에 담을 수 있어야 함.

- flow chart
  1. 사용자로부터 데이터를 문자열로 입력 받는다.
  2. 입력받은 전체 문자열을 loop로 돌면서 문법을 검사한다.
    (아래 문법 검사 방법 참조)
  3. 문법 검사 통과?
    - [yes]: GOTO(4)
    - [no]: Error
  4. 문법 검사를 완료한 입력을 다시 순회하면서 만나는 각 문자에 따라 아래 로직 실행
    - 따옴표('\'' OR '\"')
      1. 다음 콤마(',') 혹은 닫는 중괄호('}')(콤마가 존재하지 않으면) 앞까지 문자열 잘라냄.
      2. 콜론(':')을 기준으로 문자열을 다시 잘라냄.
      3. key 값에 해당하는 문자열 추출
      4. value 값에 해당하는 문자열 추출
      5. 결과 object 프로퍼티 추가
    - 나머지 문자
      loop index++
  5. 결과 object의 프로퍼티를 순회하면서 각 프로퍼티의 type의 개수를 계산하여 출력.

## syntax 검사 방법
아래 상태에 따라 다음에 읽은 문자열이 유효한지 아닌지 판별함.

- initial (초기 상태)
  - ' ' => initial
  - '{'
    - 다음 문자가 '}'이면 => end
    - 아니면 => waiting input key

- waiting input key
  - ' ' => waiting input key
  - '\"' => input key

- input key
  - 다음 쌍따옴표 찾아서 건너뜀
    - 다음 문자가 콜론':' => waiting value
    - 다음 문자가 콜론이 아니면 Error
  - 따옴표 못찾으면 Error

- waiting value
  - ' ' => waiting value
  - '-' => encounter sign
  - '0' => encounter zero
  - '1~9' => encounter nature number
  - '/"' => encounter double quote

- encounter sign (부호 입력)
  - '0' => encounter zero
  - '1~9' => encounter nature number

- encounter zero (0 입력)
  - '.' => encounter dot
  - 'e' => encounter exponent symbol

  - ' ' => waiting for continue or end
  - ',' => waiting input key
  - '}' => end

- waiting for continue or end
  - ' ' => waiting for continue or end
  - ',' => waiting input key
  - '}' => end

- encounter dot (점 입력)
  - '0~9' => encounter fractional parts

- encounter fractional parts (실수부 입력)
  - '0~9' => encounter fractional parts
  - 'e' => encounter exponent symbol

  - ' ' => waiting for continue or end
  - ',' => waiting input key
  - '}' => end

- encounter nature number (자연수 입력)
  - '0~9' => encounter nature number
  - 'e' => encounter exponent symbol
  - '.' => encounter dot

  - ' ' => waiting for continue or end
  - ',' => waiting input key
  - '}' => end

- encounter exponent symbol (e 입력)
  - '0~9' => encounter exponent symbol
  - '+' => encounter sign of exponent
  - '-' => encounter sign of exponent

- encounter sign of exponent (e-notation 지수부 입력 최소한 숫자 1개 값이 들어오는지 검증)
  - '0~9' => encounter exponent value

- encounter exponent value (e-notation 지수부 입력)
  - '0~9' => encounter exponent value

  - ' ' => waiting for continue or end
  - ',' => waiting input key
  - '}' => end

- encounter double quote (쌍따옴표 입력)
  - 다음 쌍따옴표 찾아서 건너뜀 => waiting for continue or end
  - 따옴표 못찾으면 Error

- encounter boolean true ('t' 입력)
  - 'true' 문자열과 일치 => waiting for continue or end
  - 'true' 문자열과 일치하지 않음 => Error

- encounter boolean false ('f' 입력)
  - 'false' 문자열과 일치 => waiting for continue or end
  - 'false' 문자열과 일치하지 않음 => Error

- end
