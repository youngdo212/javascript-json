var countType = function (parsedArray) {
  var dataCount = { string: 0, number: 0, boolean: 0 };
  parsedArray[0].forEach(function (data) {
    dataCount[typeof data]++;
  })
  return dataCount;
}

module.exports = countType;