var jsonReader = (function () {
  var dataCount = { array: 0, object: 0, string: 0, number: 0, boolean: 0 };
  var depth = 0;

  var display = function (parsedData) {
    var readData = {};
    depth = 0;

    readData.data = getArrayInner(parsedData);
    readData.count = dataCount;
    return readData;
  }

  function string(parsedElement) {
    return this.value('"' + parsedElement + '"');
  }

  function number(parsedElement) {
    return this.value(parsedElement);
  }

  function boolean(parsedElement) {
    return this.value(parsedElement);
  }

  function value(parsedElement) {
    var parsedText = "";
    parsedText += parsedElement;
    return parsedText;
  }

  function object(innerData) {
    var parsedText = "";

    parsedText += getDepthTaps(depth) + "{\n";
    depth++;
    parsedText += getObjectInner(innerData)
    depth--;
    parsedText += "\n" + getDepthTaps(depth) + "}";

    return parsedText;
  }

  function array(innerData) {
    var parsedText = "";

    parsedText += getDepthTaps(depth) + "[\n";
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

      if (Array.isArray(parsedElement)) {
        parsedText += readType.array(parsedElement);
        dataCount.array++;
      } else if (typeof parsedElement === "object") {
        parsedText += readType[typeof parsedElement](parsedElement);
        dataCount[typeof parsedElement]++;
      } else {
        parsedText += getDepthTaps(depth);
        parsedText += readType[typeof parsedElement](parsedElement);
        dataCount[typeof parsedElement]++;
      }

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
      var parsedElement = innerData[key];

      if (parsedText !== "") {
        parsedText += ",\n";
      }

      parsedText += getDepthTaps(depth);
      parsedText += '"' + key + '" : ';

      console.log(Object.prototype.toString.call(parsedElement))
      if (Array.isArray(parsedElement)) {
        parsedText += readType.array(parsedElement);
        dataCount.array++;
      } else {
        parsedText += readType[typeof parsedElement](parsedElement);
        dataCount[typeof parsedElement]++;
      }
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