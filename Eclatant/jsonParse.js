// var readline = require("readline");

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// function IO() {
//   rl.question("분석할 JSON 데이터를 입력하세요.\n", function(input) {
//     try {
//       controller(input);
//     } catch ({ user, developer }) {
//       console.log(user);
//       console.log(developer);
//     }
//   });
// }

// IO();

function ParseError(message, funcName) {
  this.user = "지원하지 않는 형식을 포함하고 있습니다.";
  this.developer = `${message} ${funcName}` || "Error";
}

ParseError.prototype = new Error();
ParseError.prototype.constructor = ParseError;

function isArray(input) {
  return /^\[.+\]$/.test(input);
}

function isObject(input) {
  return /^\{.+\}$/.test(input);
}

function isNum(input) {
  return !isNaN(parseInt(input));
}

function isBool(input) {
  return input === "true" || input === "false";
}

function isStr(input) {
  return typeof input === "string";
}

function checkType(result, input) {
  if (isNum(input)) {
    result.numCount += 1;
    result.type = "number";
  } else if (isBool(input)) {
    result.boolCount += 1;
    result.type = "boolean";
  } else if (isStr(input)) {
    result.strCount += 1;
    result.type = "string";
  }

  result.element += 1;

  return result;
}

function getCastedValue({ type }, value) {
  var obj = {
    number() {
      return parseInt(value);
    },
    boolean() {
      if (value === "true") {
        return true;
      } else if (value === "false") {
        return false;
      }
    },
    string() {
      return value.slice(1, -1);
    }
  };

  return obj[type]();
}

function controller(response) {
  try {
    if (isArray(response)) {
      return printCheckedResult("[]", checkArray(response));
    } else if (isObject(response)) {
      return printCheckedResult("{}", checkObject(response));
    }
  } catch ({ user, developer }) {
    console.log(user);
    console.log(`${developer}\n`);
  }

  // rl.close();
}

function printCheckedResult(
  type,
  { element, strCount, numCount, boolCount, objCount, arrCount, parsed }
) {
  var tempArr = [];
  var msg = "";

  if (strCount !== 0) {
    tempArr.push(`문자열 ${strCount}개`);
  }

  if (numCount !== 0) {
    tempArr.push(`숫자 ${numCount}개`);
  }

  if (boolCount !== 0) {
    tempArr.push(`부울 ${boolCount}개`);
  }

  if (objCount !== 0) {
    tempArr.push(`객체 ${objCount}개`);
  }

  if (arrCount !== 0) {
    tempArr.push(`배열 ${arrCount}개`);
  }

  console.log(parsed);

  msg = `총 ${element}개의 ${type === "{}" ? "객체" : "배열"} 데이터 중에 ${tempArr.join(
    ", "
  )}가 포함되어 있습니다.\n`;

  console.log(msg);

  return msg;
}

function checkArray(jsonString) {
  var manipulatedString = jsonString.slice(2, -2);
  var len = manipulatedString.length;
  var beginIndex = -1;
  var quotationSwitch = false;
  var objectSwitch = false;
  var arrayCheck = 0;
  var checkedResult = {
    element: 0,
    strCount: 0,
    numCount: 0,
    boolCount: 0,
    objCount: 0,
    arrCount: 0,
    type: "",
    parsed: []
  };

  for (var i = 0; i < len; i += 1) {
    var target = manipulatedString[i];

    if (target === " ") {
      continue;
    }

    if (target === `]` && !objectSwitch) {
      arrayCheck -= 1;

      if (arrayCheck === 0) {
        var { parsed: parsedArray } = checkArray(
          manipulatedString.slice(beginIndex, i + 1)
        );

        checkedResult.parsed.push(parsedArray);
        checkedResult.element += 1;
        checkedResult.arrCount += 1;

        beginIndex = -1;
        continue;
      }

      continue;
    } else if (arrayCheck > 1) {
      continue;
    }

    if (target === "[" && !objectSwitch) {
      // if (arrayCheck > 1) {
      //   throw new ParseError(`User가 [ 이후에 [ 를 사용하였습니다`, `checkArray()`);
      // }

      arrayCheck += 1;

      if (arrayCheck === 1) {
        beginIndex = i;
      }

      continue;
    }

    if (target === "{") {
      objectSwitch = true;
      beginIndex = i;
    }

    if (target === "}") {
      var { parsed: parsedObject } = checkObject(
        manipulatedString.slice(beginIndex, i + 1)
      );

      checkedResult.parsed.push(parsedObject);
      checkedResult.objCount += 1;
      checkedResult.element += 1;

      objectSwitch = false;
      beginIndex = -1;
      continue;
    } else if (objectSwitch) {
      continue;
    }

    if (target === "," && beginIndex !== -1) {
      checkedResult = checkType(
        checkedResult,
        manipulatedString.slice(beginIndex, i)
      );

      checkedResult.parsed.push(
        getCastedValue(checkedResult, manipulatedString.slice(beginIndex, i))
      );

      beginIndex = -1;
      continue;
    }

    if (target === `"`) {
      quotationSwitch = quotationSwitch ? false : true;
    }

    if (target !== `"` && i === len - 1 && quotationSwitch === true) {
      throw new ParseError(`User가 "를 누락하였습니다.`, `checkArray()`);
    }

    if (target === ":" && objectSwitch === false) {
      throw new ParseError(`User가 배열 안에서 :를 사용하였습니다.`, `checkArray()`);
    }

    if (i === len - 1) {
      checkedResult = checkType(
        checkedResult,
        manipulatedString.slice(beginIndex)
      );

      checkedResult.parsed.push(
        getCastedValue(checkedResult, manipulatedString.slice(beginIndex))
      );

      beginIndex = -1;
      continue;
    }

    if (beginIndex === -1 && target !== " " && target !== ",") {
      beginIndex = i;
    }
  }

  return checkedResult;
}

function checkObject(jsonString) {
  var manipulatedString = jsonString.slice(2, -2);
  var len = manipulatedString.length;
  var beginIndex = -1;
  var isKey = false;
  var isValue = false;
  var keyTemp = "";
  var arraySwitch = false;
  var quotationCount = 0;
  var checkedResult = {
    element: 0,
    strCount: 0,
    numCount: 0,
    boolCount: 0,
    objCount: 0,
    arrCount: 0,
    type: "",
    parsed: {}
  };

  for (var i = 0; i < len; i += 1) {
    var target = manipulatedString[i];

    if (target === `"`) {
      quotationCount += 1;
    }

    if (target === "[") {
      arraySwitch = true;
      beginIndex = i;
    }

    if (target === "]" && arraySwitch) {
      var { parsed: parsedArray } = checkArray(
        manipulatedString.slice(beginIndex, i + 1)
      );

      checkedResult.parsed[keyTemp] = parsedArray;
      checkedResult.arrCount += 1;
      checkedResult.element += 1;

      arraySwitch = false;
      beginIndex = -1;
      continue;
    } else if (arraySwitch) {
      continue;
    }

    if (quotationCount > 2) {
      throw new ParseError(`"가 세 번 나왔습니다.`, `checkObject()`);
    }

    if (target === ":") {
      isValue = true;
      isKey = false;
      beginIndex = i + 2;
      quotationCount = 0;
    }

    if (!isKey && !isValue && target === `"`) {
      isKey = true;
      beginIndex = i + 1;
    } else if (isKey && !isValue && target === `"`) {
      isKey = false;
      keyTemp = manipulatedString.slice(beginIndex, i);
    }

    if (isValue && target === "," && beginIndex !== -1) {
      checkedResult = checkType(
        checkedResult,
        manipulatedString.slice(beginIndex, i)
      );

      checkedResult.parsed[keyTemp] = getCastedValue(
        checkedResult,
        manipulatedString.slice(beginIndex, i)
      );

      keyTemp = "";
      isValue = false;
      beginIndex = -1;
      quotationCount = 0;
      continue;
    }

    if (isValue && i === len - 1 && quotationCount !== 1) {
      checkedResult = checkType(
        checkedResult,
        manipulatedString.slice(beginIndex)
      );

      checkedResult.parsed[keyTemp] = getCastedValue(
        checkedResult,
        manipulatedString.slice(beginIndex)
      );

      beginIndex = -1;
      keyTemp = "";
      isValue = false;
    }

    if (i === len - 1 && quotationCount === 1) {
      throw new ParseError(`"가 닫히지 않았습니다.`, `checkObject()`);
    }
  }

  return checkedResult;
}

// controller(`[ 10, 21, 4, 314, 99, 0, 72 ]`);
// controller(`[ 10, "jk", 4, "314", 99, "crong", false ]`);
// controller(
//   `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }`
// );
// controller(
//   `[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOUN JISU", "alias" : "crong", "level" : 4, "married" : true } ]`
// );
// controller(`[ "name" : "KIM JUNG" ]`);
// controller(`{ "name" : "KIM JUNG' }`);
// controller(`{ "name" : "KIM JUNG" "alias" : "JK" }`);
// controller(
//   `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }`
// );
// controller(
//   `[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOON JISU", "alias" : "crong", "level" : 4, "married" : true } ]`
// );
// controller(
//   '{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : ["hana", "hayul", "haun"] }'
// );
// controller(
//   `[ { "name" : "master's course", "opened" : true }, [ "java", "javascript", "swift" ] ]`
// );
// controller(
//   `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : [ "hana", "hayul", "haun" ] }`
// );
// controller(
//   `[ { "name" : "master's course", "opened" : true }, [ "java", "javascript", "swift" ] ]`
// );

controller(`[ "a", [ "b" ], [ [ "c" ] ] ]`);
// controller(`[ [ "c" ] ]`);
// controller(`[ { "a" : [ "b" , { "c": { "d" : "e" } } ] } ]`);
// controller(`[ 012345 ]`);
// controller(`[ 1 23 ]`);
// controller(`[ { "a" : 1 , "b" : [ 1, 2, 3 ] }, [ 4, 5, 6 ] ]`);
// controller(`[ undefined ]`);
