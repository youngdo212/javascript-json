var util = require('./utils');
var log = util.log;
var error = require('./errors');

var parser = {
  parseJson: function (insertedData) {
    var parsingJson = new JsonUnit(insertedData, 0, insertedData.length - 1, new Array);
    return parsingJson.parseData().parsedData;
  },
}
JsonUnit = function (insertedData, parsingPointer, dataEndPoint, parsedData) {
  this.insertedData = insertedData;
  this.parsingPointer = parsingPointer;
  this.dataEndPoint = dataEndPoint;
  this.parsedData = parsedData;
}
JsonUnit.prototype.parseData = function () {
  this.ignoreSpaces();
  if (this.parsingPointer >= this.dataEndPoint) {
    return this;
  }
  // var parsingType = this.getNextType();
  // this.parse[parsingType]();
  switch (this.getNextType()) {
    case "Array":
      this.parseArray();
      break;
    case "String":
    case "Number":
    case "Bool":
      this.parseValue();
      break;
  }
}
JsonUnit.prototype.parseArray = function () {
  var arrayEnd = this.getBlockEnd();
  var innerBlock = new JsonUnit(this.insertedData, this.parsingPointer, arrayEnd, new Array);
  this.parsedElements.push(innerBlock.parseData().parsedData);
  this.parsingPointer += arrayEnd + 1;
  this.parsingPointer = this.getElementEnd(); //Array도 하나의 Element이므로 blockEnd 감지 => elementEnd 감지 순으로 진행
  return this;
}
JsonUnit.prototype.parseValue = function () {
  return this;
}

JsonUnit.prototype.ignoreSpaces = function () {
  while (this.insertedData[this.parsingPointer] === " ") {
    this.parsingPointer++;
  }
  return this;
}
JsonUnit.prototype.getNextType = function () {
  switch (this.insertedData[this.parsingPointer]) {
    case '[':
      return "Array";
    case '"':
      return "String";
    case '"':
      return "String";
    case 't':
    case 'f':
    case 'T':
    case 'F':
      return "Bool";
    default:
      throw new Error(errors.typeError);
  }

}
JsonUnit.prototype.getElementEnd = function () {

}
JsonUnit.prototype.getBlockEnd = function () {

}
JsonUnit.prototype.parseNumber = function () {

}
JsonUnit.prototype.parseBool = function () {

}
JsonUnit.prototype.parseString = function () {

}
JsonUnit.prototype.ignoreLastSpaces = function () {

}


var parseByLetter = function (insertedData) {

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

module.exports = parser;