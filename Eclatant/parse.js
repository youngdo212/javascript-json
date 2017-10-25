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

function printCheckResult(type, { leng, bool, num, str }) {
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

  return `총 ${leng}개의 ${type === "{}"
    ? "객체"
    : type === "[]" ? "배열" : ""} 데이터 중에 ${tempArr.join(", ")}가 포함되어 있습니다.`;
}

function checkObject(input) {
  var bool = 0;
  var num = 0;
  var str = 0;

  var targetArray = input.slice(2, -2).split(", ");

  targetArray.map(v => v.split(" : ")).forEach(v => {
    if (!/^".+"$/.test(v[0])) {
      throw new Error("잘못된 키입니다.");
    }

    if (isBool(v[1])) {
      bool += 1;
    } else if (isNum(v[1])) {
      num += 1;
    } else if (isStr(v[1])) {
      str += 1;
    }
  });

  return {
    leng: targetArray.length,
    bool,
    num,
    str
  };
}

function jsonParse() {
  rl.question("분석할 JSON 데이터를 입력하세요.\n", function(input) {
    if (/^\[.+\]$/.test(input)) {
      console.log(printCheckResult("[]", checkArray(input)));
    } else if (/^\{.+\}$/.test(input)) {
      try {
        console.log(printCheckResult("{}", checkObject(input)));
      } catch (err) {
        console.warn(err);
      }
    }

    rl.close();
  });
}

jsonParse();

module.exports = {
  printCheckResult,
  checkArray,
  checkObject,
  jsonParse
};
