// let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married": true }`;
// let input = `[ 10, "jk", 4, "314", 99, "name", "crong", true, false ]`;
// let input = `[ "name" : "KIM JUNG" ]`;
// let input = `{ "name" : "KIM JUNG" "alias" : "JK" }`;
// let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "children" : ["hana", "hayul", "haun"] }`;
// let input = `{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }`;


let flags = {
  isObject: 0,
  isArray: 0,
  isStr: 0,
  isNum: 0,
  isBool: 0,
  isKey: 0,
  isValue: 0
}


let cursor = -1;
const init = () => {
  while (++cursor < input.length) {
    let char = input[cursor];

    switch (char) {
      case '[':
        checkArr();
        continue;

      case '{':
        checkObj();
        continue;

      case ' ':
      case ',':
        continue;
        
        case ':':
        checkValid();
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
        debugger;
        parseBool('true');
        continue;
      case 'f':
        parseBool('false');
        continue;
      case 'n':
        parseBool('null');
        continue;
    }
  }
  return flags;
}


function checkArr() {
  if (input.charAt(0) === '[' && input.charAt(input.length - 1) === ']') {
    flags.isArray++
      return true;
  }
}


function checkObj() {
  if (input.charAt(0) === '{' && input.charAt(input.length - 1) === '}') {
    flags.isObject++
      return true;
  }
}

function checkValid() {
  return /\:/.test(input.charAt(cursor)) ? parseKey() : flags.isStr++;
}

function parseKey() {
  if (checkArr()) {
    throw new Error("에러 발생")
  } else {
    return flags.isKey++;
  }
}




function parseString() {
  cursor = cursor + 1;
  if (input.charAt(cursor) === '"') {
    cursor = cursor + 1;
    if (/\,|\s|\}|\]/.test(input.charAt(cursor))) {
      cursor = cursor + 1;
      checkValid()
    } else if (/\:/.test(input.charAt(cursor))) {
      checkValid()
    } else {
      throw new Error("에러입니당");
    }
  } else {
    parseString();
  }
}




function parseNumber() {
  cursor = cursor + 1;
  if (/\,|\s|\}|\]/g.test(input.charAt(cursor))) {
    return flags.isNum++;
  } else if (typeof (input.charAt(cursor) * 1) === 'number') {
    parseNumber();
  }
}




function parseBool(bools) {
  if (input.slice(cursor, cursor + bools.length) === bools) {
    return flags.isBool++
  } else {
    throw new Error("에러 발생");
  };
}




console.log(init());