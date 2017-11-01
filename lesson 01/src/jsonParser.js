var util = require('./utils');
var log = util.log;

var parser = (function () {
  var parse = function (insert) {
    parsedObject = parseByLetter(insert);
    // dataCount = countType(parsedObject);
    // return dataCount;
    return parsedObject;
  }

  var parseByLetter = function (insertedString) {
    var typeStack = [];
    var currentLetter = "";
    var currentData = "";
    var currentObject = [];

    for (var i = 0; i < insertedString.length; i++) {
      if (typeStack.length === 0) {
        switch (insertedString[i]) {
          case "[":
            typeStack.push("array");
            break;
          case " ":
            break;
          default:
            break;
        }

      } else if (typeStack[typeStack.length - 1] === 'array') {
        switch (insertedString[i]) {
          case ']':
            typeStack.pop();
            currentObject.push('array');
            break;
          case '"':
            typeStack.push('string');
            currentData = [];
            break;
          case ' ':
          case ',':
            break;
          default:
            typeStack.push('numberOrBool');
            currentData = [];
            currentData += insertedString[i];
            break;
        }
      } else if (typeStack[typeStack.length - 1] === 'string') {
        switch (insertedString[i]) {
          case '"':
            currentObject.push(currentData);
            typeStack.pop();
            break;
          default:
            currentData += insertedString[i];
            break;
        }
      } else {
        switch (insertedString[i]) {
          case ' ':
            break;
          case ',':
            var result = parseNumOrBool(currentData);
            currentObject.push(result);
            typeStack.pop();
            break;
          case ']':
            var result = parseNumOrBool(currentData);
            currentObject.push(result);
            typeStack.pop();
            break;
          default:
            currentData += insertedString[i];
            break;
        }
      }
    }
    return currentObject;
  }
  var parseNumOrBool = function (parsingData) {
    var num = parseInt(parsingData);
    if (!isNaN(num)) {
      return num;
    } else if (parsingData === "true") {
      return true;
    } else if (parsingData === "false") {
      return false;
    }
  }
  var countType = function (parsedObject) {
    var dataCount = {};
    dataCount.string = 3;
    dataCount.number = 2;
    dataCount.bool = 1;
    return dataCount;
  }
  return {
    parse
  };
})();

module.exports = parser;