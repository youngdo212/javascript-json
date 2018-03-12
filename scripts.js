// let answer = '{ "name" : "KIM JUNG"}';
// let answer = '{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married": true }';
// let answer = '[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOUN JISU", "alias" : "crong", "level" : 4, "married" : true }, { "name" : "JUNG HO", "alias" : "honux","level" : 1, "married" : true }]'
// let answer = '[ 10, "jk", 4, "314", 99, "name", "crong", false ]';


const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let tempStr = '';
let tempArr = [];
let is_ready_to_input_Data;

let message = {
  init: `분석할 JSON 데이터를 입력하세요. \n`,
  error: `지원하지 않는 형식을 포함하고 있습니다.`
}






const errCheck = {
  noColon: (answer) => {
    if ((answer.match(/\:/g) || []).length !== 0) {
      return message.error
    } else {
      return parseArrays(answer)
    }
  },
  properNotations: (answer) => {
    if ((answer.match(/\"/g) || []).length % 2 !== 0 || (answer.match(/\:/g) || []).length - (answer.match(/\,/g) || []).length !== 1) {
      return message.error
    } else {
      return parseObjects(answer) && parseValues(tempArr);
    }
  },
  locationOfBracket: (answer) => {
    if (answer.indexOf('{') < answer.indexOf('[')) {
      return message.error
    } else {
      return parseObjects(answer)
    }
  }
}


const checkRules = (answer) => {
  let pre = {
    leftBrace: answer.indexOf('{') !== -1,
    rightBrace: answer.indexOf('}') !== -1,

    leftBracket: answer.indexOf('[') !== -1,
    rightBracket: answer.indexOf(']') !== -1
  };

  let checker = {
    braces: pre.leftBrace && pre.rightBrace,
    brackets: pre.leftBracket && pre.rightBracket
  };


  if (checker.brackets) {
    if (checker.braces) {
      return errCheck.locationOfBracket(answer);
    } else if (!checker.braces) {
      return errCheck.noColon(answer);
    }
  }

  if (!checker.brackets) {
    if (checker.braces) {
      return errCheck.properNotations(answer);
    } else if (!checker.braces) {
      return message.error;
    }
  }
}


const parseArrays = (answer) => {
  let counts = {
    total: 0,
    number: 0,
    string: 0,
    boolean: 0
  };


  answer = answer.replace(/\[|\]/gi, '');
  for (let elem of answer) {
    tempStr += elem;
  };

  tempArr = tempStr.split(',').map(elem => {
    return elem.trim();
  });

  tempArr.forEach(elem => {
    counts.total++;
    if (elem.indexOf('"') !== -1) {
      counts.string++
    } else
    if (!isNaN(elem)) {
      counts.number++
    } else if (elem === 'true' || elem === 'false') {
      counts.boolean++
    }
  })

  if (counts.total === counts.string + counts.boolean + counts.number) {
    return `총 ${counts.total}개의 데이터 중에 문자열 ${counts.string}개, 숫자 ${counts.number}개, 부울 ${counts.boolean}개가 포함되어 있습니다.`
  } else {
    return message.error
  }
}


const parseObjects = (answer) => {

  let counts = {
    arrays: 0,
    objData: 0
  }

  for (let element of answer) {
    if (element === '{') {
      is_ready_to_input_Data = true;
    };
    if (is_ready_to_input_Data) {
      tempStr += element;
    };
    if (element === '}') {
      is_ready_to_input_Data = false;
      tempArr.push(tempStr);
      tempStr = '';
    }
  }

  counts.arrays = tempArr.length;

  for (let i = 0; i < tempArr.length; i++) {
    if (tempArr[i][0] === '{') {
      counts.objData++
    }
  }
  return `${counts.arrays}개의 배열 데이터 중 객체 ${counts.objData}개가 포함되어 있습니다.`
}


const parseKeys = (tempArr) => {
  let temps = [];
  let keys = [];

  for (let elem of tempArr) {
    for (let factor of elem) {
      if (factor === ',' || factor === '{') {
        is_ready_to_input_Data = true;
      };
      if (is_ready_to_input_Data) {
        tempStr += factor;
      };
      if (factor === ':') {
        is_ready_to_input_Data = false;
        temps.push(tempStr);
        tempStr = '';
      }
    }
  }
  temps.forEach(elem => {
    keys.push(elem.replace(/\{|\,/gi, '').replace(/\:|\,}/gi, '').trim());
  })
  return keys;
}

const parseValues = (tempArr) => {
  let temps = [];
  let values = [];
  let counts = {
    total: 0,
    number: 0,
    string: 0,
    boolean: 0
  };

  for (let elem of tempArr) {
    for (let factor of elem) {
      if (factor === ':') {
        is_ready_to_input_Data = true;
      };

      if (is_ready_to_input_Data) {
        tempStr += factor;
      };

      if (factor === ',' || factor === '}') {
        is_ready_to_input_Data = false;
        temps.push(tempStr);
        tempStr = '';
      }
    }
  }

  temps.forEach(elem => {
    values.push(elem.replace(/\:\s/gi, '').replace(/\,|\}/gi, '').trim());
  })
  values.forEach(elem => {
    counts.total++;
    if (elem.indexOf('"') !== -1) {
      counts.string++;
    } else if (!isNaN(elem)) {
      counts.number++;
    } else if (elem === 'true' || elem === 'false') {
      counts.boolean++;
    }
  })
    if (counts.total === counts.string + counts.boolean + counts.number) {
      return `총 ${counts.total}개의 객체 데이터 중에 문자열 ${counts.string}개, 숫자 ${counts.number}개, 부울 ${counts.boolean}개가 포함되어 있습니다.`
    } else {
      return message.error
    }
}


rl.question(message.init, (answer) => {
  console.log(checkRules(answer));
  rl.close();
});