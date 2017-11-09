var util = require('./utils');
var log = util.log;
var errors = require('./errors');

var JsonData = function (insertedData, parsingPointer, dataEndPoint, parsedData) {
  this.insertedData = insertedData;
  this.parsingPointer = parsingPointer;
  this.dataEndPoint = dataEndPoint;
  this.parsedData = parsedData;
}

Object.defineProperty(JsonData.prototype, "parsingLetter",
  { get: function () { return this.insertedData[this.parsingPointer]; } }
);

var jsonParser = (function () {

  var parse = function (insertedData) {
    var jsonData = new JsonData(insertedData, 0, insertedData.length - 1, []);
    return parseData(jsonData);
  }

  var parseData = function (data) {
    if (data.insertedData.length === 1) {
      throw new Error(errors.type);
    }

    while (data.parsingPointer < data.insertedData.length) {
      ignoreSpaces(data);

      if (data.parsingPointer >= data.dataEndPoint) {
        return data.parsedData;
      }

      var dataType = getNextType(data);
      if (dataType === "Array") {
        parseArray(data);
      } else {
        parseValue(data, dataType);
      }

      if (data.parsingPointer === data.insertedData.length) {
        return data.parsedData;
      }
    }

    throw new Error(errors.blockError);
  }

  var parseArray = function (data) {
    var arrayEnd = getBlockEnd(data);
    var innerData = new JsonData(data.insertedData, data.parsingPointer + 1, arrayEnd, []);
    data.parsedData.push(parseData(innerData));
    data.parsingPointer = arrayEnd + 1;

    if (data.parsingPointer === data.insertedData.length) {
      return;
    }

    data.parsingPointer = getDelimiter(data) + 1;
  }

  var parseValue = function (data, valueType) {
    var valueEnd = getElementEnd(data);
    var pureValueEnd = exceptLastSpaces(data, data.parsingPointer, valueEnd);
    data.parsedData.push(parseType[valueType](data, data.parsingPointer, pureValueEnd));
    data.parsingPointer = valueEnd + 1;
  }

  var ignoreSpaces = function (data) {
    while (data.parsingLetter === " ") {
      data.parsingPointer++;
    }
  }

  var getNextType = function (data) {
    if (data.parsingLetter === '[') return "Array";
    if (data.parsingLetter === '"') return "String";
    if (/-|[1-9]/.test(data.parsingLetter)) return "Number";
    if (/t|f/i.test(data.parsingLetter)) return "Bool";
    throw new Error(errors.typeError);
  }

  var getBlockEnd = function (data) {
    var innerArrayCount = 0
    var endPointer = data.parsingPointer;

    for (; endPointer <= data.dataEndPoint; endPointer++) {
      if (data.insertedData[endPointer] === '[') innerArrayCount++;
      if (data.insertedData[endPointer] === ']') innerArrayCount--;
      if (data.insertedData[endPointer] === '"') endPointer = getStringEnd(data, endPointer);
      if (innerArrayCount === 0) {
        return endPointer;
      }
    }

    throw new Error(errors.blockError);
  }

  var getElementEnd = function (data) {
    var endPointer = (data.parsingLetter === '"') ? getStringEnd(data, data.parsingPointer) : data.parsingPointer

    for (; endPointer <= data.dataEndPoint; endPointer++) {
      if (data.insertedData[endPointer] === ']' || data.insertedData[endPointer] === ',') {
        return endPointer;
      }
    }

    throw new Error(errors.typeError);
  }

  var getStringEnd = function (data, startPoint) {
    var endPointer = startPoint + 1;

    while (data.insertedData[endPointer] !== '"') {
      endPointer++;

      if (endPointer > data.dataEndPoint) {
        throw new Error(errors.typeError);
      }
    }

    return endPointer;
  }

  var getDelimiter = function (data) {
    var delimiterPointer = data.parsingPointer;

    for (; delimiterPointer <= data.dataEndPoint; delimiterPointer++) {

      if (data.insertedData[delimiterPointer] === ']' || data.insertedData[delimiterPointer] === ',') {
        return delimiterPointer;
      }

      if (data.insertedData[delimiterPointer] !== ' ') {
        throw new Error(errors.blockError);
      }
    }

    throw new Error(errors.blockError);
  }

  var parseType = {
    Number: function (data, startPoint, endPoint) {
      var number = Number(data.insertedData.slice(startPoint, endPoint));

      if (!isNaN(number)) {
        return number;
      }

      throw new Error(errors.typeError);
    },

    Bool: function (data, startPoint, endPoint) {
      var parsingBool = insertedData.slice(startPoint, endPoint).toLowerCase();

      if (parsingBool === "true") return true;
      if (parsingBool === "false") return false;

      throw new Error(errors.typeError);
    },

    String: function (data, startPoint, endPoint) {
      var parsingString = "";

      for (var i = 1; startPoint + i < endPoint - 1; i++) {
        if (data.insertedData[startPoint + i] === '"' || data.insertedData[startPoint + i] === '\\') {
          throw new Error(errors.typeError);
        }

        parsingString += data.insertedData[startPoint + i];
      }

      return parsingString;
    }
  }

  var exceptLastSpaces = function (data, startPoint, endPoint) {
    while (data.insertedData[endPoint] === ' ') {
      endPoint--;

      if (endPoint < startPoint) {
        throw new Error(errors.typeError);
      }
    }

    return endPoint;
  }

  return {
    parse
  }

})();

module.exports = jsonParser;