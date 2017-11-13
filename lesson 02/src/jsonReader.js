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
        parsedText += readType.array(parsedElement);
        dataCount.array++;
      } else {
        parsedText += readType[typeof parsedElement](parsedElement);
        dataCount[typeof parsedElement]++;
      }

      if (i != innerData.length - 1) {
        parsedText += ", "
      }
      parsedText += "\n"
    }

    return parsedText;
  }

  var readType = {
    string: function (parsedElement) {
      var parsedText = "";
      parsedText += parsedElement;
    },

    number: function (parsedElement) {
      var parsedText = "";
      parsedText += parsedElement;
    },

    boolean: function (parsedElement) {
      var parsedText = "";
      parsedText += parsedElement;
    },

    object: function (innerData) {
      var parsedText = "";

      parsedText += getDepthTaps(depth) + "{\n";
      depth++;
      parsedText += getObjectInner(innerData)
      depth--;
      parsedText += getDepthTaps(depth) + "}";

      return parsedText;
    },
    array: function (innerData) {
      var parsedText = "";

      parsedText += getDepthTaps(depth) + "[\n";
      depth++;
      parsedText += getArrayInner(innerData)
      depth--;
      parsedText += getDepthTaps(depth) + "]";

      return parsedText;
    },
  }

  var getObjectInner = function (innerData) {
    var parsedText = "";

    for (key in innerData) {
      var parsedElement = innerData[key];
      parsedText += key + ": ";

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
    }

    return parsedText;
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