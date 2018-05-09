const {test} = require("./test.js");
const {expect} = require("./expect.js");
const {tokenizer} = require("../src/tokenizer.js")

test("콤마(,)단위로 토큰화한다", function(){
  const result = tokenizer("123, 'a', 1, ddd, 'a''b'");
  return expect(result).toBe(["123", "'a'", "1", "ddd", "'a''b'"]);
})

test("열림기호({, [)는 앞과 합쳐지고 뒤를 구분한다", function(){
  const result = tokenizer("123{1['b'");
  return expect(result).toBe(["123{", "1[", "'b'"]);
})

test("닫힘기호(}, ])는 앞을 구분하고 뒤와 합쳐진다", function(){
  const result = tokenizer("123}1]'a'");
  return expect(result).toBe(["123","}1", "]'a'"]);
})

test("콤마가 사용되고 값이 없으면 빈 문자열이 들어간다", function(){
  const result = tokenizer("[,]");
  return expect(result).toBe(["[", "", "", "]"]);
})

test("불필요한 공백은 제거한다", function(){
  const result = tokenizer("    12   ");
  return expect(result).toBe(['12']);
})

test("문자열의 공백은 제거하지 않는다", function(){
  const result = tokenizer("'hello,     world'");
  return expect(result).toBe(["'hello,     world'"]);
})

test("문자열 속 기호는 토큰화하지 않는다", function(){
  const result = tokenizer("'[]{},:'");
  return expect(result).toBe(["'[]{},:'"]);
})

test("key와 value를 나누는 기호(:)는 앞과 합쳐지고 뒤를 구분한다", function(){
  const result = tokenizer("{ a: 123}");
  return expect(result).toBe(["{", "a:", "123", "}"]);
})