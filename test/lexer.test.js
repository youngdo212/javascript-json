const {test} = require("./test.js");
const {expect} = require("./expect.js");
const {lexer} = require("../src/lexer.js")

test("'true'의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["true"]);
  const answer = [{
    key: undefined, 
    type: 'boolean', 
    value: 'true', 
    state: undefined, 
    child:[]
  }]
  return expect(result).toBe(answer);
})

test("'true'의 오타를 확인하여 에러메시지를 출력한다", function(){
  let result;
  const typo = "treu"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("'false'의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["false"]);
  const answer = [{
    key: undefined, 
    type: 'boolean', 
    value: 'false', 
    state: undefined, 
    child:[]
  }]
  return expect(result).toBe(answer);
})

test("'false'의 오타를 확인하여 에러메시지를 출력한다", function(){
  let result;
  const typo = "False"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("'null'의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["null"]);
  const answer = [{
    key: undefined, 
    type: 'null', 
    value: 'null', 
    state: undefined, 
    child:[]
  }]
  return expect(result).toBe(answer);
})

test("'null'의 오타를 확인하여 에러메시지를 출력한다", function(){
  let result;
  const typo = "nul"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("문자열의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["'hello, world'"]);
  const answer = [{
    key: undefined, 
    type: 'string', 
    value: "'hello, world'", 
    state: undefined, 
    child:[]
  }]
  return expect(result).toBe(answer);
})

test("문자열의 따옴표(')가 3개인 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "'hello,'world'"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("문자열의 따옴표(')가 4개인 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "'hello,''world'"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("문자열의 따옴표(')가 5개 이상인 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "'hello,'''world'"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("숫자의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["19930212"]);
  const answer = [{
    key: undefined, 
    type: 'number', 
    value: "19930212", 
    state: undefined, 
    child:[]
  }]
  return expect(result).toBe(answer);
})

test("숫자에 문자가 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "123a3"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("열린 배열([)의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["["]);
  const answer = [{
    key: undefined, 
    type: 'array', 
    value: "ArrayObject", 
    state: "open", 
    child:[]
  }]
  return expect(result).toBe(answer);
})

test("열린 배열([)에 다른 값이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "123["
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("닫힌 배열(])의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["]"]);
  const answer = [{
    key: undefined, 
    type: 'array', 
    value: "ArrayObject", 
    state: "close", 
    child:[]
  }]
  return expect(result).toBe(answer);
})

test("닫힌 배열(])에 다른 값이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "]'a'"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("열린 객체({)의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["{"]);
  const answer = [{
    key: undefined, 
    type: 'object', 
    value: "Object", 
    state: "open", 
    child: []
  }]
  return expect(result).toBe(answer);
})

test("열린 객체({)에 다른 값이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "123{"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("닫힌 객체(})의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["}"]);
  const answer = [{
    key: undefined, 
    type: 'object', 
    value: "Object", 
    state: "close", 
    child: []
  }]
  return expect(result).toBe(answer);
})

test("닫힌 객체(})에 다른 값이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "}true"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("키의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["myKey:"]);
  const answer = [{
    key: undefined, 
    type: 'key', 
    value: "myKey", 
    state: undefined, 
    child: []
  }]
  return expect(result).toBe(answer);
})

test("키 값에 띄어쓰기가 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "a a:"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("키 값에 특수문자가 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "a;a:"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
  }
  catch(error){
    return expect(error).toBe(answer);  
  }
  return 'FAIL (에러메시지가 출력되지 않았습니다)';
})

test("빈 문자열의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer([""]);
  const answer = [{
    key: undefined, 
    type: 'empty', 
    value: "", 
    state: undefined, 
    child: []
  }]
  return expect(result).toBe(answer);
})