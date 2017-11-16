const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin, output: process.stdout
});
var tokenizer = require('./tokenizer.js');
var print = require('./print.js');

var jsonState = {
    i: 0,
    value: null,
    length: null,
    depth: 0,
    count: { num: 0, str: 0, bol: 0, arr: 0, obj: 0 },
}
function jsonParser(on) {
    var temp, state = "READY", key = null;
    on === 'array' ? temp = [] : temp = {};
    //if (start !== undefined) i = start;
    for (; jsonState.i < jsonState.length; jsonState.i++) {
        console.log("i : ", jsonState.i, " ", jsonState.value[jsonState.i]);
        var pos = jsonState.value[jsonState.i];
        if (state === "READY") {
            if (pos === "[" && on === "array") {
                jsonState.depth++;
                state = "READ_VALUE";
            }
            else if (pos === "{" && on === 'object') {
                jsonState.depth++;
                state = "READ_KEY";
            }
            else if (pos === "{" && on === 'array') {
                jsonState.depth++;
                //var getin = jsonParser('object');
                temp.push(jsonParser('object'));
                //temp.push(getin[0]);
                //i = getin[1];
                state = "READ_NEXT";
            }
            else if (pos === " ") continue;
            else return print.Error(pos, jsonState.i);
        }

        else if (state == "READ_KEY") {
            if (pos === '"') {
                //var getstr = tokenizer.readStr(jsonState, i + 1);
                jsonState.i++; //맞나
                var getstr = tokenizer.readStr(jsonState);
                if (getstr === -1) {
                    //return print.Error(pos, i);
                    return print.Error(pos, jsonState.i);
                }
                else {
                    //i = getstr[0];
                    //key = getstr[1];
                    key = getstr;
                    state = "READ_COLON";
                }
            }
            else if (pos === " ") continue;
            else {
                return print.Error(pos, jsonState.i);
            }
        }

        else if (state == "READ_COLON") {
            if (pos === " ") { continue; }
            else if (pos === ":") {
                state = "READ_VALUE";
            }
            else return print.Error(pos, jsonState.i);
        }

        else if (state === "READ_VALUE") {
            if (pos === "'") {
                print.Error(pos, jsonState.i);
            }
            else if (tokenizer.num.indexOf(pos) !== -1) { //숫자가 들어옴
                //var getnum = tokenizer.readNum(jsonState, i); //잘못된 숫자면 false를 반환
                var getnum = tokenizer.readNum(jsonState);
                if (getnum === -1) {
                    return console.log("숫자 읽기 에러 종료!");
                }
                else {
                    // i = getnum[0] - 1;
                    // on === "array" ? temp.push(getnum[1]) : temp[key] = getnum[1];
                    jsonState.i--;
                    on === "array" ? temp.push(getnum) : temp[key] = getnum;
                    state = "READ_NEXT"; jsonState.count.num++;
                }
            }
            else if (pos === '"') { //문자열 읽기 시작
                jsonState.i++;
                var getstr = tokenizer.readStr(jsonState);
                if (getstr === -1) {
                    return console.log("문자 읽기 에러 종료!");
                }
                else {
                    //i = getstr[0];
                    //on === "array" ? temp.push(getstr[1]) : temp[key] = getstr[1];
                    on === "array" ? temp.push(getstr) : temp[key] = getstr;
                    state = "READ_NEXT", jsonState.count.str++;
                }
            }
            else if (pos === "t" || pos === "f") {
                var getbool = tokenizer.readBool(jsonState);
                if (getbool === -1) {
                    return console.log("t/f 읽기 에러 종료!");
                }
                else {
                    // i = getbool[0] - 1;
                    // on === "array" ? temp.push(getbool[1]) : temp[key] = getbool[1];
                    jsonState.i--;
                    on === "array" ? temp.push(getbool) : temp[key] = getbool;
                    state = "READ_NEXT", jsonState.count.bol++;
                }
            }
            else if (pos === "[") {
                if (on === "array") {
                    jsonState.depth++;
                    // var getin = jsonParser(i, 1, "array");
                    // temp.push(getin[0]);
                    // i = getin[1];
                    temp.push(jsonParser("array"));
                    state = "READ_NEXT";
                }
                else if (on === "object") {
                    jsonState.depth++;
                    // var getin = jsonParser(i, 1, "array");
                    // temp[key] = getin[0];
                    // i = getin[1];
                    temp[key] = jsonParser("array");
                    state = "READ_NEXT";
                }
            }
            else if (pos === "]" && on === "array") {
                jsonState.depth--;
                jsonState.count.arr++;
                // if (nested == 1) return [temp, i];
                // else return temp;
                return temp;
            }
            else if (pos === "{") {
                jsonState.depth++;
                // var getin = jsonParser(i, 1, "object");
                // on === "array" ? temp.push(getin[0]) : temp[key] = getin[0];
                // i = getin[1];
                on === "array" ? temp.push(jsonParser("object")) : temp[key] = jsonParser("object");
                state = "READ_NEXT";
            }
            else if (pos === "}" && on === "object") {
                jsonState.depth--;
                jsonState.count.obj++;
                // if (nested == 1) return [temp, i];
                // else return temp;
                return temp;
            }
        }

        else if (state === "READ_NEXT") {
            if (pos === " ") continue;
            else if (pos === ",") {
                on === 'array' ? state = "READ_VALUE" : state = "READ_KEY";
                continue;
            }
            else if (pos === "]" && on === 'array') {
                jsonState.depth--; jsonState.count.arr++;
                // if (nested == 1) return [temp, i];
                // else return temp;
                return temp;
            }
            else if (pos === "}" && on === 'object') {
                jsonState.depth--; jsonState.count.obj++;
                // if (nested == 1) return [temp, i];
                // else return temp;
                return temp;
            }
            else return print.Error(pos, jsonState.i);
        }
    }
    if (jsonState.depth > 0) { console.log("1 Unexpected end of JSON input ", jsonState.i); process.exit() }
    on === 'array' ? jsonState.count.arr++ : jsonState.count.obj++;
    return temp;
}
rl.question("분석할 JSON 데이터를 입력하세요 : ", function (answer) {
    jsonState.value = answer;
    jsonState.length = jsonState.value.length;
    var result;
    if (answer[0] === "[") {
        result = [];
        result = jsonParser("array");
    }
    else if (answer[0] === "{") {
        result = {};
        result = jsonParser("object");
    }
    if (result !== undefined) {
        console.log("\n", result);
        //console.log("\n", jsonState.count);
        print.Count(result);
    }
    rl.close();
});

module.exports = jsonState;

//console.log(READY(1, "[", "array"));