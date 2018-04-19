class DataStucture{
  constructor(type, key, value, child = []){
    this.type = type;
    this.key = key;
    this.value = value;
    this.child = child;
  }
  pushChild(child){
    this.child.push(...child);
  }
}

class Child{
  constructor(){
    this.child = [];
    this.key = 0;
  }
  addData({type, key = this.key, value}){
    this.child.push(new DataStucture(type, key, value));
    this.key++;
  }
  get lastData(){
    return this.child[this.child.length-1];
  }
}

class ChildStack{
  constructor(){
    this.stack = [];
  }
  buildStack(){
    this.stack.push(new Child());
  }
  get lastChild(){
    return this.stack[this.stack.length-1];
  }
  popChild(){
    return this.stack.pop();
  }
  isOpenedBy(e){
    return e === '[' || e === '{';
  }
  isClosedBy(e){
    return e === ']' || e === '}';
  }
  isPausedBy(e){
    return e === ',' || e === ']' || e === '}' || e === ':';
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
    if(stack.isOpenedBy(str[i])){
      stack.lastChild.addData({type: 'array', key: stack.stack[1] ? undefined : null, value: 'ArrayObject'});
      stack.buildStack();
    }
    else if(stack.isPausedBy(str[i])){
      if(!value.isEmpty()){
        stack.lastChild.addData({type: value.type, value: value.value});
        value.initialize();
      }
      if(stack.isClosedBy(str[i])){
        const child = stack.popChild().child;
        stack.lastChild.lastData.pushChild(child);
      }
    }
    else{
      value.push(str[i]);
    }
  }
  value.isEmpty() ? null : stack.lastChild.addData({type: value.type, key: null, value: value.value})

  return stack.popChild().lastData;
}

let testcase1 = '[12, [14, 55], 15]';
let testcase2 = '[1, [55, 3]]'
let testcase3 = '[1, [[2]]]'
let testcase4 = '[123,[22,23,[11,[112233],112],55],33]';
let testcase5 = '12345'
let testcase6 = '[1,3,[1,2],4,[5,6]]'
let testcase7 = "['1a3',[null,false,['11',[112233],112],55, '99'],33, true]";
let testcase8 = "['1a3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]";

let result = ArrayParser(testcase7);
console.log(JSON.stringify(result, null, 2));