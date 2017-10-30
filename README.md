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
    문법 검사와 함께 double quote내에 존재하는 공백문자를 제외한 모든 공백을 제거한다.
    (아래 문법 검사 방법 참조)
  3. comma(,)단위로 입력값을 tokenize한 배열을 만든다.
  4. 배열을 순회하면서 아래 case들을 테스트한다.
    1. double quote로 시작해서 double quote로 끝나는가? //String인지 검사
      - [yes]: double quote를 제외한 값을 string 값으로 결과 배열에 저장.
      - [no]:  GOTO(4.2)
    2. 숫자인가?
      - [yes]: 해당 값을 Number type로 변환하여 결과 배열에 저장.
      - [no]: => GOTO(4.3)
    3. true || false?
      - [yes]: 해당 값을 boolean type으로 변환하여 결과 배열에 저장.
      - [no]: => GOTO(4)
  5. 결과 배열 출력.

- syntax 검사 방법
  아래 상태에 따라 다음에 읽은 문자열이 유효한지 아닌지 판별함.
  1. initial (초기 상태)
    - ' ' => initial
    - '[' => wait input

  2. waiting input (입력 대기)
    - ' ' => waiting input
    - '-' => encounter sign
    - '0' => encounter zero
    - '1~9' => encounter nature number
    - '\'' => encounter single quote
    - '/"' => encounter double quote
    - ']' => end

  3. waiting extra input (추가 입력 혹은 종료)
    - ' ' => waiting extra input
    - ',' => encounter comma
    - ']' => end

  4. encounter sign (부호 입력)
    - '0' => encounter zero
    - '1~9' => encounter nature number

  5. encounter zero (0 입력)
    - '.' => encounter dot
    - 'e' => encounter exponent symbol
    - ' ' => wating extra input
    - ',' => encounter comma
    - ']' => end

  6. encounter comma (콤마 입력)
    - ' ' => encounter comma
    - '-' => encounter sign
    - '0' => encounter zero
    - '1~9' => encounter nature number
    - '\'' => encounter single quote
    - '\"' => encounter double quote

  7. encounter dot (점 입력)
    - '0~9' => encounter fractional parts

  8. encounter fractional parts (실수부 입력)
    - '0~9' => encounter fractional parts
    - 'e' => encounter exponent symbol
    - ' ' => wating extra input
    - ',' => encounter comma
    - ']' => end

  9. encounter nature number (자연수 입력)
    - '0~9' => encounter nature number
    - 'e' => encounter exponent symbol
    - '.' => encounter dot
    - ' ' => wating extra input
    - ',' => encounter comma
    - ']' => end

  10. encounter exponent symbol (e 입력)
    - '0~9' => encounter exponent symbol
    - '+' => encounter sign of exponent
    - '-' => encounter sign of exponent

  11. encounter sign of exponent (e-notation 지수부 입력 최소한 숫자 1개 값이 들어오는지 검증)
    - '0~9' => encounter exponent value

  12. encounter exponent value (e-notation 지수부 입력)
    - '0~9' => encounter exponent value
    - ' ' => wating extra input
    - ',' => encounter comma
    - ']' => end

  13. encounter single quote (따옴표 입력)
    - '\*' => encounter single quote
    - '\'' => wating extra input

  14. encounter double quote (쌍따옴표 입력)
    - '\*' => encounter double quote
    - '\'' => wating extra input

  15. encounter boolean true ('t' 입력)
    - 'true' 문자열과 일치 => wating extra input
    - 'true' 문자열과 일치하지 않음 => Error

  16. encounter boolean false ('f' 입력)
    - 'false' 문자열과 일치 => wating extra input
    - 'false' 문자열과 일치하지 않음 => Error

  17. end (종료)
