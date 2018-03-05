const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('분석할 JSON 데이터를 입력하세요. ', (answer) => {
  let arr = answer.split(' ');
  let res = [];
  objects(arr, res);
  types(res);
  rl.close();
});

const objects = (arr, res) => {
  if (arr[0] === '[' && arr[arr.length - 1] === ']') {
    for (let i = 1; i < arr.length - 1; i++) {
      arr[i].match(',') ? res.push(arr[i].replace(',', "")) : res.push(arr[i]);
    }
  }
  return res;
}

const types = (res) => {
  let strs = [];
  let nums = [];
  let bools = [];

  for (let val of res) {
    if (val.match('"')) {
      strs.push(val.replace('"', "").replace('"', ""));      
    } else if (!isNaN(Number(val))) {
      nums.push(Number(val));      
    } else if (val === 'true' || 'false') {
      bools.push(val);
    }
  }
  console.log("총 " + res.length + "개의 데이터 중에 문자열 " + strs.length + "개, 숫자 " + nums.length + "개, 부울 " + bools.length + "개가 포함되어 있습니다.");
}