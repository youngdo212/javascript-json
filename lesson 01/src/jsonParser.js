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
JsonUnit.prototype.parseData = function () {
  while (true) {
    this.ignoreSpaces();
    if (this.parsingPointer >= this.dataEndPoint) return this;
    this["parse" + this.getNextType()]();
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
  var valueCheck = /\"|t|f|T|F|-|[1-9]/ //", t, f, T, F, -, 1~9 일 경우 true
  if (valueCheck.test(next)) return "Value";
  throw new Error(errors.typeError);
}

JsonUnit.prototype.getBlockEnd = function () {
  var innerArrayCount = 0
  for (var blockEnd = this.parsingPointer; blockEnd <= this.dataEndPoint; blockEnd++) {
    if (this.insertedData[blockEnd] === '[') innerArrayCount++;
    if (this.insertedData[blockEnd] === ']') innerArrayCount--;
    if (innerArrayCount === -1) {
      return blockEnd;
    }
  }
  throw new Error(errors.blockError);
}

JsonUnit.prototype.getElementEnd = function () {

}

JsonUnit.prototype.parseNumber = function () {

}
JsonUnit.prototype.parseBool = function () {

}
JsonUnit.prototype.parseString = function () {

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