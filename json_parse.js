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

    function getArray() {
        var arr = [];
        if (ch !== "[") {
            throw new Error("Bad getArray");
        }
        getNext("[");
        isWhite();
        if (ch === "]") {
            getNext("]");
            return arr;
        }
        while (ch) {
            arr.push(getValue());
            isWhite();
            if (ch === "]") {
                getNext("]");
                return arr;
            }
            getNext(",");
            isWhite();
        }
    };

    function getObject() {
        var obj = {};
        if (ch !== "{") {
            throw new Error("Bad getObject");
        }
        getNext("{");
        isWhite();
        if (ch === "}") {
            getNext("}");
            return obj;
        }
        while (ch) {
            var key = getString();
            isWhite();
            getNext(":");
            obj[key] = getValue();
            isWhite();
            if (ch === "}") {
                getNext("}");
                return obj;
            }
            getNext(",");
            isWhite();
        }
    };

    function getString() {
        var str = "";
        if (ch !== "\"") {
            throw new Error("Bad getString");
        }
        getNext("\"");
        isWhite();
        while (ch) {
            str += ch;
            getNext(ch);
            if (ch === "\"") {
                getNext("\"");
                return str;
            }
        }
    };

    function getNumber() {
        var num = "";
        if (ch === "-") {
            num = "-";
            getNext("-");
        }
        while ("0" <= ch && ch <= "9") {
            num += ch;
            getNext(ch);
        }
        if (isFinite(num)) {
            if (depth < 2) type.NUMBER++;
            return parseInt(num, 10);
        } else {
            throw new Error("Bad getNumber");
        }
    };

    function getValue() {
        isWhite();
        switch (ch) {
            case "{":
                if (depth !== 0) type.OBJECT++;
                depth++;
                return getObject();
            case "[":
                if (depth !== 0) type.ARRAY++;
                depth++;
                return getArray();
            case "\"":
                if (depth < 2) type.STRING++;
                return getString();
            case "-":
                return getNumber();
            default:
                return ch >= "0" && ch <= "9" ? getNumber() : getWord();
        }
    };

    function getWord() {
        switch (ch) {
            case "t":
                getNext("t");
                getNext("r");
                getNext("u");
                getNext("e");
                if (depth < 2) type.BOOLEAN++;
                return true;
            case "f":
                getNext("f");
                getNext("a");
                getNext("l");
                getNext("s");
                getNext("e");
                if (depth < 2) type.BOOLEAN++;
                return false;
            case "n":
                getNext("n");
                getNext("u");
                getNext("l");
                getNext("l");
                return null;
            default:
                throw new Error("Bad word");
        }
    };

    function getNext(c) {
        if (c && c !== ch) {
            throw new Error("Bad next");
        }

        ch = text.charAt(at);
        at++;
        return ch;
    };

    function isWhite() {
        if (ch && ch === " ") {
            getNext();
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
        isWhite();
        var result = getValue();
        Array.isArray(result) ? printResult("배열") : printResult("객체");
        return result;
    };
}());

module.exports = json_parse;