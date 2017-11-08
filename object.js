const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});

const num = "0123456789";
const endvalue = [" ", ",", "]", "}"];

function readStr(input, i) { //문자열과 다음 i 반환, 에러는 -1 반환
    var pos = i;
    for (; i < input.length; i++) {
        if (input[i] === '"') {
            return [i, input.slice(pos, i)];
        }
        else if (input[i] === "'") {
            console.log("문자열 입력오류 pos ", i, " : ", input[i]);
            return -1; //process.exit();
        }
    }
}
function readNum(input, i) { //숫자와 다음 i 반환 , 에러는 -1 반환
    var pos = i;
    for (; i < input.length; i++) {
        if (endvalue.indexOf(input[i]) !== -1) {
            return [i, Number(input.slice(pos, i))];
        }
        else if (num.indexOf(input[i]) !== -1) { }
        else {
            console.log("숫자 읽기 에러 : ", input[i]);
            return -1;
        }
    }
}
function readBool(input, i) {//bool값과 다음 i 반환, 에러는 -1 반환
    var pos = i;
    for (; i < input.length; i++) {
        if (endvalue.indexOf(input[i]) !== -1) {
            tmp = input.slice(pos, i);
            if (tmp === 'true') return [i, true];
            else if (tmp === 'false') return [i, false];
            else {
                console.log("t/f 읽기 에러 : ", input[i]);
                return -1;
            }
        }
    }
}
var count = { num: 0, str: 0, bol: 0, arr: 0, obj: 0 };
function getObject(answer, start, nested) {
    var temp = {}, i = 0, length = answer.length;
    var depth = 0, state = "READY", key;
    if (start != undefined) i = start;
    for (; i < length; i++) {
        if (state === "READY") {
            if (answer[i] === "{") {
                depth++;
                state = "READ_KEY";
            }
        }
        else if (state == "READ_KEY") {
            console.log("KEY 읽기시작")
            if (answer[i] === '"') {
                var getstr = readStr(answer, i + 1);
                if (getstr === -1) {
                    return console.log("문자 읽기 에러 종료!");
                }
                else {
                    i = getstr[0];
                    key = getstr[1];
                    state = "READ_COLON";
                    console.log("KEY : ", key)
                }
            }
            else if (answer[i] === " ") continue;
            else {
                return console.log('key입력을 위해 "가 입력되야함!!');
            }
        }
        else if (state == "READ_COLON") {
            console.log("콜론 읽기 시작")
            if (answer[i] === " ") { continue; }
            else if (answer[i] === ":") {
                console.log("콜론찾음");
                state = "READ_VALUE";
            }
            else return console.log("콜론(:)이 입력되야함 i : ", i);
        }
        else if (state === "READ_VALUE") {
            console.log("벨류 읽는중 : ", answer[i]);
            if (answer[i] === "'") {
                console.log("에러 : ' 입력!");
            }
            else if (num.indexOf(answer[i]) !== -1) { //숫자가 들어옴
                console.log("숫자발견");
                var getnum = readNum(answer, i); //잘못된 숫자면 false를 반환
                if (getnum === -1) {
                    return console.log("숫자 읽기 에러 종료!");
                }
                else {
                    i = getnum[0] - 1;
                    temp[key] = getnum[1];
                    state = "READ_NEXT"; count.num++;
                }
            }
            else if (answer[i] === '"') { //문자열 읽기 시작
                var getstr = readStr(answer, i + 1);
                if (getstr === -1) {
                    return console.log("문자 읽기 에러 종료!");
                }
                else {
                    console.log("value : ", getstr[1]);
                    i = getstr[0];
                    state = "READ_NEXT", count.str++;
                    temp[key] = getstr[1];
                }
            }
            else if (answer[i] === "t" || answer[i] === "f") {
                var getbool = readBool(answer, i);
                if (getbool === -1) {
                    return console.log("true,false 읽기 에러 종료!");
                }
                else {

                    i = getbool[0] - 1;
                    state = "READ_NEXT", count.bol++;
                    temp[key] = getbool[1];
                }
            }
            else if (answer[i] === "{") {
                depth++;
                var getin = getObject(answer, i, 1);
                state = "READ_NEXT";
                temp[key] = getin[0];
                i = getin[1];
                console.log("중첩값 가져옴 i: ", i, " ", answer[i]);
            }
            else if (answer[i] === "}") {
                console.log("나가자");
                depth--;
                count.obj++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
        }
        else if (state === "READ_NEXT") {
            console.log("다음읽기 시작 i : ", i, " ", answer[i]);
            if (answer[i] === " ") continue;
            else if (answer[i] === ",") state = "READ_KEY";
            else if (answer[i] === "}") {
                console.log("중첩탈출 : ", temp);
                depth--;
                count.obj++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else return console.log('다음 입력값 에러! -> , " 입력 요구! i : ', i);
        }
    }
    count.obj++;
    return temp;
}
rl.question("분석할 JSON 데이터를 입력하세요 : ", function (answer) {
    var obj = getObject(answer);
    console.log(obj);
    console.log(count);
    rl.close();
});