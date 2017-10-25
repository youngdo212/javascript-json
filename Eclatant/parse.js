var readline = require("readline");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function isBool(input) {
  return input === "true" || input === "false";
}

function isNum(input) {
  return !isNaN(parseInt(input));
}

function isStr(input) {
  return typeof input === "string";
}

function checkArray(input) {
  var inputToArray = input.slice(2, -2).split(", ");
  var str = 0;
  var num = 0;
  var bool = 0;

  inputToArray.forEach(function(v) {
    if (isBool(v)) {
      bool += 1;
    } else if (isNum(v)) {
      num += 1;
    } else if (isStr(v)) {
      str += 1;
    }
  });

  return {
    leng: inputToArray.length,
    bool,
    num,
    str
  };
}

function arrayParse({ leng, bool, num, str }) {
  var tempArr = [];

  if (str !== 0) {
    tempArr.push(`문자열 ${str}개`);
  }

  if (num !== 0) {
    tempArr.push(`숫자 ${num}개`);
  }

  if (bool !== 0) {
    tempArr.push(`부울 ${bool}개`);
  }

  return `총 ${leng}개의 데이터 중에 ${tempArr.join(", ")}가 포함되어 있습니다.`;
}

function jsonParse() {
  rl.question("분석할 JSON 데이터를 입력하세요.\n", function(input) {
    if (/^\[.+\]$/.test(input)) {
      console.log(arrayParse(checkArray(input)));
    } else if (/^\{.+\}$/.test(input)) {
      // console.log(objectParse(checkObject(input)));
    }

    rl.close();
  });
}

jsonParse();

module.exports = {
  checkArray,
  arrayParse,
  jsonParse
};
