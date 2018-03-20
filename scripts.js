let input = '[ 10, "jk",4,"314", 99, "name", "crong", true, false ]';

let flags = {
  isObject: 0,
  isArray: 0,
  isStr: 0,
  isNum: 0,
  isBool: 0
}

let arr = []

let cursor = -1;
const init = () => {
  while (++cursor < input.length) {
    let char = input[cursor];
    switch (char) {
      case '[':
        flags.isArray++;
        continue;

      case '{':
        flags.isObject++;
        continue;

      case '}':
        break;

      case ']':
        break;

      case ' ':
      case ',':
        continue;

      case '"':
        parseString();
        continue;

      case 't':
        parseBool('true');
      case 'f':
        parseBool('false');
      case 'n':
        parseBool('null');
        continue;
      default:
        parseNumber();
    }
  }
  return flags;
}

console.log(init());



function parseString() {
  cursor = cursor + 1;
  if (input.charAt(cursor) === '"') {
    cursor = cursor + 1;
    if (/\,|\s|\}|\]/.test(input.charAt(cursor))) {
      cursor = cursor + 1;
      if (/[^\:]/.test(input.charAt(cursor))) {
        flags.isStr++
      }
    } else {
      parseString();
    }
  } else {
    parseString();
  }
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