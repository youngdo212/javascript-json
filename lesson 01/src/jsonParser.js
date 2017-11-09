var util = require('./utils');
var log = util.log;
var errors = require('./errors');

var jsonParser = {
  parseJson: function (insertedData) {
    var parsingJson = new JsonUnit(insertedData, 0, insertedData.length - 1, []);
    return parsingJson.parseData().parsedData;
  },
}

JsonUnit = function (insertedData, parsingPointer, dataEndPoint, parsedData) {
  this.insertedData = insertedData;
  this.parsingPointer = parsingPointer;
  this.dataEndPoint = dataEndPoint;
  this.parsedData = parsedData;
}

Object.defineProperty(JsonUnit.prototype, "parsingLetter",
  { get: function () { return this.insertedData[this.parsingPointer]; } }
)

JsonUnit.prototype.parseData = function () {
  if (this.dataEndPoint < 1) {
    throw new Error(errors.type);
  }
  while (this.parsingPointer < this.insertedData.length) {
    this.ignoreSpaces();
    if (this.parsingPointer >= this.dataEndPoint) return this;

    var dataType = this.getNextType();
    if (dataType === "Array") this.parseArray();
    else this.parseValue(dataType);

    if (this.parsingPointer === this.insertedData.length) return this;
  }
  throw new Error(errors.blockError);
}

JsonUnit.prototype.parseArray = function () {
  var arrayEnd = this.getBlockEnd();
  var innerBlock = new JsonUnit(this.insertedData, this.parsingPointer + 1, arrayEnd, []);
  this.parsedData.push(innerBlock.parseData().parsedData);
  this.parsingPointer = arrayEnd + 1;
  if (this.parsingPointer === this.insertedData.length) {
    return;
  }
  this.parsingPointer = this.getDelimiter() + 1;
}

JsonUnit.prototype.parseValue = function (valueType) {
  var valueEnd = this.getElementEnd();
  var pureValueEnd = this.exceptLastSpaces(this.parsingPointer, valueEnd);
  this.parsedData.push(this["parse" + valueType](this.parsingPointer, pureValueEnd));
  this.parsingPointer = valueEnd + 1;
}

JsonUnit.prototype.ignoreSpaces = function () {
  while (this.parsingLetter === " ") {
    this.parsingPointer++;
  }
}

JsonUnit.prototype.getNextType = function () {
  if (this.parsingLetter === '[') return "Array";
  if (this.parsingLetter === '"') return "String";
  if (/-|[1-9]/.test(this.parsingLetter)) return "Number";
  if (/t|f/i.test(this.parsingLetter)) return "Bool";
  throw new Error(errors.typeError);
}

JsonUnit.prototype.getBlockEnd = function () {
  var innerArrayCount = 0
  var endPointer = this.parsingPointer;

  for (; endPointer <= this.dataEndPoint; endPointer++) {
    if (this.insertedData[endPointer] === '[') innerArrayCount++;
    if (this.insertedData[endPointer] === ']') innerArrayCount--;
    if (this.insertedData[endPointer] === '"') endPointer = this.getStringEnd(endPointer);
    if (innerArrayCount === 0) {
      return endPointer;
    }
  }
  throw new Error(errors.blockError);
}

JsonUnit.prototype.getElementEnd = function () {
  var endPointer = (this.parsingLetter === '"') ? this.getStringEnd(this.parsingPointer) : this.parsingPointer

  for (; endPointer <= this.dataEndPoint; endPointer++) {
    if (this.insertedData[endPointer] === ']' || this.insertedData[endPointer] === ',') {
      return endPointer;
    }
  }
  throw new Error(errors.typeError);
}

JsonUnit.prototype.getStringEnd = function (endPointer) {
  endPointer++;
  while (this.insertedData[endPointer] !== '"') {
    endPointer++;
    if (endPointer > this.dataEndPoint) throw new Error(errors.typeError);
  }
  return endPointer;
}

JsonUnit.prototype.getDelimiter = function () {
  var endPointer = this.parsingPointer;

  for (; endPointer <= this.dataEndPoint; endPointer++) {
    if (this.insertedData[endPointer] === ']' || this.insertedData[endPointer] === ',') {
      return endPointer;
    }
    if (this.insertedData[endPointer] !== ' ') {
      throw new Error(errors.blockError);
    }
  }
  throw new Error(errors.blockError);
}

JsonUnit.prototype.parseNumber = function (startPoint, endPoint) {
  var number = Number(this.insertedData.slice(startPoint, endPoint));
  if (!isNaN(number)) return number;
  throw new Error(errors.typeError);
}

JsonUnit.prototype.parseBool = function (startPoint, endPoint) {
  var parsingBool = this.insertedData.slice(startPoint, endPoint).toLowerCase();
  if (parsingBool === "true") return true;
  if (parsingBool === "false") return false;
  throw new Error(errors.typeError);
}

JsonUnit.prototype.parseString = function (startPoint, endPoint) {
  var parsingString = "";
  for (var i = 1; startPoint + i < endPoint - 1; i++) {
    if (this.insertedData[startPoint + i] === '"' || this.insertedData[startPoint + i] === '\\') {
      throw new Error(errors.typeError);
    }
    parsingString += this.insertedData[startPoint + i];
  }
  return parsingString;
}

JsonUnit.prototype.exceptLastSpaces = function (startPoint, endPoint) {
  while (this.insertedData[endPoint] === ' ') {
    endPoint--;
    if (endPoint < startPoint) throw new Error(errors.typeError);
  }
  return endPoint;
}

module.exports = jsonParser;