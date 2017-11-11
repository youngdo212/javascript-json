const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});

var count = { num: 0, str: 0, bol: 0, arr: 0, obj: 0 };
var length;

function printError(token, position) {
    console.log("Unexpected token ", token, "at position ", position);
}
var tokenizer = {
    num: "0123456789",
    endvalue: [" ", ",", "]", "}"],
    readStr: function (input, i) {//문자열과 다음 i 반환, 에러는 -1 반환
        var pos = i;
        for (; i < length; i++) {
            if (input[i] === '"') {
                return [i, input.slice(pos, i)];
            }
        }
        console.log("Unexpected end of JSON input");
        process.exit();
    },
    readNum: function (input, i) { //숫자와 다음 i 반환 , 에러는 -1 반환
        var pos = i;
        for (; i < length; i++) {
            if (this.endvalue.indexOf(input[i]) !== -1) {
                return [i, Number(input.slice(pos, i))];
            }
            else if (this.num.indexOf(input[i]) !== -1) { }
            else {
                printError(input[i], i);
                return -1;
            }
        }
    },
    readBool: function (input, i) {//bool값과 다음 i 반환, 에러는 -1 반환
        var pos = i;
        for (; i < length; i++) {
            if (this.endvalue.indexOf(input[i]) !== -1) {
                tmp = input.slice(pos, i);
                if (tmp === 'true') return [i, true];
                else if (tmp === 'false') return [i, false];
                else {
                    printError(tmp, i);
                    return -1;
                }
            }
        }
    }
};
function getObject(answer, start, nested) {
    var temp = [], i = 0, depth = 0
    var state = "READY", key = null;

    if (start !== undefined) {
        i = start;
    }

    for (; i < length; i++) {
        if (state === "READY") {
            if (answer[i] === "{") {
                depth++;
                state = "READ_KEY";
            }
        }
        else if (state == "READ_KEY") {
            if (answer[i] === '"') {
                var getstr = tokenizer.readStr(answer, i + 1);
                if (getstr === -1) {
                    return console.log("문자 읽기중 에러 종료!");
                }
                else {
                    i = getstr[0];
                    key = getstr[1];
                    state = "READ_COLON";
                }
            }
            else if (answer[i] === " ") continue;
            else {
                return printError(answer[i], i);
            }
        }
        else if (state == "READ_COLON") {
            if (answer[i] === " ") { continue; }
            else if (answer[i] === ":") {
                state = "READ_VALUE";
            }
            else return printError(answer[i], i);
        }
        else if (state === "READ_VALUE") {
            if (answer[i] === "'") {
                printError(answer[i], i);

            }
            else if (answer[i] === "[") {
                depth++;
                var getin = getArray(answer, i, 1);
                temp[key] = getin[0];
                i = getin[1];
                state = "READ_NEXT";

            }
            else if (tokenizer.num.indexOf(answer[i]) !== -1) { //숫자가 들어옴
                var getnum = tokenizer.readNum(answer, i); //잘못된 숫자면 false를 반환
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
                var getstr = tokenizer.readStr(answer, i + 1);
                if (getstr === -1) {
                    return console.log("문자 읽기 에러 종료!");
                }
                else {
                    i = getstr[0];
                    state = "READ_NEXT", count.str++;
                    temp[key] = getstr[1];
                }
            }
            else if (answer[i] === "t" || answer[i] === "f") {
                var getbool = tokenizer.readBool(answer, i);
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
            }
            else if (answer[i] === "}") {
                depth--;
                count.obj++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
        }
        else if (state === "READ_NEXT") {
            if (answer[i] === " ") continue;
            else if (answer[i] === ",") state = "READ_KEY";
            else if (answer[i] === "}") {
                depth--;
                count.obj++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else return printError(answer[i], i);
        }
    }
    count.obj++;
    return temp;
}

function getArray(answer, start, nested) {
    var temp = [], i = 0, depth = 0;
    var state = "READY";

    if (start !== undefined) {
        i = start;
    }

    for (; i < length; i++) {
        if (state === "READY") {
            if (answer[i] === "[") {
                depth++;
                state = "READ";
            }
            else if (answer[i] === "{") {
                depth++;
                var getin = getObject(answer, i, 1);
                temp.push(getin[0]);
                i = getin[1];
                state = "READ_NEXT";
            }
            else if (answer[i] === " ") continue;
            else return console.log('시작오류 "{", "["로 시작해야함 : ', answer[i]);
        }
        else if (state === "READ") {
            if (answer[i] === "'") {
                console.log("Unexpected token ", answer[i], "at position ", i);
            }
            else if (tokenizer.num.indexOf(answer[i]) !== -1) { //숫자가 들어옴
                var getnum = tokenizer.readNum(answer, i); //잘못된 숫자면 false를 반환
                if (getnum === -1) {
                    return console.log("숫자 읽기 에러 종료!");
                }
                else {
                    i = getnum[0] - 1; temp.push(getnum[1]);
                    state = "READ_NEXT"; count.num++;
                }
            }
            else if (answer[i] === '"') { //문자열읽기 시작
                var getstr = tokenizer.readStr(answer, i + 1);
                if (getstr === -1) {
                    return console.log("문자 읽기 에러 종료!");
                }
                else {
                    i = getstr[0];
                    state = "READ_NEXT", count.str++;
                    temp.push(getstr[1]);
                }
            }
            else if (answer[i] === "t" || answer[i] === "f") {
                var getbool = tokenizer.readBool(answer, i);
                if (getbool === -1) {
                    return console.log("true,false 읽기 에러 종료!");
                }
                else {
                    i = getbool[0] - 1;
                    state = "READ_NEXT", count.bol++;
                    temp.push(getbool[1]);
                }
            }
            else if (answer[i] === "[") {
                depth++;
                var getin = getArray(answer, i, 1); //중첩값인가 인자를 보냄
                temp.push(getin[0]);
                i = getin[1];
            }
            else if (answer[i] === "]") {
                depth--;
                count.arr++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else if (answer[i] === "{") {
                depth++;
                var getin = getObject(answer, i, 1);
                temp.push(getin[0]);
                i = getin[1];
                state = "READ_NEXT";
            }
        }
        else if (state === "READ_NEXT") { //값 입력이 끝난후 종료 혹은 재입력
            if (answer[i] === " ") continue;
            else if (answer[i] === ",") {
                state = "READ";
            }
            else if (answer[i] === "]") {
                depth--;
                count.arr++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else return printError(answer[i], i);
        }
    }
    count.arr++;
    if (depth !== 0) { console.log("Unexpected end of JSON input"); process.exit() }
    return [temp, i];
}

rl.question("분석할 JSON 데이터를 입력하세요 : ", function (answer) {
    var result;
    length = answer.length;
    if (answer[0] === "[") {
        result = [];
        result = getArray(answer);
    }
    else if (answer[0] === "{") {
        result = {};
        result = getObject(answer);
    }
    if (result !== undefined) {
        console.log("\n", result);
        console.log("\n", count);
    }
    rl.close();
});