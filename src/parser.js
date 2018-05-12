const tokenizer = require('./tokenizer.js').tokenizer;
const lexer = require('./lexer.js').lexer;

class SyntaxError{
  throwArrayKeyError(value){
    throw `배열에는 키 값을 설정할 수 없습니다: ${value}`;
  }
  throwObjectKeyError(value){
    throw `키가 존재하지 않습니다 : ${value}`;
  }
  throwObjectValueError(value){
    throw `다음 키의 값이 존재하지 않습니다: ${value}`;
  }
  throwElementError(){
    throw `여러 원소가 존재할 수 없는 자료형입니다`;
  }
  throwCloseError(unclosedType, currentType){
    if(unclosedType) this.throwUnclosedError(unclosedType);
    else this.throwOverCloseError(currentType);
  }
  throwUnclosedError(type){
    if(type === 'array') throw '정상적으로 종료되지 않은 배열이 있습니다';
    if(type === 'object') throw '정상적으로 종료되지 않은 객체가 있습니다';
  }
  throwOverCloseError(type){
    if(type === 'array') throw '불필요한 닫힘 기호가 존재합니다: ]';
    if(type === 'object') throw '불필요한 닫힘 기호가 존재합니다: }';
  }
}

class Child{
  constructor({type} = {}){
    this.type = type;
    this.key = (type === 'array') ? 0 : undefined; // 0은 배열의 키(index)입니다. 0을 const키워드로 정의해서 사용해야 될까요?
    this.elements = [];
    this.error = new SyntaxError();
  }
  push(node){
    const pushIn = {
      'array' : this.pushInArray,
      'object' : this.pushInObject,
      'undefined' : this.pushFirstTime
    }
    pushIn[this.type].call(this, node);
  }
  pushInArray(node){
    node.key = (node.type === 'key') ? this.error.throwArrayKeyError(node.value) : this.key;
    this.elements.push(node);
    this.key++;
  }
  pushInObject(node){
    if(this.key === undefined){
      this.key = (node.type === 'key') ? node.value : this.error.throwObjectKeyError(node.value);
    }
    else{
      if(node.type === 'key' || node.type === 'empty') this.error.throwObjectValueError(this.key);
      node.key = this.key;
      this.elements.push(node);
      this.key = undefined;      
    }
  }
  pushFirstTime(node){
    if(this.elements.length > 0) this.error.throwElementError();
    this.elements.push(node);
  }
  get lastNode(){
    return this.elements[this.elements.length-1];
  }
}

class Stack{
  constructor(){
    this.stack = [];
    this.error = new SyntaxError();
  }
  buildBy(node){
    if(node){
      node.state = undefined;
      this.lastChild.push(node);
    }
    this.stack.push(new Child(node));    
  }
  closeBy(node){
    if(this.lastChild.type !== node.type) this.error.throwCloseError(this.lastChild.type, node.type);
    const lastChild = this.stack.pop();
    this.lastChild.lastNode.child.push(...lastChild.elements);
  }
  checkUnclosed(){
    return this.stack.length > 1 ? this.error.throwCloseError(this.lastChild.type) : null;
  }
  get lastChild(){
    return this.stack[this.stack.length-1];
  }
}

function arrayParser(ast){
  let stack = new Stack();

  stack.buildBy();

  ast.forEach(node => {
    if(node.state === 'open') stack.buildBy(node);
    else if(node.state === 'close') stack.closeBy(node);
    else stack.lastChild.push(node);
  })

  stack.checkUnclosed();

  return stack.lastChild.lastNode;
}

let pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

exports.arrayParser = pipe(tokenizer, lexer, arrayParser);




// let testcase1 = '[12, [14, 55], 15]';
// let testcase2 = '[1, [55, 3]]'
// let testcase3 = '[1, [[2]]]'
// let testcase4 = '[123,[22,23,[11,[112233],112],55],33]';
// let testcase5 = '12345'
// let testcase6 = '[1,3,[1,2],4,[5,6]]'
// let testcase7 = "['1a3',[null,false,['11',[112233],112],55, '99'],33, true]";
// let testcase8 = "['1a3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]";
// let testcase9 = "'[]'";

// let ArrayParser = pipe(tokenizer, lexer, arrayParser);
// let result = ArrayParser(testcase1);
// console.log(JSON.stringify(result, null, 2));