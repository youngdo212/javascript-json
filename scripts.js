// let input = `[ 10, 21, 4, 314, 99, 0, 72 ]`;
// let input = `[ 10, "jk", 4, "314", 99, "crong", false ]`;
// let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }`;
// let input = `[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOUN JISU", "alias" : "crong", "level" : 4, "married" : true } ]`
// let input = `[ "name" : "KIM JUNG" ]`;
// let input = `{ "name" : "KIM JUNG' }`;
// let input = `{ "name" : "KIM JUNG" "alias" : "JK" }`;
// let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : [ "hana", "hayul", "haun" ] }`

let input = `[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOON JISU", "alias" : "crong", "level" : 4, "married" : true } ]`
let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : [ "hana", "hayul", "haun" ] }`;

let char = null;
let parseData = {
  data: {
    isObject: 0,
    isArray: 0
  },

  value: {
    isStr: 0,
    isNum: 0,
    isBool: 0,
    isObject: 0,
    isArray: 0
  },

  flags: {
    isObject: false,
    isArray: false
  },

  objects: {
    isKey: 0,
    isValue: 0
  }
}

let cursor = -1;
const init = () => {
  while (++cursor < input.length) {
    char = input[cursor];
    switch (char) {

      case '[':
        if ((input.charAt(cursor) === '[') && (cursor === 0)) {
          parseData.data.isArray++;
          cursor++
        } else {
          parseArray('[');
        }
        continue;

      case '{':
        if (input.charAt(0) === '{' && input.charAt(input.length - 1) === '}') {
          parseData.data.isObject++;
        } else {
          parseObject('{')
        }
        continue;

      case ' ':
        continue;

      case '"':
        parseString();
        continue;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        parseNumber();
        continue;

      case 't':
        parseBool('true');
        continue;
      case 'f':
        parseBool('false');
        continue;
      case 'n':
        parseBool('null');
        continue;

      default:
    }
  }
  return parseData;
}


function isBlank() {
  if (input.charAt(cursor).match(/\s+/g)) {
    cursor++;
    return isBlank();
  }
}


function parseArray(char) {
  if (cursor !== 0 && input.charAt(cursor) === char) {
    cursor++;
    parseData.flags.isArray = true;
    parseData.value.isArray++;
  } else {
    parseArray(char);
  }
}

function parseObject(char) {
  if (input.charAt(cursor) === char) {
    char++;
    parseData.flags.isObject = true;
    parseData.value.isObject++;
  } else {
    parseObject(char);
  }
}

function parseString() {
  cursor++;
  if (input.charAt(cursor) === '"') {
    cursor++;
    isBlank();
    if (input.charAt(cursor) === '"') {
      throw new Error('지원하지 않는 형식을 포함하고 있습니다');
    }

    if (input.charAt(cursor) === ',') {
      if (!parseData.value.isArray && !parseData.value.isObject) {
        parseData.value.isStr++;
      }
    }

    // if (input.charAt(cursor) === ']') {
    //   parseData.value.isArray++;
    // }

    if (input.charAt(cursor) === ':') {
      if (parseData.flags.isObject === false) {
        if (parseData.data.isArray) {
          throw new Error('지원하지 않는 형식을 포함하고 있습니다');
        }
      }
      parseData.objects.isKey++;
      cursor++;
    }

    if (cursor === input.length - 1) {
      parseData.value.isStr++;
    }

  } else if (input.charAt(cursor) === "'") {
    cursor++;
    isBlank();
    if (input.charAt(cursor) === "," || input.charAt(cursor) === "}") {
      throw new Error('지원하지 않는 형식을 포함하고 있습니다');
    } else {
      parseString();
    }
  } else {
    parseString();
  }
}

function parseValue() {
  cursor++;
  if (input.charAt(cursor) === '[') {} else {
    parseValue();
  }
}


function parseNumber() {
  cursor++;
  isBlank();
  if (/\,|\]|\}/g.test(input.charAt(cursor))) {
    return parseData.value.isNum++;
  } else if (typeof (input.charAt(cursor) * 1) === 'number') {
    parseNumber();
  }
}


function parseBool(bools) {
  if (input.slice(cursor, cursor + bools.length) === bools) {
    return parseData.value.isBool++
      // } else {
      // throw new Error('지원하지 않는 형식을 포함하고 있습니다');
  };
}


init();



let total = parseData.value.isStr + parseData.value.isNum + parseData.value.isBool;


const message = {
  array: `총 ${total}개의 데이터 중에 숫자 ${parseData.value.isNum}개, 문자열 ${parseData.value.isStr}개, 부울 ${parseData.value.isBool}개가 포함되어 있습니다.`,
  object: `총 ${parseData.objects.isKey}개의 객체 데이터 중에 문자열 ${parseData.value.isStr}개, 숫자 ${parseData.value.isNum}개, 부울 ${parseData.value.isBool}개, 배열 ${parseData.value.isArray}가 포함되어 있습니다.`,
  objectInArray: `총 ${parseData.value.isObject + parseData.value.isArray}개의 배열 데이터 중에 객체 ${parseData.value.isObject}개와 배열 ${parseData.value.isArray}개가 포함되어 있습니다.`
}




if (parseData.data.isArray) {
  if (parseData.value.isObject || parseData.value.isArray) {
    console.log(message.objectInArray);
  } else {
    console.log(message.array);
  }
} else if (parseData.data.isObject) {
  console.log(message.object);
}