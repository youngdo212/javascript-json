const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const init = () => {
  rl.question('분석할 JSON 데이터를 입력하세요. ', (answer) => {
    let arr = answer.split(' ');
    let res = [];
    arrays(arr, res);
    console.log(result(res));
    rl.close();
  });
}


const arrays = (arr, res) => {
  if (arr[0] === '[' && arr[arr.length - 1] === ']') {
    for (let i = 1; i < arr.length - 1; i++) {
      arr[i].match(',') ? res.push(arr[i].replace(',', "")) : res.push(arr[i]);
    }
  }
  return res;
}


const types = {
  string: function (res) {
    let strs = [];
    for (let val of res) {
      if (val.match('"')) {
        strs.push(val.replace('"', "").replace('"', ""));
      }
    }
    return strs.length;
  },
  numbers: function (res) {
    let nums = [];
    for (let val of res) {
      if (!isNaN(Number(val))) {
        nums.push(Number(val));
      }
    }
    return nums.length;
  },
  bools: function (res) {
    let bools = [];
    for (let val of res) {
      if (val === "false" || val === "true") {
        bools.push(val);
      }
    }
    return bools.length;
  }
}

const result = (res) => {
  return "총 " + res.length + "개의 데이터 중에 문자열 " + types.string(res) + "개, 숫자 " + types.numbers(res) + "개, 부울 " + types.bools(res) + "개가 포함되어 있습니다.";
}


init();