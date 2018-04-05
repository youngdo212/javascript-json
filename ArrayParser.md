# Array Parser 

  한 달 여 간 `JSON Parser` 함수를 제작하면서, 개발자라고 불리려면 아직 멀었다는 나의 위치를 자각했고, 크롱에게 난이도 조정을 요청했다. 그렇게  `JSON Parser` 함수 만들기 과제는 `Array Parser` 함수 만들기 과제로 바뀌며, 난이도가 하향 조정되었다. 그리고 이틀만에 과제를 수행(?)했다. 

---



### Array Parser란 

입력받은 문자열 중 [와 ]의 위치를 파악해 배열로 변환하는 프로그램이다.

---



### 설계 과정

1. 재귀를 통해 값을 반환하도록 함수를 설계했다. 먼저 initial 함수를 선언한다. initial 함수에는 2~5번의 순서가 포함되어 있다.

2. 입력할 텍스트 `val`을 trim 메서드를 이용해 정리한 뒤, val이 배열 형태인지 아닌지, 첫번째 문자열과 마지막 문자열을 체크한다.
   ![text](https://raw.githubusercontent.com/likedemian/Private-Studies/master/json-pics/text.png)
   ​


3. 만약 배열 형태로 구성된 텍스트라면, 첫 번째 문자열인 `[`과 마지막 문자열인 `]`을 제거한 뒤, 다시 val에 담아준다.
   ![emoveBracket](https://raw.githubusercontent.com/likedemian/Private-Studies/master/json-pics/removeBrackets.png)
   ​


4. 2번처럼 다듬어진 val을 switch-case문에 넣어 문자열을 탐색한다. 문자열 `[`을 만나면 stack이 1씩 증가도록, 문자열 `]` 을 만나면 stack이 1씩 감소하도록 설계했다(stack의 default는 0이다). 문자열을 체크하다가 `,`을 만났을 때( `case ",":` ), stack이 0이면, 문자열의 현재 위치값을 의미하는 cursor를 배열 arr (arr=[0]) 에 push하고, stack이 0이 아니면, `break`로 빠져나온다. 위 과정을 그림으로 표현하면 아래와 같다.
   ​

![parse](https://raw.githubusercontent.com/likedemian/Private-Studies/master/json-pics/parse01.png)



5. 그리고 배열 arr가 받은 cursor의 값을 이용해 val을 slice한다. slice로 얻은 새로운 값들은 배열 obj에 담는다. 배열 `obj[i]`의 첫번째 문자열이 `[`면 initial함수를 재귀로 호출하여 실행한다.
   ​


6. 반환된 값은 parsing함수의 val값으로 담는다. res가 담긴 배열 val은 아래처럼 구성되어 있다. val[0]의 3번째 인자`['11,[112233,[23424,[444,[23243]]]112]'`는 문자열이다. 문자열을 배열로 바꾸기 위해 val[1]을 val[0]의 3번째 인자에 대입한다. 마찬가지로 val[1]의 2번째 인자는 문자열이다. val[2]를 val[1]의 2번째 인자에 대입한다. 이 과정을 val[6]을 대입할 때 까지 반복한다.
   ​


![depth](https://raw.githubusercontent.com/likedemian/Private-Studies/master/json-pics/depths.png)


---



### Flow Chart

위 설계과정에 대한 flow chart다.

![flowchart](https://raw.githubusercontent.com/likedemian/Private-Studies/master/json-pics/flowchart.png)



---

### 결과

프로그램 실행 결과는 다음과 같다.

input : `[1,2,[[11,[112233,[23424,[444,[23243]]]],112],55, 99], 33]`

![result](https://raw.githubusercontent.com/likedemian/Private-Studies/master/json-pics/result.png)