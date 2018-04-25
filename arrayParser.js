const tokenizer = require('./tokenizer.js').tokenizer;
const lexer = require('./lexer.js').lexer;

class SyntaxError{
  throwArrayKeyError(value){
    throw `배열에는 키 값을 설정할 수 없습니다: ${value}`;
  }
  throwObjectKeyError(value){
    throw `키 값이 존재하지 않습니다 : ${value}`; // value값이 존재하지 않습니다 추가
  }
  throwElementError(value){
    throw `여러 원소가 존재할 수 없는 자료형입니다`;
  }
  throwCloseTypeError(){
    throw `닫히는 타입이 다릅니다`;
  }
  throwCloseError(){
    throw `닫히지 않았습니다`;
  }
}

class Child{
  constructor({type} = {}){
    this.type = type;
    this.key = type === 'array' ? 0 : undefined;
    this.elements = [];
    this.error = new SyntaxError();
  }
  push(node){
    if(this.type === 'array'){
      const key = node.key ? this.error.throwArrayKeyError(node.value) : this.key;
      node.key = key;
      this.elements.push(node);
      this.key++;
    }
    else if(this.type === 'object'){
      if(this.key === undefined){
        if(node.type !== 'key') this.error.throwObjectKeyError(node.value);
        this.key = node.value;
      }
      else{
        const key = this.key;
        node.key = key;
        this.elements.push(node);
        this.key = undefined;      
      }
    }
    else{
      if(this.elements.length > 0) this.error.throwElementError();
      this.elements.push(node);
    }
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
  build(node){
    node ? this.lastChild.push(node) : null;
    this.stack.push(new Child(node));    
  }
  close(node){
    if(this.lastChild.type !== node.type) this.error.throwCloseTypeError();
    const lastChild = this.stack.pop();
    this.lastChild.lastNode.child.push(...lastChild.elements);
  }
  isUnclosed(){
    return this.stack.length > 1 ? this.error.throwCloseError() : null;
  }
  get lastChild(){
    return this.stack[this.stack.length-1];
  }
}

function arrayparser(ast){
  let stack = new Stack();

  stack.build();

  ast.forEach(node => {
    if(node.state === 'open') stack.build(node);
    else if(node.state === 'close') stack.close(node);
    else stack.lastChild.push(node);
  })

  stack.isUnclosed();

  return stack.lastChild.elements.pop(); // element가 이상하다
}

let pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

let getResult = pipe(tokenizer, lexer, arrayparser);

let testcase1 = '[12, [14, 55], 15]';
let testcase2 = '[1, [55, 3]]'
let testcase3 = '[1, [[2]]]'
let testcase4 = '[123,[22,23,[11,[112233],112],55],33]';
let testcase5 = '12345'
let testcase6 = '[1,3,[1,2],4,[5,6]]'
let testcase7 = "['1a3',[null,false,['11',[112233],112],55, '99'],33, true]";
let testcase8 = "['1a3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]";
let testcase9 = "'[]'";

let result = getResult("[1,2,3");
console.log(JSON.stringify(result, null, 2));