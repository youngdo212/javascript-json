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

class Value{
  constructor(){
    this.value = '';
  }
  isBoolean(){
    return this.value === 'true' || this.value === 'false';
  }
  isNull(){
    return this.value === 'null';
  }
  isString(){ // 리팩토링
    if(this.value.match(/'.+?'/)){
      if(this.value === this.value.match(/'.+?'/)[0]) return true;
      else this.throwStringError();
    }
    return false;
  }
  isNumber(){
    return this.value.match(/\d/) ? this.value === this.value.match(/\d+/)[0] : false;
  }
  isEmpty(){
    return this.value ? false : true;
  }
  get type(){
    return this.isBoolean() ? 'boolean' : 
    this.isNull() ? 'null' : 
    this.isString() ? 'string' : 
    this.isNumber() ? 'number' : 
    this.throwTypeError();
  }
  throwTypeError(){
    throw `${this.value}는 알 수 없는 타입입니다`;
  }
  throwStringError(){
    throw `${this.value}는 올바른 문자열이 아닙니다`;
  }
  push(str){
    if(str !== ' ') this.value += str;
  }
  initialize(){
    this.value = '';
  }
}

function ArrayParser(str){
  const stack = new ChildStack();
  let value = new Value();

  stack.buildStack();

  for(let i = 0; i < str.length; i++){
    if(isOpened(str[i])){
      stack.buildStack(new DataStucture('array', 'ArrayObject'));
    }
    else if(isPaused(str[i])){
      if(!value.isEmpty()){
        stack.addData(new DataStucture(value.type, value.value));
        value.initialize();
      }
      if(isClosed(str[i])) stack.concatChild(stack.getLastStack());
    }
    else{
      value.push(str[i]);
    }
  }

  return value.isEmpty() ? stack.getLastStack().pop() : new DataStucture(value.type, value.value);
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
let testcase7 = "['1a3',[null,false,['11',[112233],112],55, '99'],33, true]";

let result = ArrayParser(testcase7);
console.log(JSON.stringify(result, null, 2));