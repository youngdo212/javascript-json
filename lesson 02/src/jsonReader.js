var jsonReader = (function () {
  var dataCount = { array: 0, object: 0, string: 0, number: 0, boolean: 0 };
  var depth;
  var line;

  var display = function (parsedData) {
    depth = 0, line = 0;
    var parsedText = getArrayInner(parsedData);
    displayText(parsedText)
  }

  var getArrayInner = function (parsedData) {
    var parsedText = "";

    parsedData.forEach(function (parsedElement) {
      if (Array.isArray(parsedElement)) {
        parsedText += readType.array();
      } else {
        parsedText += readType[parsedElement]();
      }
    });

    return parsedText;
  }


  var readType = {
    string: function () {

    },
    number: function () {

    },
    boolean: function () {

    },
    object: function () {

    },
    array: function () {
      var parsedText = "";
      parsedText += addDepthTaps()
      parsedText += "[\n";
      depth++;
      getArrayInner()
      parsedText += addDepthTaps()
      parsedText += "]\n"
      return parsedText;
    },
  }

  var countArray = function (parsedArray) {
    parsedArray.forEach(function (data) {
      if (data) {

      } else if (data) {
        countObject()
      } else {
        dataCount[typeof data]++;
      }
    })
  }

  var countObject = function (parsedObject) {

  }
})();

module.exports = jsonReader;