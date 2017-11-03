/*1차
allread 상태에서 시작 
띄어쓰기 외에 특정문자의 받음 . 
    
    숫자 -> 그다음에 숫자 , ] , 띄어쓰기 옴, state는 inNumber ->  num에 있는 값 읽기모드, 띄어쓰기가 온 경우는 ,나 ]만 올수잇음
    처음시작할때 pos1에 index저장,  ,가 오거나 ] 가 오면 pos2에 인덱스 저장 -> 추출기로 값 추출

    " -> '를 제외한 모든 문자의 받음. state 는  inString 
    처음시작할때 pos1에 index저장 , "가 오면 pos2에 index를 저장 -> 추출기로 값 추출
    
    ] 가 오면 종료

*/
//pos2 가 저장될때 -> 새로운배열.push(pos1~pos2) //pos1부터 그냥 temp에 push 해도 되지 않을까?
/*2차
state 0 시작전 [를 만나면 state 1로 전환하고 continue
state 1 시작 읽기모드 all read -> test[i] == " "(공백) 이면 continue 
다음것 만났을때 if indexof num , elseif test[i] == "" , elseif t or f  , pos1에 i를 저장
state 2 숫자를 읽기시작 다음은 num안에서 옴 -> 공백 , ] 가 오면 pos2에 i-1을 저장, num++
state 3 스트링을 읽기시작 -> "가 오면 state 1로 수정 하고 pos2에 i-1을 저장, str++
state 4 true false 읽기 시작 -> 공백이 오면 1로 수정하고 pos2에 i-1을, bol++ 
*/
const de = 0;
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});

var test = '["ab","g",true,"bac",123]';
const num = "0123456789";
var bool = ["true", "false"];

function token(answer) {
    var temp = [], i, length = answer.length;
    var count = { num: 0, str: 0, bol: 0 };
    var pos1 = null, pos2 = null, state = 0;
    for (i = 0; i < length; i++) {
        de && console.log(answer[i], " state : ", state);
        if (state === 0) {
            if (answer[i] === "[") {
                de && console.log("읽기시작");
                state = 1;
            }
        }
        else if (state === 1) {
            if (answer[i] === " ") {
                de && console.log("공백!");
            }
            else if (num.indexOf(answer[i]) !== -1) { //숫자가 들어옴
                de && console.log("숫자시작");
                pos1 = i;
                state = 2;
            }
            else if (answer[i] === '"') {
                de && console.log("문자시작");
                pos1 = i;
                state = 3;
            }
            else if (answer[i] === "t" || answer[i] === "f") {
                de && console.log("t/f 시작");
                pos1 = i;
                state = 4;
            }
        }
        else if (state === 2) {
            de && console.log("숫자읽기중");
            if (answer[i] === "]") {
                de && console.log("숫자 탈출!");
                pos2 = i; count.num++;
                temp.push(Number(answer.slice(pos1, pos2)));
                state = 0;
            }
            else if (answer[i] === ',') {
                de && console.log("숫자 탈출, 읽기시작!");
                pos2 = i;
                temp.push(Number(answer.slice(pos1, pos2)));
                state = 1; count.num++;
            }
        }
        else if (state === 3) {
            de && console.log("문자읽기중");
            if (answer[i] === '"') {
                de && console.log("문자 탈출!");
                pos2 = i;
                temp.push(answer.slice(pos1 + 1, pos2));
                state = 1; count.str++;
            }
        }
        else if (state === 4) {
            de && console.log("true,false 읽기중");
            if (answer[i] === " " || answer[i] === "e") {
                de && console.log("true false 탈출!");
                pos2 = i + 1;
                if (answer.slice(pos1, pos2) == "true") {
                    temp.push(true);
                }
                else temp.push(false);
                state = 1; count.bol++;
            }
        }
        de && console.log("------------");
    }
    console.log(temp);
    console.log(count);
}
rl.question("분석할 JSON 데이터를 입력하세요 : ", function (answer) {
    token(answer);
    rl.close();
});