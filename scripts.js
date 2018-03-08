// const readline = require('readline');
// const rl = readline.createInterface({
//   answer: process.stdin,
//   output: process.stdout
// });

// rl.question('분석할 JSON 데이터를 입력하세요: \n', (answer) => {

//   rl.close();
// });

// let answer = '{ "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }';
// let answer = '[ { "name" : "KIM JUNG", "alias" : "JK", "level" : 5, "married" : true }, { "name" : "YOUN JISU", "alias" : "crong", "level" : 4, "married" : true }, { "name" : "JUNG HO", "alias" : "honux","level" : 1, "married" : true }]'
let answer = '[ 10, "jk", 4, "314", 99, "crong", false]';



let string = '';
let arr = [];
let keys = [];
let flag;

let counts = {
  total: 0,
  number: 0,
  string: 0,
  boolean: 0,
  arrays: 0,
  objData: 0,
}


if (answer.indexOf('[') !== -1 && answer.indexOf('{') !== -1) {
  console.log(parseObjects(answer));
} else if (answer.indexOf('[') === -1 && answer.indexOf('{') !== -1) {
  parseObjects(answer)
  console.log(parseValues(arr));
} else {
  console.log(parseArrays(answer));
}


function parseObjects(answer) {
  for (let element of answer) {
    if (element === '{') {
      flag = true;
    };

    if (flag) {
      string += element;
    };

    if (element === '}') {
      flag = false;
      arr.push(string);
      string = '';
    }
  }
  counts.arrays = arr.length;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][0] === '{') {
      counts.objData++
    }
  }
  return counts.arrays + "개의 배열 데이터 중 객체 " + counts.objData + "개가 포함되어 있습니다."
}


function parseKeys(arr) {
  let temps = [];
  let keys = [];
  for (let elem of arr) {
    for (let factor of elem) {
      if (factor === ',' || factor === '{') {
        flag = true;
      };
      if (flag) {
        string += factor;
      };
      if (factor === ':') {
        flag = false;
        temps.push(string);
        string = '';
      }
    }
  }
  temps.forEach(elem => {
    keys.push(elem.replace(/\{|\,/gi, '').replace(/\:|\,}/gi, '').trim());
  })
  return keys;
}


function parseValues(arr) {
  let temps = [];
  let values = [];
  for (let elem of arr) {
    for (let factor of elem) {
      if (factor === ':') {
        flag = true;
      };
      if (flag) {
        string += factor;
      };
      if (factor === ',' || factor === '}') {
        flag = false;
        temps.push(string);
        string = '';
      }
    }
  }
  temps.forEach(elem => {
    values.push(elem.replace(/\:\s/gi, '').replace(/\,|\}/gi, '').trim());
  })
  values.forEach(elem => {
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
  return "총 " + counts.total + "개의 객체 데이터 중에 문자열 " + counts.string + "개, 숫자 " + counts.number + "개, 부울 " + counts.boolean + "개가 포함되어 있습니다."
}



function parseArrays(answer) {
  for (var i = 1; i < answer.length - 1; i++) {
    string += answer[i]
  }
  arr = string.split(',').map(elem => {
    return elem.trim();
  })
  arr.forEach(elem => {
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
  return "총 " + counts.number + "개의 데이터 중에 문자열 " + counts.string + "개, 숫자 " + counts.number + "개, 부울 " + counts.boolean + "개가 포함되어 있습니다."
}