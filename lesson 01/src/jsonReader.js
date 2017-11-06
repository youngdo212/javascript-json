var countType = function (parsedArray) {
  var dataCount = { array: 0, string: 0, number: 0, bool: 0 };
  parsedArray.forEach(function (data) {
    if (data === "array start") {
      dataCount.array++;
    } else if (data === "array end") {
    } else if (typeof data === "string") {
      dataCount.string++;
    } else if (typeof data === "number") {
      dataCount.number++;
    } else if (typeof data === "boolean") {
      dataCount.bool++;
    }
  })
  return dataCount;
}
