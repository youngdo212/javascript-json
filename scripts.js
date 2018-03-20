let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married": true }`;
// let input = `[ 10, "jk", 4, "314", 99, "name", "crong", true, false ]`;
// let input = `[ "name" : "KIM JUNG" ]`;
let flags = {
  isObject: 0,
  isArray: 0,
  isStr: 0,
  isNum: 0,
  isBool: 0,
  isKey: 0,
  isValue: 0
}

let arr = []

let cursor = -1;
const init = () => {

  while (++cursor < input.length) {
    let char = input[cursor];

    switch (char) {
      case '[':
      case '{':
        checkTypes();
        continue;

      case ']':
      case '}':
        break;

      case ' ':
      case ',':
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

      case 't':
        parseBool('true');
      case 'f':
        parseBool('false');
      case 'n':
        parseBool('null');
        continue;
    }
  }
  return flags;
}

console.log(init());



function checkTypes() {
  if (input.charAt(0) === '[' && input.charAt(input.length - 1) === ']') {
    return flags.isArray++
  } else if (input.charAt(0) === '{' && input.charAt(input.length - 1) === '}') {
    return flags.isObject++
  }
}



function checkValid() {
  return /\:/.test(input.charAt(cursor)) ? parseKey() : flags.isStr++;
}


function parseString() {
  cursor = cursor + 1;
  if (input.charAt(cursor) === '"') {
    cursor = cursor + 1;
    if (/\,|\s|\}|\]/.test(input.charAt(cursor))) {
      cursor = cursor + 1;
      checkValid()
    } else {
      checkValid()
    }
  } else {
    parseString();
  }
}


function parseKey() {
  return flags.isKey++;
}


function parseNumber() {
  cursor = cursor + 1;
  if (/\,|\s|\}|\]/g.test(input.charAt(cursor))) {
    flags.isNum++;
  } else if (typeof (input.charAt(cursor) * 1) === 'number') {
    parseNumber();
  }
}



function parseBool(bools) {
  return input.slice(cursor, cursor + bools.length) === bools ? flags.isBool++ : new Error("에러 발생");
}