function ArrayParser(str){
  const stack = [[]];
  let tempValue = '';
  for(let i = 0; i < str.length; i++){
    if(str[i] === '['){
      stack[stack.length-1].push({type: 'array', value: 'ArrayObject', child: []});
      stack.push([]);
    }
    else if(str[i] === ']'){
      if(tempValue) stack[stack.length-1].push({type: 'number', value: tempValue, child: []});
      tempValue = '';
      const child = stack.pop();
      const last = stack.pop();
      const lastData = last.pop();
      lastData.child.push(...child);
      last.push(lastData);
      stack.push(last);
    }
    else if(str[i] === ','){
      if(tempValue) stack[stack.length-1].push({type: 'number', value: tempValue, child: []});
      tempValue = '';
    }
    else if(str[i] === ' '){
      continue;
    }
    else{
      tempValue += str[i];
    }
  }
  return tempValue ? {type: 'number', value: tempValue, child: []} : stack.pop().pop();
}

let testcase1 = '[12, [14, 55], 15]';
let testcase2 = '[1, [55, 3]]'
let testcase3 = '[1, [[2]]]'
let testcase4 = '[123,[22,23,[11,[112233],112],55],33]';
let testcase5 = '12345'
let testcase6 = '[1,3,[1,2],4,[5,6]]'

let result = ArrayParser(testcase6);
console.log(JSON.stringify(result, null, 2));