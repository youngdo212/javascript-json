var util = require('./utils');
var log = util.log;
var errors = require('./errors');

JsonData = function (insertedData, parsingPointer, dataEndPoint, parsedData) {
  this.insertedData = insertedData;
  this.parsingPointer = parsingPointer;
  this.dataEndPoint = dataEndPoint;
  this.parsedData = parsedData;
}

Object.defineProperty(JsonData.prototype, "parsingLetter",
  { get: function () { return this.insertedData[this.parsingPointer]; } }
);

var jsonParser = {

  parse: function (insertedData) {
    var jsonData = new JsonData(insertedData, 0, insertedData.length - 1, []);
    return this.parseData(jsonData);
  },

  parseData: function (data) {
    if (data.insertedData.length === 1) {
      throw new Error(errors.type);
    }

    while (data.parsingPointer < data.insertedData.length) {
      this.ignoreSpaces(data);

      if (data.parsingPointer >= data.dataEndPoint) {
        return data.parsedData;
      }

      var dataType = this.getNextType(data);
      if (dataType === "Array") {
        this.parseArray(data);
      } else {
        this.parseValue(data, dataType);
      }

      if (data.parsingPointer === data.insertedData.length) {
        return data.parsedData;
      }
    }

    throw new Error(errors.blockError);
  },

  parseArray: function (data) {
    var arrayEnd = this.getBlockEnd(data);
    var innerData = new JsonData(data.insertedData, data.parsingPointer + 1, arrayEnd, []);
    data.parsedData.push(this.parseData(innerData));
    data.parsingPointer = arrayEnd + 1;

    if (data.parsingPointer === data.insertedData.length) {
      return;
    }

    data.parsingPointer = this.getDelimiter(data) + 1;
  },

  parseValue: function (data, valueType) {
    var valueEnd = this.getElementEnd(data);
    var pureValueEnd = this.exceptLastSpaces(data, data.parsingPointer, valueEnd);
    data.parsedData.push(this["parse" + valueType](data, data.parsingPointer, pureValueEnd));
    data.parsingPointer = valueEnd + 1;
  },

  ignoreSpaces: function (data) {
    while (data.parsingLetter === " ") {
      data.parsingPointer++;
    }
  },

  getNextType: function (data) {
    if (data.parsingLetter === '[') return "Array";
    if (data.parsingLetter === '"') return "String";
    if (/-|[1-9]/.test(data.parsingLetter)) return "Number";
    if (/t|f/i.test(data.parsingLetter)) return "Bool";
    throw new Error(errors.typeError);
  },

  getBlockEnd: function (data) {
    var innerArrayCount = 0
    var endPointer = data.parsingPointer;

    for (; endPointer <= data.dataEndPoint; endPointer++) {
      if (data.insertedData[endPointer] === '[') innerArrayCount++;
      if (data.insertedData[endPointer] === ']') innerArrayCount--;
      if (data.insertedData[endPointer] === '"') endPointer = this.getStringEnd(data, endPointer);
      if (innerArrayCount === 0) {
        return endPointer;
      }
    }

    throw new Error(errors.blockError);
  },

  getElementEnd: function (data) {
    var endPointer = (data.parsingLetter === '"') ? this.getStringEnd(data, data.parsingPointer) : data.parsingPointer

    for (; endPointer <= data.dataEndPoint; endPointer++) {
      if (data.insertedData[endPointer] === ']' || data.insertedData[endPointer] === ',') {
        return endPointer;
      }
    }

    throw new Error(errors.typeError);
  },

  getStringEnd: function (data, endPointer) {
    endPointer += 1;

    while (data.insertedData[endPointer] !== '"') {
      endPointer++;

      if (endPointer > data.dataEndPoint) {
        throw new Error(errors.typeError);
      }
    }

    return endPointer;
  },

  getDelimiter: function (data) {
    var endPointer = data.parsingPointer;

    for (; endPointer <= data.dataEndPoint; endPointer++) {

      if (data.insertedData[endPointer] === ']' || data.insertedData[endPointer] === ',') {
        return endPointer;
      }

      if (data.insertedData[endPointer] !== ' ') {
        throw new Error(errors.blockError);
      }
    }

    throw new Error(errors.blockError);
  },

  parseNumber: function (data, startPoint, endPoint) {
    var number = Number(data.insertedData.slice(startPoint, endPoint));

    if (!isNaN(number)) {
      return number;
    }

    throw new Error(errors.typeError);
  },

  parseBool: function (data, startPoint, endPoint) {
    var parsingBool = this.insertedData.slice(startPoint, endPoint).toLowerCase();

    if (parsingBool === "true") return true;
    if (parsingBool === "false") return false;

    throw new Error(errors.typeError);
  },

  parseString: function (data, startPoint, endPoint) {
    var parsingString = "";

    for (var i = 1; startPoint + i < endPoint - 1; i++) {
      if (data.insertedData[startPoint + i] === '"' || data.insertedData[startPoint + i] === '\\') {
        throw new Error(errors.typeError);
      }

      parsingString += data.insertedData[startPoint + i];
    }

    return parsingString;
  },

  exceptLastSpaces: function (data, startPoint, endPoint) {
    while (data.insertedData[endPoint] === ' ') {
      endPoint--;

      if (endPoint < startPoint) {
        throw new Error(errors.typeError);
      }
    }

    return endPoint;
  },

}

module.exports = jsonParser;