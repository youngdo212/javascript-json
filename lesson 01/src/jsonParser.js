var util = require('./utils');
var log = util.log;

var parser = {
  parseJson: function (insertedData) {
    var parsingJson = new JsonUnit(insertedData, 0, insertedData.length - 1, new Array);
    return parsingJson.parseData();
  },
}
JsonUnit = function (insertedData, parsingPointer, dataEndPoint, parsedData) {
  this.insertedData = insertedData;
  this.parsingPointer = parsingPointer;
  this.dataEndPoint = dataEndPoint;
  this.parsedData = parsedData;
}
JsonUnit.prototype.parseData = function () {
  console.log(this.parsingPointer);
  this.ignoreSpaces();
  console.log(this.parsingPointer);
  if (this.parsingPointer >= this.dataEndPoint) {
    return this.parsedData;
  }
  return this.parsedData;

  // switch (getNextType()) {
  //   case "Array":
  //     var arrayEnd = getBlockEnd();
  //     var innerBlock = new JsonUnit(arrayEnd);
  //     var parsingElement = innerBlock.parseData();
  //     this.parsingPointer += arrayEnd + 1;
  //     this.parsedElements.push(parsingElement);
  //     break;
  //   case "String":
  //   case "Number":
  //   case "Bool":
  //     break;
}
JsonUnit.prototype.ignoreSpaces = function () {
  while (this.insertedData[this.parsingPointer] === " ") {
    this.parsingPointer++;
  }
  return this;
}
JsonUnit.prototype.getNextType = function () {

}
JsonUnit.prototype.getTypeEnd = function () {

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