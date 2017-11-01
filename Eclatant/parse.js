var readline = require("readline");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var check = {
  '"': -1,
  ":": -1,
  key: -1,
  curly: -1,
  bracket: -1
};

function isBool(input) {
  return input === "true" || input === "false";
}

function isNum(input) {
  return !isNaN(parseInt(input));
}

function isStr(input) {
  return typeof input === "string";
}

function isArray(input) {
  return /^\[.+\]$/.test(input);
}

function isObject(input) {
  return /^\{.+\}$/.test(input);
}

function checkArray(input) {
  var inputToArray = input.slice(2, -2).split(", ");
  var bool = 0;
  var num = 0;
  var str = 0;
  var obj = 0;

  var checkObject = input.match(/\{.+?\}/g);

  if (checkObject !== null) {
    return {
      leng: checkObject.length,
      bool,
      num,
      str,
      obj: checkObject.length
    };
  }

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
    str,
    obj
  };
}

function checkObject(input) {
  var bool = 0;
  var num = 0;
  var str = 0;
  var obj = 0;

  var targetArray = input.slice(2, -2).split(", ");

  targetArray.map(v => v.split(" : ")).forEach(v => {
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
    str,
    obj
  };
}

function printCheckResult(type, { leng, bool, num, str, obj }) {
  var tempArr = [];

  if (bool !== 0) {
    tempArr.push(`부울 ${bool}개`);
  }

  if (num !== 0) {
    tempArr.push(`숫자 ${num}개`);
  }

  if (str !== 0) {
    tempArr.push(`문자열 ${str}개`);
  }

  if (obj !== 0) {
    tempArr.push(`객체 ${obj}개`);
  }

  return `총 ${leng}개의 ${type === "{}"
    ? "객체"
    : type === "[]" ? "배열" : ""} 데이터 중에 ${tempArr.join(", ")}가 포함되어 있습니다.`;
}

function IO() {
  rl.question("분석할 JSON 데이터를 입력하세요.\n", function(input) {
    controller(input);
  });
}

function controller(response) {
  if (isArray) {
    console.log(printCheckResult("[]", checkArray(response)));
  } else if (isObject) {
    console.log(printCheckResult("{}", checkObject(response)));
  }

  rl.close();
}

IO();

module.exports = {
  printCheckResult,
  checkArray,
  checkObject
};
