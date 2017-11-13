const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});
var tokenizer = require('./tokenizer.js');
var print = require('./print.js');

var depth = 0;
var count = { num: 0, str: 0, bol: 0, arr: 0, obj: 0 };
var jsonState = {
    i: 0,
    value: null,
    length: null,
    depth: 0,
    count: { num: 0, str: 0, bol: 0, arr: 0, obj: 0 },
}
function READY(i) { }
function jsonParser(start, nested, on) {
    var temp, i = 0, state = "READY", key = null;
    on === 'array' ? temp = [] : temp = {};
    if (start !== undefined) i = start;
    for (; i < jsonState.length; i++) {
        if (state === "READY") {
            if (jsonState.value[i] === "[" && on === "array") {
                depth++;
                state = "READ_VALUE";
            }
            else if (jsonState.value[i] === "{" && on === 'object') {
                depth++;
                state = "READ_KEY";
            }
            else if (jsonState.value[i] === "{" && on === 'array') {
                depth++;
                var getin = jsonParser(i, 1, 'object');
                temp.push(getin[0]);
                i = getin[1];
                state = "READ_NEXT";
            }
            else if (jsonState.value[i] === " ") continue;
            else return print.Error(jsonState.value[i], i);
        }

        else if (state == "READ_KEY") {
            if (jsonState.value[i] === '"') {
                var getstr = tokenizer.readStr(jsonState, i + 1);
                if (getstr === -1) {
                    return print.Error(jsonState.value[i], i);
                }
                else {
                    i = getstr[0];
                    key = getstr[1];
                    state = "READ_COLON";
                }
            }
            else if (jsonState.value[i] === " ") continue;
            else {
                return print.Error(jsonState.value[i], i);
            }
        }

        else if (state == "READ_COLON") {
            if (jsonState.value[i] === " ") { continue; }
            else if (jsonState.value[i] === ":") {
                state = "READ_VALUE";
            }
            else return print.Error(jsonState.value[i], i);
        }

        else if (state === "READ_VALUE") {
            if (jsonState.value[i] === "'") {
                print.Error(jsonState.value[i], i);
            }
            else if (tokenizer.num.indexOf(jsonState.value[i]) !== -1) { //숫자가 들어옴
                var getnum = tokenizer.readNum(jsonState, i); //잘못된 숫자면 false를 반환
                if (getnum === -1) {
                    return console.log("숫자 읽기 에러 종료!");
                }
                else {
                    i = getnum[0] - 1;
                    on === "array" ? temp.push(getnum[1]) : temp[key] = getnum[1];
                    state = "READ_NEXT"; count.num++;
                }
            }
            else if (jsonState.value[i] === '"') { //문자열 읽기 시작
                var getstr = tokenizer.readStr(jsonState, i + 1);
                if (getstr === -1) {
                    return console.log("문자 읽기 에러 종료!");
                }
                else {
                    i = getstr[0];
                    on === "array" ? temp.push(getstr[1]) : temp[key] = getstr[1];
                    state = "READ_NEXT", count.str++;
                }
            }
            else if (jsonState.value[i] === "t" || jsonState.value[i] === "f") {
                var getbool = tokenizer.readBool(jsonState, i);
                if (getbool === -1) {
                    return console.log("t/f 읽기 에러 종료!");
                }
                else {
                    i = getbool[0] - 1;
                    on === "array" ? temp.push(getbool[1]) : temp[key] = getbool[1];
                    state = "READ_NEXT", count.bol++;
                }
            }
            else if (jsonState.value[i] === "[") {
                if (on === "array") {
                    depth++;
                    var getin = jsonParser(i, 1, "array");
                    temp.push(getin[0]);
                    i = getin[1];
                    state = "READ_NEXT";
                }
                else if (on === "object") {
                    depth++;
                    var getin = jsonParser(i, 1, "array");
                    temp[key] = getin[0];
                    i = getin[1];
                    state = "READ_NEXT";
                }
            }
            else if (jsonState.value[i] === "]" && on === "array") {
                depth--;
                count.arr++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else if (jsonState.value[i] === "{") {
                depth++;
                var getin = jsonParser(i, 1, "object");
                on === "array" ? temp.push(getin[0]) : temp[key] = getin[0];
                i = getin[1];
                state = "READ_NEXT";
            }
            else if (jsonState.value[i] === "}" && on === "object") {
                depth--;
                count.obj++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
        }

        else if (state === "READ_NEXT") {
            if (jsonState.value[i] === " ") continue;
            else if (jsonState.value[i] === ",") {
                on === 'array' ? state = "READ_VALUE" : state = "READ_KEY";
                continue;
            }
            else if (jsonState.value[i] === "]" && on === 'array') {
                depth--; count.arr++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else if (jsonState.value[i] === "}" && on === 'object') {
                depth--; count.obj++;
                if (nested == 1) return [temp, i];
                else return temp;
            }
            else return print.Error(jsonState.value[i], i);
        }
    }
    if (depth > 0) { console.log("Unexpected end of JSON input ", i); process.exit() }
    on === 'array' ? count.arr++ : count.obj++;
    return temp;
}
rl.question("분석할 JSON 데이터를 입력하세요 : ", function (answer) {
    jsonState.value = answer;
    jsonState.length = jsonState.value.length;
    var result;
    console.log(jsonState.value);
    if (answer[0] === "[") {
        result = [];
        result = jsonParser(0, 0, "array");
    }
    else if (answer[0] === "{") {
        result = {};
        result = jsonParser(0, 0, "object");
    }
    if (result !== undefined) {
        console.log("\n", result);
        //console.log("\n", count);
        print.Count(result);
    }
    rl.close();
});

module.exports = jsonState;