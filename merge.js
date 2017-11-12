const tokenizer = require('./tokenizer.js');
const print = require('./print.js');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});

var depth = 0;
var count = { num: 0, str: 0, bol: 0, arr: 0, obj: 0 };

function jsonParser(answer, start, nested, on) {
    var temp, i = 0, state = "READY", key = null;
    on === 'array' ? temp = [] : temp = {};
    if (start !== undefined) i = start;
    for (; i < answer.length; i++) {
        if (state === "READY") {
            if (answer[i] === "[" && on === "array") {
                depth++;
                state = "READ_VALUE";
            }
            else if (answer[i] === "{" && on === 'object') {
                depth++;
                state = "READ_KEY";
            }
            else if (answer[i] === "{" && on === 'array') {
                depth++;
                var getin = jsonParser(answer, i, 1, 'object');
                temp.push(getin[0]);
                i = getin[1];
                state = "READ_NEXT";
            }
            else if (answer[i] === " ") continue;
            else return print.Error(input[i], i);//console.log('시작오류 "{", "["로 시작해야함 : ', answer[i], " i : ", i);
        }
        ///////////////////////////READ_KEY
        else if (state == "READ_KEY") {
            if (answer[i] === '"') {
                var getstr = tokenizer.readStr(answer, i + 1);
                if (getstr === -1) {
                    return print.Error(input[i], i);
                }
                else {
                    i = getstr[0];
                    key = getstr[1];
                    state = "READ_COLON";
                }
            }
            else if (answer[i] === " ") continue;
            else {
                return print.Error(answer[i], i);
            }
        }
        ///////////////////////////READ_COLON
        else if (state == "READ_COLON") {
            if (answer[i] === " ") { continue; }
            else if (answer[i] === ":") {
                state = "READ_VALUE";
            }
            else return print.Error(answer[i], i);
        }
        ///////////////////////////READ_VALUE
        else if (state === "READ_VALUE") {
            if (answer[i] === "'") {
                print.Error(answer[i], i);
            }
            else if (tokenizer.num.indexOf(answer[i]) !== -1) { //숫자가 들어옴
                var getnum = tokenizer.readNum(answer, i); //잘못된 숫자면 false를 반환
                if (getnum === -1) {
                    return console.log("숫자 읽기 에러 종료!");
                }
                else {
                    i = getnum[0] - 1;
                    on === "array" ? temp.push(getnum[1]) : temp[key] = getnum[1];
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
                    on === "array" ? temp.push(getstr[1]) : temp[key] = getstr[1];
                    state = "READ_NEXT", count.str++;
                }
            }
            else if (answer[i] === "t" || answer[i] === "f") {
                var getbool = tokenizer.readBool(answer, i);
                if (getbool === -1) {
                    return console.log("t/f 읽기 에러 종료!");
                }
                else {
                    i = getbool[0] - 1;
                    on === "array" ? temp.push(getbool[1]) : temp[key] = getbool[1];
                    state = "READ_NEXT", count.bol++;
                }
            }
            else if (answer[i] === "[") {
                if (on === "array") {
                    depth++;
                    var getin = jsonParser(answer, i, 1, "array");
                    temp.push(getin[0]);
                    i = getin[1];
                    state = "READ_NEXT";
                }
                else if (on === "object") {
                    depth++;
                    var getin = jsonParser(answer, i, 1, "array");
                    temp[key] = getin[0];
                    i = getin[1];
                    state = "READ_NEXT";
                }
            }
            else if (answer[i] === "]" && on === "array") {
                depth--;
                count.arr++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else if (answer[i] === "{") {
                depth++;
                var getin = jsonParser(answer, i, 1, "object");
                on === "array" ? temp.push(getin[0]) : temp[key] = getin[0];
                i = getin[1];
                state = "READ_NEXT";
            }
            else if (answer[i] === "}" && on === "object") {
                depth--;
                count.obj++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
        }
        ///////////////////////////READ_NEXT
        else if (state === "READ_NEXT") { //값 입력이 끝난후 종료 혹은 재입력
            if (answer[i] === " ") continue;
            else if (answer[i] === ",") {
                on === 'array' ? state = "READ_VALUE" : state = "READ_KEY";
                continue;
            }
            else if (answer[i] === "]" && on === 'array') {
                depth--; count.arr++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else if (answer[i] === "}" && on === 'object') {
                depth--; count.obj++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else return print.Error(answer[i], i);
        }
    }
    if (depth > 0) { console.log("Unexpected end of JSON input ", i); process.exit() }
    on === 'array' ? count.arr++ : count.obj++;
    return temp;

}
rl.question("분석할 JSON 데이터를 입력하세요 : ", function (answer) {
    var result;
    if (answer[0] === "[") {
        result = [];
        result = jsonParser(answer, 0, 0, "array");
    }
    else if (answer[0] === "{") {
        result = {};
        result = jsonParser(answer, 0, 0, "object");
    }
    if (result !== undefined) {
        console.log("\n", result);
        console.log("\n", count);
        print.Count(result);
    }

    rl.close();
});
