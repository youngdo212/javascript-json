var jsonReader = (function () {
  var dataCount = { array: 0, object: 0, string: 0, number: 0, boolean: 0 };
  var depth = 0;

  var display = function (parsedData) {
    depth = 0;
    var parsedText = getArrayInner(parsedData);
    console.log(parsedText);
    return dataCount;
  }

  var getArrayInner = function (innerData) {
    var parsedText = "";

    for (var i = 0; i < innerData.length; i++) {
      var parsedElement = innerData[i];

      if (Array.isArray(parsedElement)) {
        parsedText += readArray(parsedElement);
        dataCount.array++;
      } else if (parsedElement instanceof Object) {
        parsedText += readObject(parsedElement);
        dataCount.object++;
      } else {
        parsedText += parsedElement;
        dataCount[typeof parsedElement]++;
      }

      if (i != innerData.length - 1) {
        parsedText += ", "
      }
      parsedText += "\n"
    }

    return parsedText;
  }

  var readArray = function (innerData) {
    var parsedText = "";

    parsedText += getDepthTaps(depth) + "[\n";
    depth++;
    parsedText += getArrayInner(innerData)
    depth--;
    parsedText += getDepthTaps(depth) + "]";

    return parsedText;
  }

  var readObject = function () {
    var parsedText = "";

    parsedText += getDepthTaps(depth) + "[\n";
    depth++;
    parsedText += getObjectInner(innerData)
    depth--;
    parsedText += getDepthTaps(depth) + "]";

    return parsedText;
  }

  var getObjectInner = function () {

  }

  var getDepthTaps = function (depth) {
    var taps = "";
    for (var i = 0; i < depth; i++) {
      taps += "  "
    }
    return taps;
  }

  return display;
})();

module.exports = jsonReader;