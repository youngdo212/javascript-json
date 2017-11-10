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
    // console.log(innerData)

    innerData.forEach(function (parsedElement) {
      if (Array.isArray(parsedElement)) {
        parsedText += readType.array(parsedElement);
        dataCount.array++;
      } else {
        parsedText += readType[parsedElement]();
        dataCount[parsedElement]++;
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
    array: function (innerData) {
      var parsedText = "";
      console.log(innerData)

      if (innerData.length === 0) {
        return getDepthTaps(depth) + "[]" + "\n";
      }

      parsedText += getDepthTaps(depth) + "[\n";

      depth++;
      parsedText += getArrayInner(innerData)
      depth--;

      parsedText += getDepthTaps(depth) + "]\n";

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

  var getDepthTaps = function (depth) {
    var taps = "";
    for (var i = 0; i < depth; i++) {
      taps += "  "
    }
    return taps;
  }

  var countObject = function (parsedObject) {

  }

  return display;
})();

module.exports = jsonReader;