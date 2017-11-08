var polyfill = require('./polyfill.js');

var json_stringify = (function () {
    "use strict";

    var gap = '    ';
    var mind = '';
    var tab;
    var enter;

    function checkType(element, key) {
        if (typeof (element) === "boolean" || Number.isInteger(element)) {
            return element;
        } else if (Object.prototype.toString.apply(element) === "[object Object]") {
            tab = key ? mind : '';
            return `{\n${objectParse(element)}\n${tab}}`;
        } else if (Array.isArray(element)) {
            enter = key ? '\n' : '';
            return enter + tab + `[${arrayParse(element)}]` + enter;
        } else {
            return `"${element}"`;
        }
    };

    function arrayParse(array) {
        var arrList = array.map(function (value) {
            return checkType(value, true);
        });
        return arrList.join(', ');
    };

    function objectParse(object) {
        mind += gap;
        var objList = Object.keys(object).map(function (key) {
            return mind + `"${key}": ${checkType(object[key])}`;
        });
        return objList.join(',\n');
    };

    return function (source) {
        return checkType(source);
    };
}());

module.exports = json_stringify;