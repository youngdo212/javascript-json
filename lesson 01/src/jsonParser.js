var util = require('./utils');
var log = util.log;
var errors = require('./errors');

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
Object.defineProperty(JsonUnit.prototype, "parsingLetter", { get: function () { return this.insertedData[this.parsingPointer]; } })
JsonUnit.prototype.parseData = function () {
  while (true) {
    this.ignoreSpaces();
    if (this.parsingPointer >= this.dataEndPoint) return this;
    if (this.getNextType() === "Array") this.parseArray();
    else this.parseValue();
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
  var next = this.insertedData[this.parsingPointer];
  if (next === '[') return "Array";
  if (next === '"') return "String";
  if (/-|[1-9]/.test(next)) return "Number";
  if (/t|f/i.test(next)) return "Bool";
  throw new Error(errors.typeError);
}

JsonUnit.prototype.getBlockEnd = function () {
  var innerArrayCount = 0
  var endPointer = this.parsingPointer;

  for (; endPointer <= this.dataEndPoint; endPointer++) {
    if (this.insertedData[endPointer] === '[') innerArrayCount++;
    if (this.insertedData[endPointer] === ']') innerArrayCount--;
    if (innerArrayCount === -1) {
      return endPointer;
    }
  }
  throw new Error(errors.blockError);
}

JsonUnit.prototype.getElementEnd = function () {
  var letter = this.insertedData[parsingPointer];
  var endPointer = (letter === '"') ? this.getStringEnd() : this.parsingPointer

  for (; endPointer <= this.dataEndPoint; endPointer++) {
    if (this.insertedData[endPointer] === ']' || this.insertedData[endPointer] === ',') {
      return endPointer;
    }
  }
  throw new Error(errors.typeError);
}

JsonUnit.prototype.getStringEnd = function () {
  var endPointer = this.insertedData[parsingPointer];
  if (this.insertedData[this.parsingPointer]) {

  }

  for (; endPointer <= this.dataEndPoint; endPointer++) {
    if (this.insertedData[endPointer] === ']' || this.insertedData[endPointer] === ',') {
      return endPointer;
    }
  }
  throw new Error(errors.typeError);
}

JsonUnit.prototype.parseNumber = function (startPoint, endPoint) {

}
JsonUnit.prototype.parseBool = function (startPoint, endPoint) {

}
JsonUnit.prototype.parseString = function (startPoint, endPoint) {

}
JsonUnit.prototype.ignoreLastSpaces = function () {

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