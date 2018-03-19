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
      case 'f':
      case 'n':
        parseBool();
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




function parseBool() {
  cursor = cursor + 1;
  if (input.charAt(cursor) === 'r') {
    cursor = cursor + 1;
    if (input.charAt(cursor) === 'u') {
      cursor = cursor + 1;
      if (input.charAt(cursor) === 'e') {
        flags.isBool++;
      } else {
        throw new Error("error입니다")
      }
    } else {
      throw new Error("error입니다")
    }
  } else if (input.charAt(cursor) === 'a') {
    cursor = cursor + 1;
    if (input.charAt(cursor) === 'l') {
      cursor = cursor + 1;
      if (input.charAt(cursor) === 's') {
        cursor = cursor + 1;
        if (input.charAt(cursor) === 'e') {
          flags.isBool++;
        } else {
          throw new Error("error입니다")
        }
      } else {
        throw new Error("error입니다")
      }
    } else {
      throw new Error("error입니다")
    }
  } else if (input.charAt(cursor) === 'n') {
    cursor = cursor + 1;
    if (input.charAt(cursor) === 'u') {
      cursor = cursor + 1;
      if (input.charAt(cursor) === 'l') {
        cursor = cursor + 1;
        if (input.charAt(cursor) === 'l') {
          flags.isBool++;
        } else {
          throw new Error("error입니다")
        }
      } else {
        throw new Error("error입니다")
      }
    } else {
      throw new Error("error입니다")
    }
  }
  cursor = cursor + 1;
  if (!(/\,|\s|\}|\]/g.test(input.charAt(cursor)))) {
    throw new Error("error입니다")
  }
}