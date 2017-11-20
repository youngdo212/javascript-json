var readline = require('readline');
var rl = readline.createInterface({
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

//var State = { READY: 0, READ: 1, READ_KEY: 2, READ_COLON: 3, READ_VALUE: 4, READ_NEXT_ARRAY: 5, READ_NEXT_OBJECT: 6 }
var State = ["READY", "READ", "READ_KEY", "READ_COLON", "READ_VALUE", "READ_NEXT_ARRAY", "READ_NEXT_OBJECT"];
var readState = {
    READ: function () {
        var pos = jsonState.value[jsonState.i];
        if (pos === "[") {
            jsonState.depth++; //줄일 수 있나?
            return "READ_VALUE";
        }
        else if (pos === "{") {
            jsonState.depth++;
            return "READ_KEY";
        }
        else return print.Error(pos, jsonState.i);
    },

    READ_KEY: function () {
        var pos = jsonState.value[jsonState.i];
        if (pos === '"') {
            jsonState.i++;
            var getstr = tokenizer.readStr(jsonState);
            if (getstr === -1) {
                print.Error(pos, jsonState.i);
                process.exit();
            }
            else {
                return [getstr, "READ_COLON"];
            }
        }
        else {
            print.Error(pos, jsonState.i);
            process.exit();
        }
    },
    READ_COLON: function () {
        var pos = jsonState.value[jsonState.i];
        if (pos === ":") {
            return "READ_VALUE";
        }
        else {
            print.Error(pos, jsonState.i);
            process.exit();
        }

    },

    READ_VALUE: function (type) { //너무 길다..
        var pos = jsonState.value[jsonState.i];
        var state;
        type === "array" ? state = "READ_NEXT_ARRAY" : state = "READ_NEXT_OBJECT";

        if (pos === "'") {
            print.Error(pos, jsonState.i);
            process.exit();
        }
        else if (tokenizer.num.indexOf(pos) !== -1) { //숫자가 들어옴
            var getnum = tokenizer.readNum(jsonState);//잘못된 숫자면 false를 반환
            if (getnum === -1) {
                console.log("숫자 읽기 에러 종료!");
                process.exit();
            }
            else {
                jsonState.i--;
                jsonState.count.num++;
                return [getnum, state];

            }
        }
        else if (pos === '"') { //문자열 읽기 시작
            jsonState.i++;
            var getstr = tokenizer.readStr(jsonState);
            if (getstr === -1) {
                console.log("문자 읽기 에러 종료!");
                process.exit();
            }
            else {
                jsonState.count.str++;
                return [getstr, state];
            }
        }
        else if (pos === "t" || pos === "f") {
            var getbool = tokenizer.readBool(jsonState);
            if (getbool === -1) {
                console.log("t/f 읽기 에러 종료!");
                process.exit();
            }
            else {
                jsonState.i--;
                jsonState.count.bol++;
                return [getbool, state];
            }
        }
        else if (pos === "[") {
            jsonState.depth++;
            return [jsonParser("array"), state];
        }
        else if (pos === "]") {
            if (type === "array") {
                jsonState.depth--;
                jsonState.count.arr++;
                return temp;
            }
            else {
                console.log("error!");
                process.exit();
            }
        }
        else if (pos === "{") {
            jsonState.depth++;
            return [jsonParser("object"), state];
        }
        else if (pos === "}" && type === "object") {
            jsonState.depth--;
            jsonState.count.obj++;
            return temp;
        }
    },

    READ_NEXT_ARRAY: function () {
        var pos = jsonState.value[jsonState.i];
        if (pos === ",") {
            return "READ_VALUE";
        }
        else if (pos === "]") {
            jsonState.depth--; jsonState.count.arr++;
            return "end";
        }
        else return print.Error(pos, jsonState.i);
    },
    READ_NEXT_OBJECT: function () {
        var pos = jsonState.value[jsonState.i];
        if (pos === ",") {
            return "READ_KEY";
        }
        else if (pos === "}") {
            jsonState.depth--; jsonState.count.obj++;
            return "end";
        }
        else return print.Error(pos, jsonState.i);
    }
}


function jsonParser(type) {
    var temp;
    var state = "READY";
    var key = null;

    type === 'array' ? temp = [] : temp = {};

    for (; jsonState.i < jsonState.length; jsonState.i++) {
        var pos = jsonState.value[jsonState.i];
        if (pos === " ") continue;
        switch (state) {
            case "READY":
                state = readState.READ();
                break;

            case "READ_KEY":
                var get = readState.READ_KEY(); //foreach 등으로 뺄수잇나?
                key = get[0];
                state = get[1];
                break;

            case "READ_COLON":
                state = readState.READ_COLON();
                break;

            case "READ_VALUE":
                var get = readState.READ_VALUE(type);
                type === "array" ? temp.push(get[0]) : temp[key] = get[0];
                state = get[1];
                break;

            case "READ_NEXT_ARRAY":
                var get = readState.READ_NEXT_ARRAY();
                if (get === "end") return temp;
                else state = get;
                break;

            case "READ_NEXT_OBJECT":
                var get = readState.READ_NEXT_OBJECT();
                if (get === "end") return temp;
                else state = get;
                break;
        }
    }

    if (jsonState.depth > 0) { console.log("Unexpected end of JSON input ", jsonState.i); process.exit() }
    type === 'array' ? jsonState.count.arr++ : jsonState.count.obj++;
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
