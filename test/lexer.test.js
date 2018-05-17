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
  expect(result).toBe(answer);
})

test("'true'의 오타를 확인하여 에러메시지를 출력한다", function(){
  let result;
  const typo = "treu"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})

test("'false'의 오타를 확인하여 에러메시지를 출력한다", function(){
  let result;
  const typo = "False"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})

test("'null'의 오타를 확인하여 에러메시지를 출력한다", function(){
  let result;
  const typo = "nul"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})

test("문자열의 따옴표(')가 3개인 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "'hello,'world'"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("문자열의 따옴표(')가 4개인 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "'hello,''world'"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("문자열의 따옴표(')가 5개 이상인 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "'hello,'''world'"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})

test("숫자에 문자가 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "123a3"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})

test("열린 배열([)에 다른 값이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "123["
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})

test("닫힌 배열(])에 다른 값이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "]'a'"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})

test("열린 객체({)에 다른 값이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "123{"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})

test("닫힌 객체(})에 다른 값이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "}true"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("키의 타입, 값, 상태를 올바르게 파악한다", function(){
  const result = lexer(["myKey1:"]);
  const answer = [{
    key: undefined, 
    type: 'key', 
    value: "myKey1", 
    state: undefined, 
    child: []
  }]
  expect(result).toBe(answer);
})

test("키 값에 띄어쓰기가 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "a a:"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("키 값에 특수문자가 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "a;a:"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("키 값에 빈 문자열이 들어가 있는 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = ":"
  const answer = `${typo}는 올바른 타입이 아닙니다`
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
})

test("키 값이 숫자와 문자의 혼용일 때 숫자가 앞에 올 경우 에러메시지를 출력한다", function(){
  let result;
  const typo = "1a:"
  const answer = `키에 숫자와 문자 혼용 시 숫자는 앞에 올 수 없습니다: ${typo.slice(0,typo.length-1)}`;
  try{
    result = lexer([typo]);
    console.log('FAIL (에러메시지가 출력되지 않았습니다)');    
  }
  catch(error){
    expect(error).toBe(answer);  
  }
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
  expect(result).toBe(answer);
})