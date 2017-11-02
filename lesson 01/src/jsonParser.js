var util = require('./utils');
var log = util.log;

var parser = (function () {
  var parse = function (insert) {
    parsedArray = parseByLetter(insert);
    return dataCount;
  }

  var parseByLetter = function (insertedString) {
    var typeStack = [];
    var currentData = "";
    var currentObject = [];

    for (var i = 0; i < insertedString.length; i++) {
      if (typeStack.length === 0) {
        switch (insertedString[i]) {
          case "[":
            typeStack.push("array");
            currentObject.push("array start");
            break;
          case " ":
            break;
          default:
            break;
        }
      } else if (typeStack[typeStack.length - 1] === "array") {
        switch (insertedString[i]) {
          case ']':
            typeStack.pop();
            currentObject.push("array end");
            break;
          case '"':
            typeStack.push("string");
            currentData = "";
            break;
          case ' ':
          case ',':
            break;
          default:
            typeStack.push("numberOrBool");
            currentData = "";
            currentData += insertedString[i];
            break;
        }
      } else if (typeStack[typeStack.length - 1] === "string") {
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
          case ']':
            var result = parseNumOrBool(currentData);
            currentObject.push(result);
            currentObject.push("array end");
            typeStack.pop();
            break;
          case ',':
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
  return {
    parse
  };
})();

module.exports = parser;