var errors = require('./errors');
var polyfill = require('./polyfill');

var jsonParser = (function () {
  var insertedData = "";

  function JsonData(parsingPointer, dataEndPoint, parsedData) {
    this.parsingPointer = parsingPointer;
    this.dataEndPoint = dataEndPoint;
    this.parsedData = parsedData;
  }

  Object.defineProperty(JsonData.prototype, "parsingLetter",
    { get: function () { return insertedData[this.parsingPointer]; } }
  );

  function parse(insert) {
    insertedData = insert;
    var jsonData = new JsonData(0, insertedData.length - 1, []);
    return parseData(jsonData);
  }

  function parseData(jsonData) {
    while (jsonData.parsingPointer < insertedData.length) {
      ignoreSpaces(jsonData);

      if (jsonData.parsingPointer >= jsonData.dataEndPoint) {
        return jsonData.parsedData;
      }

      if (Array.isArray(jsonData.parsedData)) {
        parseValue(jsonData);
      } else {
        parseHash(jsonData);
      }

      if (jsonData.parsingPointer === insertedData.length) {
        return jsonData.parsedData;
      }
    }

    throw new Error(errors.blockError, jsonData);
  }

  function parseHash(jsonData) {
    var dataType = getNextType(jsonData);
    if (dataType !== "String") {
      throw new Error(errors.typeError, jsonData);
    }

    keyEnd = getStringEnd(jsonData, jsonData.parsingPointer);
    key = parseString(jsonData, jsonData.parsingPointer, keyEnd);
    jsonData.parsingPointer = keyEnd + 1;
    jsonData.parsingPointer = getColon(jsonData) + 1;
    ignoreSpaces(jsonData);
    parseValue(jsonData, key);
  }

  function parseValue(jsonData, hashKey) {
    var dataType = getNextType(jsonData);
    var parsedValue;

    if (dataType === "Object" || dataType === "Array") {
      parsedValue = parseBlock(jsonData, dataType);
    } else {
      parsedValue = parseElement(jsonData, dataType);
    }

    if (hashKey === undefined) {
      jsonData.parsedData.push(parsedValue);
    } else {
      jsonData.parsedData[hashKey] = parsedValue;
    }
  }

  function parseBlock(jsonData, dataType) {
    if (dataType === "Array") {
      var blockEnd = getBlockEnd(jsonData, '[', ']');
      var innerData = new JsonData(jsonData.parsingPointer + 1, blockEnd, []);
    } else if (dataType === "Object") {
      var blockEnd = getBlockEnd(jsonData, '{', '}');
      var innerData = new JsonData(jsonData.parsingPointer + 1, blockEnd, {});
    }

    var parsedBlock = parseData(innerData)
    jsonData.parsingPointer = blockEnd + 1;

    if (jsonData.parsingPointer === insertedData.length) {
      return parsedBlock;
    }

    jsonData.parsingPointer = getDelimiter(jsonData) + 1;
    return parsedBlock;
  }

  function parseElement(jsonData, valueType) {
    var elementEnd = getElementEnd(jsonData);
    var pureElementEnd = ignoreLastSpaces(jsonData, jsonData.parsingPointer, elementEnd);
    var parsedElement;

    if (valueType === "String") {
      parsedElement = parseString(jsonData, jsonData.parsingPointer, pureElementEnd);
    } else if (valueType === "Number") {
      parsedElement = parseNumber(jsonData, jsonData.parsingPointer, pureElementEnd);
    } else {
      parsedElement = parseBool(jsonData, jsonData.parsingPointer, pureElementEnd);
    }

    jsonData.parsingPointer = elementEnd + 1;

    return parsedElement;
  }


  function parseNumber(jsonData, startPoint, endPoint) {
    var number = Number(insertedData.slice(startPoint, endPoint + 1));

    if (!isNaN(number)) {
      return number;
    }

    throw new Error(errors.typeError);
  }

  function parseBool(jsonData, startPoint, endPoint) {
    var parsingBool = insertedData.slice(startPoint, endPoint + 1).toLowerCase();

    if (parsingBool === "true") return true;
    if (parsingBool === "false") return false;

    throw new Error(errors.typeError);
  }

  function parseString(jsonData, startPoint, endPoint) {
    var parsingString = "";

    for (var i = 1; startPoint + i < endPoint; i++) {
      if (insertedData[startPoint + i] === '"' || insertedData[startPoint + i] === '\\') {
        throw new Error(errors.typeError);
      }

      parsingString += insertedData[startPoint + i];
    }

    return parsingString;
  }

  function ignoreSpaces(jsonData) {
    while (jsonData.parsingLetter === " ") {
      jsonData.parsingPointer++;
    }
  }

  function getNextType(jsonData) {
    if (jsonData.parsingLetter === '[') return "Array";
    if (jsonData.parsingLetter === '{') return "Object";
    if (jsonData.parsingLetter === '"') return "String";
    if (/-|[1-9]/.test(jsonData.parsingLetter)) return "Number";
    if (/t|f/i.test(jsonData.parsingLetter)) return "Bool";
    throw new Error(errors.typeError);
  }

  function getBlockEnd(jsonData, blockStartLetter, blockEndLetter) {
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

  function getElementEnd(jsonData) {
    var endPointer = (jsonData.parsingLetter === '"') ? getStringEnd(jsonData, jsonData.parsingPointer) : jsonData.parsingPointer

    for (; endPointer <= jsonData.dataEndPoint; endPointer++) {
      if (insertedData[endPointer] === ']' || insertedData[endPointer] === '}' || insertedData[endPointer] === ',') {
        return endPointer;
      }
    }

    throw new Error(errors.typeError);
  }

  function getStringEnd(jsonData, startPoint) {
    var endPointer = startPoint + 1;

    while (insertedData[endPointer] !== '"') {
      endPointer++;

      if (endPointer > jsonData.dataEndPoint) {
        throw new Error(errors.typeError);
      }
    }

    return endPointer;
  }

  function getDelimiter(jsonData) {
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

  function getColon(jsonData) {
    ignoreSpaces(jsonData);
    var colonPointer = jsonData.parsingPointer;

    for (; colonPointer <= jsonData.dataEndPoint; colonPointer++) {

      if (insertedData[colonPointer] === ':') {
        return colonPointer;
      }

      if (insertedData[colonPointer] !== ' ') {
        throw new Error(errors.blockError);
      }
    }

    throw new Error(errors.blockError);
  }

  function ignoreLastSpaces(jsonData, startPoint, endPoint) {
    endPoint -= 1;

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