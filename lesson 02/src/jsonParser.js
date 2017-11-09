var errors = require('./errors');

var jsonParser = (function () {
  var insertedData = "";

  var JsonData = function (parsingPointer, dataEndPoint, parsedData) {
    this.parsingPointer = parsingPointer;
    this.dataEndPoint = dataEndPoint;
    this.parsedData = parsedData;
  }

  Object.defineProperty(JsonData.prototype, "parsingLetter",
    { get: function () { return insertedData[this.parsingPointer]; } }
  );

  var parse = function (insert) {
    insertedData = insert;
    var jsonData = new JsonData(0, insertedData.length - 1, []);
    return parseData(jsonData);
  }

  var parseData = function (jsonData) {
    if (insertedData.length === 1) {
      throw new Error(errors.type);
    }

    while (jsonData.parsingPointer < insertedData.length) {
      ignoreSpaces(jsonData);

      if (jsonData.parsingPointer >= jsonData.dataEndPoint) {
        return jsonData.parsedData;
      }

      var dataType = getNextType(jsonData);
      if (dataType === "Object" || dataType === "Array") {
        parseBlock(jsonData, dataType);
      } else {
        parseElement(jsonData, dataType);
      }

      if (jsonData.parsingPointer === insertedData.length) {
        return jsonData.parsedData;
      }
    }

    throw new Error(errors.blockError, jsonData);
  }

  var parseBlock = function (jsonData, dataType) {
    if (dataType === "Array") {
      var blockEnd = getBlockEnd(jsonData, '[', ']');
      var innerData = new JsonData(jsonData.parsingPointer + 1, blockEnd, []);
    } else if (dataType === "Object") {
      var blockEnd = getBlockEnd(jsonData, '{', '}');
      var innerData = new JsonData(jsonData.parsingPointer + 1, blockEnd, {});
    }
    putData(jsonData, parseData(innerData));
    jsonData.parsingPointer = blockEnd + 1;

    if (jsonData.parsingPointer === insertedData.length) {
      return;
    }

    jsonData.parsingPointer = getDelimiter(jsonData) + 1;
  }

  var putData = function (jsonData, puttingData) {
    if (Array.isArray(jsonData.parsedData)) {
      jsonData.parsedData.push(puttingData);
    } else {
      jsonData.parsedData["a"] = puttingData;
    }
  }

  var parseElement = function (jsonData, valueType) {
    var elementEnd = getElementEnd(jsonData);
    var pureElementEnd = exceptLastSpaces(jsonData, jsonData.parsingPointer, elementEnd);
    jsonData.parsedData.push(parseType[valueType](jsonData, jsonData.parsingPointer, pureElementEnd));
    jsonData.parsingPointer = elementEnd + 1;
  }

  var ignoreSpaces = function (jsonData) {
    while (jsonData.parsingLetter === " ") {
      jsonData.parsingPointer++;
    }
  }

  var getNextType = function (jsonData) {
    if (jsonData.parsingLetter === '[') return "Array";
    if (jsonData.parsingLetter === '{') return "Object";
    if (jsonData.parsingLetter === '"') return "String";
    if (/-|[1-9]/.test(jsonData.parsingLetter)) return "Number";
    if (/t|f/i.test(jsonData.parsingLetter)) return "Bool";
    throw new Error(errors.typeError);
  }

  var getBlockEnd = function (jsonData, blockStartLetter, blockEndLetter) {
    var innerBlockCount = 0
    var endPointer = jsonData.parsingPointer;

    for (; endPointer <= jsonData.dataEndPoint; endPointer++) {
      if (insertedData[endPointer] === blockStartLetter) innerBlockCount++;
      if (insertedData[endPointer] === blockEndLetter) innerBlockCount--;
      if (insertedData[endPointer] === '"') endPointer = getStringEnd(jsonData, endPointer);
      if (innerBlockCount === 0) {
        return endPointer;
      }
    }

    throw new Error(errors.blockError);
  }

  var getElementEnd = function (jsonData) {
    var endPointer = (jsonData.parsingLetter === '"') ? getStringEnd(jsonData, jsonData.parsingPointer) : jsonData.parsingPointer

    for (; endPointer <= jsonData.dataEndPoint; endPointer++) {
      if (insertedData[endPointer] === ']' || insertedData[endPointer] === '}' || insertedData[endPointer] === ',') {
        return endPointer;
      }
    }

    throw new Error(errors.typeError);
  }

  var getStringEnd = function (jsonData, startPoint) {
    var endPointer = startPoint + 1;

    while (insertedData[endPointer] !== '"') {
      endPointer++;

      if (endPointer > jsonData.dataEndPoint) {
        throw new Error(errors.typeError);
      }
    }

    return endPointer;
  }

  var getDelimiter = function (jsonData) {
    var delimiterPointer = jsonData.parsingPointer;

    for (; delimiterPointer <= jsonData.dataEndPoint; delimiterPointer++) {

      if (insertedData[delimiterPointer] === ']' || insertedData[delimiterPointer] === '}' || insertedData[delimiterPointer] === ',') {
        return delimiterPointer;
      }

      if (insertedData[delimiterPointer] !== ' ') {
        throw new Error(errors.blockError);
      }
    }

    throw new Error(errors.blockError);
  }

  var parseType = {
    Number: function (jsonData, startPoint, endPoint) {
      var number = Number(insertedData.slice(startPoint, endPoint));

      if (!isNaN(number)) {
        return number;
      }

      throw new Error(errors.typeError);
    },

    Bool: function (jsonData, startPoint, endPoint) {
      var parsingBool = insertedData.slice(startPoint, endPoint).toLowerCase();

      if (parsingBool === "true") return true;
      if (parsingBool === "false") return false;

      throw new Error(errors.typeError);
    },

    String: function (jsonData, startPoint, endPoint) {
      var parsingString = "";

      for (var i = 1; startPoint + i < endPoint - 1; i++) {
        if (insertedData[startPoint + i] === '"' || insertedData[startPoint + i] === '\\') {
          throw new Error(errors.typeError);
        }

        parsingString += insertedData[startPoint + i];
      }

      return parsingString;
    }
  }

  var exceptLastSpaces = function (jsonData, startPoint, endPoint) {
    while (insertedData[endPoint] === ' ') {
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