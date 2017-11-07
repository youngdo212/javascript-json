"use strict";
var rl = require('./rl.js');
var json_parse = require('./json_parse.js');
var json_stringify = require('./json_stringify.js');

rl.question('분석할 JSON 데이터를 입력하세요.\n', (answer) => {
    try {
        json = json_parse(answer);
        console.log(json_stringify(json));
    } catch (err) {
        console.log("지원하지 않는 형식을 포함하고 있습니다.");
    }
    rl.close();
});