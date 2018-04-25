function lexer(tokens){
  const ast = [];

  tokens.forEach(token => {
    ast.push(getData(token));
  });

  return ast;
}

function getData(token){
  const type = getType(token);
  const value = getValue(type, token);
  const state = getState(token);

  return {
    key: undefined,    
    type: type,
    value: value,
    state: state,
    child: []
  };
}

function getType(value){
  return isBoolean(value) ? 'boolean' : 
  isNull(value) ? 'null' : 
  isString(value) ? 'string' :
  isNumber(value) ? 'number' :
  isArray(value) ? 'array' :
  isObject(value) ? 'object' :
  isKey(value) ? 'key' :
  isEmpty(value) ? 'empty' : throwError(value);
}

function throwError(value){
  throw `${value}는 올바른 타입이 아닙니다`;
}

function isBoolean(value){
  return value === 'true' || value === 'false';
}

function isNull(value){
  return value === 'null';
}

function isString(value){
  const compareValue = value.match(/'.+?'/);
  return compareValue ? value === compareValue[0] : false;
}

function isNumber(value){
  const compareValue = value.match(/\d+/);
  return compareValue ? value === compareValue[0] : false;  
}

function isArray(value){
  return value === '[' || value === ']';
}

function isObject(value){
  return value === '{' || value === '}';
}

function isKey(value){
  const {length} = value;
  if(value[length-1] === ':'){
    const compareValue = value.match(/\w+/);
    return compareValue ? value.slice(0,length-1) === compareValue[0] : false;
  }
  return false;
}

function isEmpty(value){
  return value === '';
}

function getValue(type, value){
  if(type === 'array') return 'ArrayObject';
  if(type === 'object') return 'Object';
  if(type === 'key') return value.slice(0, value.length-1);
  return value;
}

function getState(value){
  if(value === '[' || value === '{') return 'open';
  if(value === ']' || value === '}') return 'close';
  return undefined;
}