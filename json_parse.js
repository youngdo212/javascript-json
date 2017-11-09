var polyfill = require('./polyfill.js');

var json_parse = (function () {
    "use strict";

    var text;
    var at;
    var ch;
    var type;
    var depth;


    function printResult(parentType) {
        var partial = [];
        var total = 0;
        Object.keys(type).filter(function (key) {
            return type[key] !== 0
        }).forEach(function (key) {
            var value = type[key];
            total += value;
            partial.push(key + " " + value + "개");
        });
        console.log(`총 ${total}개의 ${parentType} 데이터 중에 ${partial.join(", ")}가 포함되어 있습니다.`);
    };

    function array() {
        var arr = [];
        if (ch === "[") {
            next("[");
            white();
            if (ch === "]") {
                next("]");
                return arr;
            }
            while (ch) {
                arr.push(value());
                white();
                if (ch === "]") {
                    next("]");
                    return arr;
                }
                next(",");
                white();
            }
        }
        throw new Error("Bad array");
    };

    function object() {
        var obj = {};
        if (ch === "{") {
            next("{");
            white();
            if (ch === "}") {
                next("}");
                return obj;
            }
            while (ch) {
                var key = string();
                white();
                next(":");
                obj[key] = value();
                white();
                if (ch === "}") {
                    next("}");
                    return obj;
                }
                next(",");
                white();
            }
        }
        throw new Error("Bad object");
    };

    function string() {
        var str = "";
        if (ch === "\"") {
            next("\"");
            white();
            while (ch) {
                str += ch;
                next(ch);
                if (ch === "\"") {
                    next("\"");
                    return str;
                }
            }
        }
        throw new Error("Bad string");
    };

    function number() {
        var num = "";
        if (ch === "-") {
            num = "-";
            next("-");
        }
        while ("0" <= ch && ch <= "9") {
            num += ch;
            next(ch);
        }
        if (isFinite(num)) {
            if (depth < 2) type.NUMBER++;
            return parseInt(num, 10);
        } else {
            throw new Error("Bad number");
        }
    };

    function value() {
        white();
        switch (ch) {
            case "{":
            if (depth !== 0) type.OBJECT++;
                depth++;
                return object();
            case "[":
            if (depth !== 0) type.ARRAY++;
                depth++;
                return array();
            case "\"":
                if (depth < 2) type.STRING++;
                return string();
            case "-":
                return number();
            default:
                return ch >= "0" && ch <= "9" ? number() : word();
        }
    };

    function word() {
        switch (ch) {
            case "t":
                next("t");
                next("r");
                next("u");
                next("e");
                if (depth < 2) type.BOOLEAN++;
                return true;
            case "f":
                next("f");
                next("a");
                next("l");
                next("s");
                next("e");
                if (depth < 2) type.BOOLEAN++;
                return false;
            case "n":
                next("n");
                next("u");
                next("l");
                next("l");
                return null;
        }
        throw new Error("Bad word");
    };

    function next(c) {
        if (c && c !== ch) {
            throw new Error("Bad next");
        }

        ch = text.charAt(at);
        at++;
        return ch;
    };

    function white() {
        if (ch && ch === " ") {
            next();
        }
    };

    return function (source) {
        text = source;
        ch = " ";
        at = 0;
        depth = 0;
        type = {
            STRING: 0,
            NUMBER: 0,
            BOOLEAN: 0,
            OBJECT: 0,
            ARRAY: 0
        };
        white();
        var result = value();
        Array.isArray(result) ? printResult("배열") : printResult("객체");
        return result;
    };
}());

module.exports = json_parse;