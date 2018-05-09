const {test} = require("./test.js");
const {expect} = require("./expect.js");
const {arrayParser} = require("../src/arrayParser.js");

test("true를 올바르게 파싱한다", function(){
  const testcase = "true";
  const result = arrayParser(testcase);
  const answer = {
    key: undefined, 
    type: 'boolean', 
    value: 'true', 
    state: undefined, 
    child:[]
  }
  return expect(result).toBe(answer);
})

test("false를 올바르게 파싱한다", function(){
  const testcase = "false";
  const result = arrayParser(testcase);
  const answer = {
    key: undefined, 
    type: 'boolean', 
    value: 'false', 
    state: undefined, 
    child:[]
  }
  return expect(result).toBe(answer);
})

test("null을 올바르게 파싱한다", function(){
  const testcase = "null";
  const result = arrayParser(testcase);
  const answer = {
    key: undefined, 
    type: 'null', 
    value: 'null', 
    state: undefined, 
    child:[]
  }
  return expect(result).toBe(answer);
})

test("문자열을 올바르게 파싱한다", function(){
  const testcase = "'hello, world'";
  const result = arrayParser(testcase);
  const answer = {
    key: undefined, 
    type: 'string', 
    value: "'hello, world'", 
    state: undefined, 
    child:[]
  }
  return expect(result).toBe(answer);
})

test("숫자를 올바르게 파싱한다", function(){
  const testcase = "12345";
  const result = arrayParser(testcase);
  const answer = {
    key: undefined, 
    type: 'number', 
    value: '12345', 
    state: undefined, 
    child:[]
  }
  return expect(result).toBe(answer);
})

test("빈 문자를 올바르게 파싱한다", function(){
  const testcase = "";
  const result = arrayParser(testcase);
  const answer = {
    key: undefined, 
    type: 'empty', 
    value: '', 
    state: undefined, 
    child:[]
  }
  return expect(result).toBe(answer);
})

test("배열을 올바르게 파싱한다", function(){
  const testcase = "[123,'abc']";
  const result = arrayParser(testcase);
  const answer = {
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
  }
  return expect(result).toBe(answer);
})

test("중첩 배열을 올바르게 파싱한다", function(){
  const testcase = "[1,[2]]";
  const result = arrayParser(testcase);
  const answer = {
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
  }
  return expect(result).toBe(answer);
})

test("배열의 빈 공간(empty토큰)을 올바르게 파싱한다", function(){
  const testcase = "[123,]";
  const result = arrayParser(testcase);
  const answer = {
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
  }
  return expect(result).toBe(answer);
})

test("객체를 올바르게 파싱한다", function(){
  const testcase = "{a:123, b: 321}";
  const result = arrayParser(testcase);
  const answer = {
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
  return expect(result).toBe(answer);
})

test("열림과 닫힘의 문자가 다를경우([1,2}) 에러메시지를 출력한다", function(){
  let result;
  const typo = "[1,2}"
  const answer = `닫히는 타입이 다릅니다`;
  try{
    result = arrayParser(typo);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("닫히지 않았을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "[1,2"
  const answer = `닫히지 않았습니다`;
  try{
    result = arrayParser(typo);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("객체에 키가 없을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "{1}"
  const answer = `키가 존재하지 않습니다 : 1`;
  try{
    result = arrayParser(typo);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("객체에 키는 있지만 값이 없을 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "{key:}"
  const answer = `다음 키의 값이 존재하지 않습니다: key`;
  try{
    result = arrayParser(typo);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})