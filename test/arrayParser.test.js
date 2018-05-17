const {test} = require("./test.js");
const {expect} = require("./expect.js");
const ArrayParser = require("../src/arrayParser.js");

const answercase = {
  "true": {
    key: undefined, 
    type: 'boolean', 
    value: 'true', 
    state: undefined, 
    child:[]
  },
  "false": {
    key: undefined, 
    type: 'boolean', 
    value: 'false', 
    state: undefined, 
    child:[]
  },
  "null": {
    key: undefined, 
    type: 'null', 
    value: 'null', 
    state: undefined, 
    child:[]
  },
  "string": {
    key: undefined, 
    type: 'string', 
    value: "'hello, world'", 
    state: undefined, 
    child:[]
  },
  "number": {
    key: undefined, 
    type: 'number', 
    value: '12345', 
    state: undefined, 
    child:[]
  },
  "empty": {
    key: undefined, 
    type: 'empty', 
    value: '', 
    state: undefined, 
    child:[]
  },
  "array": {
    key: undefined, 
    type: 'array', 
    value: 'ArrayObject', 
    state: undefined, 
    child:[{
      key: 0, 
      type: 'number', 
      value: '123', 
      state: undefined, 
      child:[]
    },{
      key: 1, 
      type: 'string', 
      value: "'abc'", 
      state: undefined, 
      child:[]
    }]
  },
  "recursiveArray": {
    key: undefined, 
    type: 'array', 
    value: 'ArrayObject', 
    state: undefined, 
    child:[{
      key: 0, 
      type: 'number', 
      value: '1', 
      state: undefined, 
      child:[]
    },{
      key: 1, 
      type: 'array', 
      value: "ArrayObject", 
      state: undefined, 
      child:[{
        key: 0, 
        type: 'number', 
        value: "2", 
        state: undefined, 
        child:[]
      }]
    }]
  },
  "emptyArray": {
    key: undefined, 
    type: 'array', 
    value: 'ArrayObject', 
    state: undefined, 
    child:[{
      key: 0, 
      type: 'number', 
      value: '123', 
      state: undefined, 
      child:[]
    },{
      key: 1, 
      type: 'empty', 
      value: "", 
      state: undefined, 
      child:[]
    }]
  },
  "object": {
    key: undefined, 
    type: 'object', 
    value: 'Object', 
    state: undefined, 
    child:[{
      key: 'a', 
      type: 'number', 
      value: '123', 
      state: undefined, 
      child:[]
    },{
      key: 'b', 
      type: 'number', 
      value: "321", 
      state: undefined, 
      child:[]
    }]
  }
}

test("true를 올바르게 파싱한다", function(){
  const testcase = "true";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["true"];
  expect(result).toBe(answer);
})

test("false를 올바르게 파싱한다", function(){
  const testcase = "false";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["false"];
  expect(result).toBe(answer);
})

test("null을 올바르게 파싱한다", function(){
  const testcase = "null";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["null"];
  expect(result).toBe(answer);
})

test("문자열을 올바르게 파싱한다", function(){
  const testcase = "'hello, world'";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["string"];
  expect(result).toBe(answer);
})

test("숫자를 올바르게 파싱한다", function(){
  const testcase = "12345";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["number"];
  expect(result).toBe(answer);
})

test("빈 문자를 올바르게 파싱한다", function(){
  const testcase = "";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["empty"];
  expect(result).toBe(answer);
})

test("배열을 올바르게 파싱한다", function(){
  const testcase = "[123,'abc']";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["array"];
  expect(result).toBe(answer);
})

test("중첩 배열을 올바르게 파싱한다", function(){
  const testcase = "[1,[2]]";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["recursiveArray"];
  expect(result).toBe(answer);
})

test("배열의 빈 공간(empty토큰)을 올바르게 파싱한다", function(){
  const testcase = "[123,]";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["emptyArray"];
  expect(result).toBe(answer);
})

test("객체를 올바르게 파싱한다", function(){
  const testcase = "{a:123, b: 321}";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getAST();
  const answer = answercase["object"];
  expect(result).toBe(answer);
})

test("배열이 객체로 닫힐 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "[1,2}"
  const answer = `정상적으로 종료되지 않은 배열이 있습니다`;
  try{
    myArrayParser = new ArrayParser(typo);
    const result = myArrayParser.getAST();
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("배열이 닫히지 않을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "[1,2"
  const answer = `정상적으로 종료되지 않은 배열이 있습니다`;
  try{
    myArrayParser = new ArrayParser(typo);
    const result = myArrayParser.getAST();
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("불필요한 배열 닫힘이 있을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "{a:3}]"
  const answer = `불필요한 닫힘 기호가 존재합니다: ]`;
  try{
    myArrayParser = new ArrayParser(typo);
    const result = myArrayParser.getAST();
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("객체가 배열로 닫힐 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "{a:3]"
  const answer = `정상적으로 종료되지 않은 객체가 있습니다`;
  try{
    myArrayParser = new ArrayParser(typo);
    const result = myArrayParser.getAST();
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("객체가 닫히지 않을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "{a:[1,2]"
  const answer = `정상적으로 종료되지 않은 객체가 있습니다`;
  try{
    myArrayParser = new ArrayParser(typo);
    const result = myArrayParser.getAST();
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("불필요한 객체 닫힘이 있을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "[3]}"
  const answer = `불필요한 닫힘 기호가 존재합니다: }`;
  try{
    myArrayParser = new ArrayParser(typo);
    const result = myArrayParser.getAST();
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("객체에 키가 없을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "{1}"
  const answer = `키가 존재하지 않습니다 : 1`;
  try{
    myArrayParser = new ArrayParser(typo);
    const result = myArrayParser.getAST();
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("객체에 키는 있지만 값이 없을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "{key:}"
  const answer = `다음 키의 값이 존재하지 않습니다: key`;
  try{
    myArrayParser = new ArrayParser(typo);
    const result = myArrayParser.getAST();
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("통계를 정확하게 산출한다", function(){
  const testcase = "[1,[2]]";
  const myArrayParser = new ArrayParser(testcase);
  const result = myArrayParser.getStats();
  const answer = `숫자: 2개, 문자열: 0개, null: 0개, boolean: 0개, 빈 데이터: 0개, 배열: 2개, 객체: 0개`;
  expect(result).toBe(answer);
})