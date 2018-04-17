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
  concatChild(child){
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
    if(isOpened(str[i])){
      stack.buildStack(new DataStucture('array', 'ArrayObject'));
    }
    else if(isPaused(str[i])){
      if(tempValue) stack.addData(new DataStucture('number', tempValue.trim()));
      tempValue = '';
      if(isClosed(str[i])) stack.concatChild(stack.getLastStack());
    }
    else{
      tempValue += str[i];
    }
  }

  return tempValue ? new DataStucture('number', tempValue.trim()) : stack.getLastStack().pop();
}

function isOpened(e){
  return e === '[';
}

function isClosed(e){
  return e === ']';
}

function isPaused(e){
  return e === ',' || e === ']';
}

let testcase1 = '[12, [14, 55], 15]';
let testcase2 = '[1, [55, 3]]'
let testcase3 = '[1, [[2]]]'
let testcase4 = '[123,[22,23,[11,[112233],112],55],33]';
let testcase5 = '12345'
let testcase6 = '[1,3,[1,2],4,[5,6]]'

let result = ArrayParser(testcase6);
console.log(JSON.stringify(result, null, 2));