var jsonReader = (function () {
  var dataCount = { "[object Array]": 0, "[object Object]": 0, "[object Number]": 0, "[object String]": 0, "[object Boolean]": 0, };
  var depth = 0;

  var display = function (parsedData) {
    var readData = {};
    depth = 0;

    readData.data = getArrayInner(parsedData);
    readData.count = dataCount;
    return readData;
  }

  function readValue(parsedElement) {
    var parsedText = "";
    parsedText += parsedElement;
    return parsedText;
  }

  function readObject(innerData) {
    var parsedText = "";

    parsedText += "{\n";
    depth++;
    parsedText += getObjectInner(innerData)
    depth--;
    parsedText += "\n" + getDepthTaps(depth) + "}";

    return parsedText;
  }

  function readArray(innerData) {
    var parsedText = "";

    parsedText += "[\n";
    depth++;
    parsedText += getArrayInner(innerData)
    depth--;
    parsedText += getDepthTaps(depth) + "]";

    return parsedText;
  }

  function getArrayInner(innerData) {
    var parsedText = "";
    var lastIndex = innerData.length - 1;

    for (var i = 0; i < innerData.length; i++) {
      var parsedElement = innerData[i];
      parsedText += getDepthTaps(depth);
      parsedText += getBlockInner(parsedElement)

      if (i != lastIndex) {
        parsedText += ", "
      }
      parsedText += "\n"
    }

    return parsedText;
  }

  function getObjectInner(innerData) {
    var parsedText = "";

    for (key in innerData) {
      console.log(key)

      var parsedElement = innerData[key];

      if (parsedText !== "") {
        parsedText += ",\n";
      }

      parsedText += getDepthTaps(depth);
      parsedText += '"' + key + '" : ';

      parsedText += getBlockInner(parsedElement);
    }

    return parsedText;
  }

  function getBlockInner(parsedElement) {
    var parsedText = "";
    var elementType = Object.prototype.toString.call(parsedElement);
    dataCount[elementType]++;

    switch (elementType) {
      case "[object Object]":
        parsedText += readObject(parsedElement);
        break;
      case "[object Array]":
        parsedText += readArray(parsedElement);
        break;
      case "[object String]":
        parsedText += readValue('"' + parsedElement + '"');
        break;
      case "[object Number]":
        parsedText += readValue(parsedElement);
        break;
      case "[object Boolean]":
        parsedText += readValue(parsedElement);
        break;
    }
    return parsedText;
  }

  function getDepthTaps(depth) {
    var taps = "";
    for (var i = 0; i < depth; i++) {
      taps += "  "
    }
    return taps;
  }

  return display;
})();

module.exports = jsonReader;