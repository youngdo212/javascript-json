// var readline = require("readline");

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// function IO() {
//   rl.question("분석할 JSON 데이터를 입력하세요.\n", function(input) {
//     controller(input);
//   });
// }

// console.log(
//   controller(
//     `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : ["hana", "hayul", "haun"] }`
//   ) === "지원하지 않는 형식을 포함하고 있습니다."
// );

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

function printCheckResult(
  type,
  { element, bool, num, str, obj, arr, err, print }
) {
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

  if (arr !== 0) {
    tempArr.push(`배열 ${arr}개`);
  }

  if (err !== 0) {
    return `지원하지 않는 형식을 포함하고 있습니다.`;
  }

  if (Object.keys(print).length > 0) {
    console.log(print);
  }

  return `총 ${element}개의 ${type === "{}"
    ? "객체"
    : type === "[]" ? "배열" : ""} 데이터 중에 ${tempArr.join(", ")}가 포함되어 있습니다.`;
}

function typeCheck(result, input) {
  if (isNum(input)) {
    result.num += 1;
    result.type = "number";
  } else if (isBool(input)) {
    result.bool += 1;
    result.type = "boolean";
  } else if (isStr(input)) {
    result.str += 1;
    result.type = "string";
  }

  return result;
}

function typeCasting({ type }, value) {
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
      return value.slice(2, -1);
    }
  };

  return obj[type]();
}

function checkArray(input) {
  // var manipulatedInput = input.slice(2, -2).replace(/\s/g, "");
  var manipulatedInput = input.slice(2, -2);
  var stack = "";
  var objCheck = 0;
  var arr = [];
  var isArr = 0;
  var objIndex = 0;
  var isValue = 0;
  var valueIndex = 0;
  var result = {
    element: 0,
    bool: 0,
    num: 0,
    str: 0,
    obj: 0,
    err: 0,
    type: "",
    print: {}
  };

  for (var i = 0; i < manipulatedInput.length; i += 1) {
    var target = manipulatedInput[i];

    if (target === "{") {
      objCheck = 1;
      objIndex = i;
    } else if (target === "}") {
      objCheck = 0;
      var { print } = checkObject(manipulatedInput.slice(objIndex, i + 1));
      arr.push(print);
      objIndex = 0;
      result.obj += 1;
      result.element += 1;
    } else if (objCheck === 1) {
      continue;
    } else if (objCheck !== 1) {
      if (target === "[") {
        isArr = 1;
        arr.push([]);
      }

      if (target === "]") {
        result.arr = 1;
        result.element += 1;
        isArr = 0;
        continue;
      }

      if (target === ":") {
        result.err = 1;
        break;
      }

      if (target == `"` && isValue === 0) {
        isValue = 1;
        valueIndex = i + 1;
      }

      if (target !== "," || i === manipulatedInput.length - 1) {
        stack += target;
      }

      if (
        (target === "," || i === manipulatedInput.length - 1) &&
        stack !== ""
      ) {
        result = typeCheck(result, stack);
        result.element += 1;

        if (isArr === 1) {
          arr[arr.length - 1].push(manipulatedInput.slice(valueIndex, i - 1));
        }

        stack = "";
      }
    }
  }

  if (arr.length !== 0) {
    console.log(arr);
  }

  return result;
}

function checkObject(input) {
  // var manipulatedInput = input.slice(2, -2).replace(/\s/g, "");
  var manipulatedInput = input.slice(2, -2);
  var stack = "";
  var isValue = 0;
  var isArr = 0;
  var isKey = 0;
  var keyIndex = 0;
  var valueIndex = 0;
  var keyTemp = "";
  var valueTemp = "";
  var obj = {};
  var result = {
    element: 0,
    bool: 0,
    num: 0,
    str: 0,
    obj: 0,
    arr: 0,
    err: 0,
    print: {}
  };

  for (var i = 0; i < manipulatedInput.length; i += 1) {
    var target = manipulatedInput[i];

    if (
      (target === `'` && isValue === 0) ||
      (target === `"` && manipulatedInput[i - 1] === `"`)
    ) {
      result.err = 1;
      return result;
    }

    if (isKey === 0 && isValue === 0 && target === `"`) {
      isKey = 1;
      keyIndex = i + 1;
    } else if (isKey === 1 && target === `"`) {
      keyTemp = manipulatedInput.slice(keyIndex, i);
      isKey = 0;
      keyIndex = 0;
    }

    if (isValue === 1 && target === "[") {
      isArr = 1;
    }

    if (isValue === 1 && target === "]") {
      isArr = 0;
      result.arr = 1;
      result.element += 1;
      continue;
    }

    if (isArr === 1) {
      continue;
    }

    if (target === ":") {
      isValue = 1;
      valueIndex = i + 1;
    } else if (
      (isValue === 1 && manipulatedInput[i - 1] !== `:`) ||
      i === manipulatedInput.length - 1
    ) {
      stack += target;
    }

    if (target === "," || i === manipulatedInput.length - 1) {
      result = typeCheck(result, stack);
      result.element += 1;
      var checkI = i === manipulatedInput.length - 1 ? i + 1 : i;
      var checkValueIndex =
        manipulatedInput[valueIndex + 1] !== `"` ? valueIndex + 1 : valueIndex;

      valueTemp = typeCasting(
        result,
        manipulatedInput.slice(checkValueIndex, checkI)
      );

      obj[keyTemp] = valueTemp;

      isValue = 0;
      valueIndex = 0;
      valueTemp = "";
      keyTemp = "";
      stack = "";
    }
  }

  result.print = obj;

  return result;
}

function controller(response) {
  if (isArray(response)) {
    return printCheckResult("[]", checkArray(response));
  } else if (isObject(response)) {
    return printCheckResult("{}", checkObject(response));
  }

  // rl.close();
}

// IO();

console.log(
  controller(`[ 10, 21, 4, 314, 99, 0, 72 ]`) ===
    "총 7개의 배열 데이터 중에 숫자 7개가 포함되어 있습니다."
);
console.log(
  controller(`[ 10, "jk", 4, "314", 99, "crong", false ]`) ===
    "총 7개의 배열 데이터 중에 부울 1개, 숫자 3개, 문자열 3개가 포함되어 있습니다."
);
console.log(
  controller(
    `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }`
  ) === "총 4개의 객체 데이터 중에 부울 1개, 숫자 1개, 문자열 2개가 포함되어 있습니다."
);
console.log(
  controller(
    `[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOUN JISU", "alias" : "crong", "level" : 4, "married" : true } ]`
  ) === `총 2개의 배열 데이터 중에 객체 2개가 포함되어 있습니다.`
);
console.log(controller(`[ "name" : "KIM JUNG" ]`) === "지원하지 않는 형식을 포함하고 있습니다.");
console.log(controller(`{ "name" : "KIM JUNG' }`) === "지원하지 않는 형식을 포함하고 있습니다.");
console.log(
  controller(`{ "name" : "KIM JUNG" "alias" : "JK" }`) ===
    "지원하지 않는 형식을 포함하고 있습니다."
);
console.log(
  controller(
    `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }`
  ) === "총 4개의 객체 데이터 중에 부울 1개, 숫자 1개, 문자열 2개가 포함되어 있습니다."
);
console.log(
  controller(
    `[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOON JISU", "alias" : "crong", "level" : 4, "married" : true } ]`
  ) === "총 2개의 배열 데이터 중에 객체 2개가 포함되어 있습니다."
);
console.log(
  controller(
    `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : ["hana", "hayul", "haun"] }`
  ) === "총 4개의 객체 데이터 중에 숫자 1개, 문자열 2개, 배열 1개가 포함되어 있습니다."
);
console.log(
  controller(
    `[ { "name" : "master's course", "opened" : true }, [ "java", "javascript", "swift" ] ]`
  ) === "총 2개의 배열 데이터 중에 객체 1개, 배열 1개가 포함되어 있습니다."
);

console.log(
  controller(
    `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : ["hana", "hayul", "haun"] }`
  )
);
console.log("\n");
console.log(
  controller(
    `[ { "name" : "master's course", "opened" : true }, [ "java", "javascript", "swift" ] ]`
  )
);
