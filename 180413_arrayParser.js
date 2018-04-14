function ArrayParser(str){
  let result = null;
  let location = [];
  let depth = 0;
  let temp = '';
  for(let i = 0; i < str.length; i++){
    if(str[i] === '['){
      if(result) location[depth].push({type: 'array', value: 'ArrayObject', child: []});
      else result = {type: 'array', value: 'ArrayObject', child : []};
      location[depth + 1] = location[depth] ? location[depth][location[depth].length-1].child : result.child;
      depth++;
    }
    else if(str[i] === ']'){
      if(temp) location[depth].push({type: 'number', value: temp, child: []});
      temp = '';
      depth--;
    }
    else if(str[i] === ','){
      if(temp) location[depth].push({type: 'number', value: temp, child:[]});
      temp = '';
    }
    else if(str[i] === ' '){
      continue;
    }
    else{
      temp += str[i];
    }
  }
  result = result || {type: 'number', value: temp, child: []};
  
  return result;
}

let testcase1 = '[12, [14, 55], 15]';
let testcase2 = '[1, [55, 3]]'
let testcase3 = '[1, [[2]]]'
let testcase4 = '[123,[22,23,[11,[112233],112],55],33]';
let testcase5 = '12345'
let testcase6 = '[1,3,[1,2],4,[5,6]]'

let result = ArrayParser(testcase6);
console.log(JSON.stringify(result, null, 2));