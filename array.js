const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});

const num = "0123456789";
const endvalue = [" ", ",", "]", "}"];
var count = { num: 0, str: 0, bol: 0, arr: 0, obj: 0 };
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
function getArray(answer, start, nested) {
    var temp = [], i = 0, length = answer.length;
    var pos1 = null, state = "READY";
    if (start !== undefined) {
        i = start;
    }
    for (; i < length; i++) {
        if (state === "READY") {
            if (answer[i] === "[") {
                state = "READ";
            }
        }
        else if (state === "READ") {
            if (answer[i] === "'") {
                console.log("에러 : ' 입력!");
            }

            else if (num.indexOf(answer[i]) !== -1) { //숫자가 들어옴
                var getnum = readNum(answer, i); //잘못된 숫자면 false를 반환
                if (getnum === -1) {
                    return console.log("숫자 읽기 에러 종료!");
                }
                else {
                    i = getnum[0];
                    state = "READ"; count.num++;
                    temp.push(getnum[1]);
                }
            }
            else if (answer[i] === '"') {
                var getstr = readStr(answer, i + 1);
                if (getstr === -1) {
                    return console.log("문자 읽기 에러 종료!");
                }
                else {
                    i = getstr[0];
                    state = "READ", count.str++;
                    temp.push(getstr[1]);
                }
            }
            else if (answer[i] === "t" || answer[i] === "f") {
                var getbool = readBool(answer, i);
                if (getbool === -1) {
                    return console.log("true,false 읽기 에러 종료!");
                }
                else {
                    i = getbool[0];
                    state = "READ", count.bol++;
                    temp.push(getbool[1]);
                }
            }
            else if (answer[i] === "[") {
                var getin = getArray(answer, i, 1); //중첩값인가 인자를 보냄
                temp.push(getin[0]);
                i = getin[1];
            }
            else if (answer[i] === "]") {
                count.arr++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
        }
    }
    count.arr++;
    return temp;
}
rl.question("분석할 JSON 데이터를 입력하세요 : ", function (answer) {
    var arr = getArray(answer);
    console.log(arr);
    console.log(count);
    rl.close();
});