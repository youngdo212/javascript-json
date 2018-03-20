let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married": true }`;
// let input = `[ 10, "jk", 4, "314", 99, "name", "crong", true, false ]`;
// let input = `[ "name" : "KIM JUNG" ]`;
// let input = `{ "name" : "KIM JUNG" "alias" : "JK" }`;
// let input = `{ "name" : "KIM JUNG", "age" :  23, "alias" : "JK", "children" : ["hana", "hayul", "haun"], "level" : 5  }`;
// let input = `{ "name": "KIM JUNG", "alias"     : "JK", "level"  : 5, "married"   : true }`;
// let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : ["hana", "hayul", "haun"  ] }`

let char = null;
let temp = '';

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

  objects: {
    isKey: 0,
    isValue: 0
  },
}


let cursor = -1;
const init = () => {
  while (++cursor < input.length) {
    char = input[cursor];
    switch (char) {
      case '[':
        parseArray();
        continue;

      case '{':
        parseObject();
        continue;

      case ' ':
        // case ',':
        continue

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

function parseString() {
  cursor++;
  if (input.charAt(cursor) === '"') {
    cursor++;
    isBlank();
    if (input.charAt(cursor) === ',') {
      parseData.value.isStr++;
    }
  } else if (input.charAt(cursor) !== '"') {
    return parseString();
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
  } else {
    throw new Error('지원하지 않는 형식을 포함하고 있습니다');
  };
}


function parseObject() {
  if (input.charAt(cursor) === '{' && cursor === 0) {
    return parseData.data.isObject++;
    cursor++;
  }
}


function parseArray() {
  if (input.charAt(cursor) === '[' && cursor === 0) {
    return parseData.data.isArray++;
  }
}



console.log(init());