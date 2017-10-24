"use strict";
var rl = require('./rl.js');

Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

function jsonParse(json) {
    var array = JSON.parse(json);
    var type = {
        "숫자": 0,
        "문자열": 0,
        "부울": 0
    };

    array.forEach(function (element) {
        typeof (element) === "boolean" ? type.부울++: Number.isInteger(element) ? type.숫자++ : type.문자열++;
    });

    var results = "총 " + array.length + "개의 데이터 중에 ";

    Object.keys(type).filter(function (key) {
        return type[key] !== 0
    }).map(function (key) {
        results += key + " " + type[key] +"개 ";
    });

    results += "포함되어 있습니다.";

    console.log(results);
}
rl.question('분석할 JSON 데이터를 입력하세요.\n', (answer) => {

    jsonParse(answer);

    rl.close();
});