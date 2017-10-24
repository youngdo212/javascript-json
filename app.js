"use strict";
var rl = require('./rl.js');
var polyfill = require('./polyfill.js');

function printResult(type, parentType) {
    var total = Object.values(type).reduce(function (pre, cur) {
        return pre + cur;
    });
    var results = "총 " + total + "개의 " + parentType + " 데이터 중에 ";

    Object.keys(type).filter(function (key) {
        return type[key] !== 0
    }).map(function (key) {
        results += key + " " + type[key] + "개 ";
    });

    results += "포함되어 있습니다.";

    console.log(results);
}

var type = {
    "문자열": 0,
    "숫자": 0,
    "부울": 0,
    "객체": 0
};

function arrayParse(array) {
    array.forEach(function (element) {
        typeof (element) === "boolean" ? type.부울++: Number.isInteger(element) ? type.숫자++ : element.toString() === "[object Object]" ? type.객체++ : type.문자열++;
    });
    printResult(type, "배열");
}

function objectParse(object) {
    Object.keys(object).forEach(function (key) {
        var element = object[key];
        typeof (element) === "boolean" ? type.부울++: Number.isInteger(element) ? type.숫자++ : type.문자열++;
    });
    printResult(type, "객체");
}

function jsonParse(json) {
    var parsedJSON = JSON.parse(json);

    parsedJSON.toString() === "[object Object]" ? objectParse(parsedJSON) : arrayParse(parsedJSON);
}

jsonParse('[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOUN JISU", "alias" : "crong", "level" : 4, "married" : true } ]');
// rl.question('분석할 JSON 데이터를 입력하세요.\n', (answer) => {

//     jsonParse(answer);

//     rl.close();
// });