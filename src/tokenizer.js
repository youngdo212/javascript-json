exports.tokenizer = function(code){
  const tokens = [];
  let token = '';
  let foundString = false;

  for(let i = 0, {length} = code; i < length; i++){
    if(foundString){
      if(code[i] === "'") foundString = !foundString;
      token += code[i];
    }
    else if(code[i] === ','){
      tokens.push(token.trim());
      token = '';
    }
    else if(code[i] === '[' || code[i] === '{'){
      token += code[i];
      tokens.push(token.trim());
      token = '';
    }
    else if(code[i] === ':'){
      token = token.trim();
      token += code[i];
      tokens.push(token);
      token = '';
    }
    else if(code[i] === ']' || code[i] === '}'){
      tokens.push(token.trim());
      token = '';
      token += code[i];
    }
    else{
      if(code[i] === "'") foundString = !foundString;
      token += code[i];
    }
  }

  tokens.push(token.trim());

  return tokens;
}


// let testcase1 = "202";
// let testcase2 = "  'mando''aa'   ";
// let testcase3 = "[1,3,      100]";
// let testcase4 = "   'hello,     mando'   ";
// let testcase5 = "  [     'a', 4]   ";
// let testcase6 = "['hello, world', 100, 'youngdo']";
// let testcase7 = "'[]'";
// let testcase8 = "[1,3, ['a', 123]]";
// let testcase9 = "[['mando', 'crong'], 101]";
// let testcase10 = "[,]";
// let testcase11 = "12'['";
// let testcase12 = "[]";
// let testcase13 = "[12 , , , ";
// let testcase14 = "{a: 123, b: 321}"
// let testcase15 = "[1, {name: ['youngdo', 'crong']}]";
// let testcase16 = "{:123}";
// let testcase17 = "{123, 1}";
// let testcase18 = "{123, 1, a a: 3, b:}";

// let result = tokenizer(testcase15);
// console.log(JSON.stringify(result, null, 2));
// console.log(result);