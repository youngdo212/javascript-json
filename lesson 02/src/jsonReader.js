var jsonReader = (function () {
  var dataCount = { array: 0, object: 0, string: 0, number: 0, boolean: 0 };
  var depth;
  var parsedText;

  var display = function (parsedData) {
    depth = 0, parsedText = "";
    getArrayInner(parsedData);
    console.log(parsedText);
    return dataCount;
  }

  var getArrayInner = function (innerData) {
    var lastIndex = innerData.length - 1;

    for (var i = 0; i < innerData.length; i++) {
      var parsedElement = innerData[i];

      if (Array.isArray(parsedElement)) {
        readType.array(parsedElement);
        dataCount.array++;
      } else if (typeof parsedElement === "object") {
        readType[typeof parsedElement](parsedElement);
        dataCount[typeof parsedElement]++;
      } else {
        addDepthTaps(depth);
        readType[typeof parsedElement](parsedElement);
        dataCount[typeof parsedElement]++;
      }

      if (i != lastIndex) {
        parsedText += ", "
      }
      parsedText += "\n"
    }
  }

  var readType = {
    string: function (parsedElement) {
      parsedText += '"' + parsedElement + '"';
    },

    number: function (parsedElement) {
      parsedText += parsedElement;
    },

    boolean: function (parsedElement) {
      parsedText += parsedElement;
    },

    object: function (innerData) {
      parsedText += "{\n"
      addDepthTaps(depth)
      depth++;
      getObjectInner(innerData)
      depth--;
      parsedText += "\n"
      addDepthTaps(depth)
      parsedText += "}";
    },

    array: function (innerData) {
      addDepthTaps(depth)
      parsedText += "[\n";
      depth++;
      parsedText += getArrayInner(innerData)
      depth--;
      addDepthTaps(depth)
      parsedText += "]";
    },
  }

  var getObjectInner = function (innerData) {
    for (key in innerData) {
      var parsedElement = innerData[key];

      if (parsedText !== "") {
        parsedText += ",\n";
      }

      addDepthTaps(depth);
      parsedText += '"' + key + '" : ';

      if (Array.isArray(parsedElement)) {
        readType.array(parsedElement);
        dataCount.array++;
      } else {
        readType[typeof parsedElement](parsedElement);
        dataCount[typeof parsedElement]++;
      }
    }
  }

  var addDepthTaps = function (depth) {
    for (var i = 0; i < depth; i++) {
      parsedText += "  "
    }
  }

  return display;
})();

module.exports = jsonReader;