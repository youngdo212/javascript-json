class DataStucture{
  constructor(type, value, child = []){
    this.type = type;
    this.value = value;
    this.child = child;
  }
  pushChild(child){
    this.child.push(...child);
  }
}

class ChildStack{
  constructor(){
    this.stack = [];
  }
  addData(data){
    this.stack[this.stack.length-1].push(data);
  }
  buildStack(data){
    if(data) this.addData(data);
    this.stack.push([]);
  }
  combineStack(){
    const child = this.stack.pop();
    const lastStack = this.stack.pop();
    const lastData = lastStack.pop();
    lastData.pushChild(child);
    lastStack.push(lastData);
    this.stack.push(lastStack);
  }
  getLastStack(){
    return this.stack.pop();
  }
}

function ArrayParser(str){
  const stack = new ChildStack();
  let tempValue = '';

  stack.buildStack();  

  for(let i = 0; i < str.length; i++){
    if(str[i] === '['){
      stack.buildStack(new DataStucture('array', 'ArrayObject'));
    }
    else if(str[i] === ']'){
      if(tempValue) stack.addData(new DataStucture('number', tempValue));
      tempValue = '';
      stack.combineStack();
    }
    else if(str[i] === ','){
      if(tempValue) stack.addData(new DataStucture('number', tempValue));
      tempValue = '';
    }
    else if(str[i] === ' '){
      continue;
    }
    else{
      tempValue += str[i];
    }
  }
  
  return tempValue ? new DataStucture('number', tempValue) : stack.getLastStack().pop();
}



let testcase1 = '[12, [14, 55], 15]';
let testcase2 = '[1, [55, 3]]'
let testcase3 = '[1, [[2]]]'
let testcase4 = '[123,[22,23,[11,[112233],112],55],33]';
let testcase5 = '12345'
let testcase6 = '[1,3,[1,2],4,[5,6]]'

let result = ArrayParser(testcase1);
console.log(JSON.stringify(result, null, 2));