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
  2. 입력받은 전체 문자열을 loop로 돌면서 문법 검사와 파싱을 진행.
    - ',' 혹은 ']' 문자를 만나면 item을 결과 배열에 저장.
    - '{'를 만나면 parseObject() 결과를 item에 할당.
  3. 결과 array를 순회하면서 각 element의 type의 개수를 계산하여 출력.

- syntax 검사 방법
  아래 상태에 따라 다음에 읽은 문자열이 유효한지 아닌지 판별함.
  - initial (초기 상태)
    - ' ' => initial
    - '['
      - 빈 배열 이면 => end array
      - 빈 배열이 아니면 => waiting for input value

  - waiting for input value (입력 대기)
    - ' ' => waiting for input value
    - '-' => encounter sign
    - '0' => encounter zero
    - '1~9' => encounter nature number
    - '\'' => encounter single quote
    - '\"' => encounter double quote
    - '{' => validateObject() => waiting for continue or end

  - waiting for continue or end
    - ' ' => waiting for continue or end
    - ',' => waiting for input value
    - ']' => end array

  - encounter sign (부호 입력)
    - '0' => encounter zero
    - '1~9' => encounter nature number

  - encounter zero (0 입력)
    - '.' => encounter dot
    - 'e' => encounter exponent symbol

    - ' ' => waiting for continue or end
    - ',' => waiting for input value
    - ']' => end array

  - encounter dot (점 입력)
    - '0~9' => encounter fractional parts

  - encounter fractional parts (실수부 입력)
    - '0~9' => encounter fractional parts
    - 'e' => encounter exponent symbol

    - ' ' => waiting for continue or end
    - ',' => waiting for input value
    - ']' => end array

  - encounter nature number (자연수 입력)
    - '0~9' => encounter nature number
    - 'e' => encounter exponent symbol
    - '.' => encounter dot

    - ' ' => waiting for continue or end
    - ',' => waiting for input value
    - ']' => end array

  - encounter exponent symbol (e 입력)
    - '0~9' => encounter exponent symbol
    - '+' => encounter sign of exponent
    - '-' => encounter sign of exponent

  - encounter sign of exponent (e-notation 지수부 입력 최소한 숫자 1개 값이 들어오는지 검증)
    - '0~9' => encounter exponent value

  - encounter exponent value (e-notation 지수부 입력)
    - '0~9' => encounter exponent value

    - ' ' => waiting for continue or end
    - ',' => waiting for input value
    - ']' => end array

  - encounter double quote (쌍따옴표 입력)
    - 다음 쌍따옴표 찾아서 건너뜀 => waiting for continue or end
    - 따옴표 못찾으면 Error

  - encounter boolean true ('t' 입력)
    - 'true' 문자열과 일치 => waiting for continue or end
    - 'true' 문자열과 일치하지 않음 => Error

  - encounter boolean false ('f' 입력)
    - 'false' 문자열과 일치 => waiting for continue or end
    - 'false' 문자열과 일치하지 않음 => Error

  - end array

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
  2. 입력받은 전체 문자열을 loop로 돌면서 문법 검사와 파싱을 진행.
    - input key 상태에서 waiting value로 넘어갈때 key값 저장
    - waiting for continue or end 상태가 되면 결과 object에 property값 할당.
  3. 결과 object의 프로퍼티를 순회하면서 각 프로퍼티의 type의 개수를 계산하여 출력.

## syntax 검사 방법
아래 상태에 따라 다음에 읽은 문자열이 유효한지 아닌지 판별함.

- initial (초기 상태)
  - ' ' => initial
  - '{'
    - 빈 객체이면 => end
    - 빈 객체가 아니면 => waiting for input key

- waiting for input key
  - ' ' => waiting for input key
  - '\"' => encounter key

- waiting for continue or end
  - ' ' => waiting for continue or end
  - ',' => waiting for input key
  - '}' => end object

- waiting for input value
  - ' ' => waiting for input value
  - '-' => encounter sign
  - '0' => encounter zero
  - '1~9' => encounter nature number
  - '/"' => encounter double quote
  - '{' => validateObject() => waiting for continue or end
  - '[' => validateArray() => waiting for continue or end

- encounter key
  - 다음 쌍따옴표 찾아서 건너뜀
    - ' ' => encounter key
    - ':' => waiting for input value
  - 따옴표 못찾으면 Error

- encounter sign (부호 입력)
  - '0' => encounter zero
  - '1~9' => encounter nature number

- encounter zero (0 입력)
  - '.' => encounter dot
  - 'e' => encounter exponent symbol

  - ' ' => waiting for continue or end
  - ',' => waiting for input key
  - '}' => end object

- encounter dot (점 입력)
  - '0~9' => encounter fractional parts

- encounter fractional parts (실수부 입력)
  - '0~9' => encounter fractional parts
  - 'e' => encounter exponent symbol

  - ' ' => waiting for continue or end
  - ',' => waiting for input key
  - '}' => end object

- encounter nature number (자연수 입력)
  - '0~9' => encounter nature number
  - 'e' => encounter exponent symbol
  - '.' => encounter dot

  - ' ' => waiting for continue or end
  - ',' => waiting for input key
  - '}' => end object

- encounter exponent symbol (e 입력)
  - '0~9' => encounter exponent symbol
  - '+' => encounter sign of exponent
  - '-' => encounter sign of exponent

- encounter sign of exponent (e-notation 지수부 입력 최소한 숫자 1개 값이 들어오는지 검증)
  - '0~9' => encounter exponent value

- encounter exponent value (e-notation 지수부 입력)
  - '0~9' => encounter exponent value

  - ' ' => waiting for continue or end
  - ',' => waiting for input key
  - '}' => end object

- encounter double quote (쌍따옴표 입력)
  - 다음 쌍따옴표 찾아서 건너뜀 => waiting for continue or end
  - 따옴표 못찾으면 Error

- encounter boolean true ('t' 입력)
  - 'true' 문자열과 일치 => waiting for continue or end
  - 'true' 문자열과 일치하지 않음 => Error

- encounter boolean false ('f' 입력)
  - 'false' 문자열과 일치 => waiting for continue or end
  - 'false' 문자열과 일치하지 않음 => Error

- end object
