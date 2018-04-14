function ArrayParser(str){
  const result = {};
  let depth = 0;
  let temp = '';
  for(let i = 0; i < str.length; i++){
    if(str[i] === '['){
      result[++depth] = [];
    }
    else if(str[i] === ']'){
      result[depth] = result[depth].concat(temp || []);
      result[depth-1] = result[depth-1] ? result[depth-1].concat([result[depth]]) : result[depth];
      delete result[depth];
      depth--;
      temp = '';
    }
    else if(str[i] === ','){
      result[depth] = result[depth].concat(temp || []);
      temp = '';
    }
    else if(str[i] === ' '){
      continue;
    }
    else{
      temp += str[i];
    }
  }
  result[depth] = result[depth] || temp;
  
  return result;
}

let s1 = '[12, [14, 55], 15]';
let s2 = '[1, [55, 3]]'
let s3 = '[1, [[2]]]'
let s4 = '[123,[22,23,[11,[112233],112],55],33]';
let s5 = '12345'
let s6 = '[1,3,[1,2],4,[5,6]]'

let result = ArrayParser(s1);
console.log(result);