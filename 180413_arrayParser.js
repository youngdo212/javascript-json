function ArrayParser(str){
  const result = {};
  let step = 0;
  let temp = '';
  for(let i = 0; i < str.length; i++){
    if(str[i] === '['){
      result[step] = step === 0 ? ++step : result[step].concat(++step);
      result[step] = [];
    }
    else if(str[i] === ']'){
      result[step] = result[step].concat(temp || []);
      temp = '';
      --step;
    }
    else if(str[i] === ','){
      result[step] = result[step].concat(temp || []);
      temp = '';
    }
    else if(str[i] === ' '){
      continue;
    }
    else{
      temp += str[i];
    }
  }
  result[step] = result[step] || temp;
  
  return result;
}

let s1 = '[12, [14, 55], 15]';
let s2 = '[1, [55, 3]]'
let s3 = '[1, [[2]]]'
let s4 = '[123,[22,23,[11,[112233],112],55],33]';
let s5 = '12345'

let result = ArrayParser(s1);
console.log(result);

/*
{
  0: 1,
  1: ['12', 2, '15'],
  2: ['14, '55']
}
*/