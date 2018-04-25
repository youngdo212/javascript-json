exports.lexer = function(tokens){
  const ast = [];

  tokens.forEach(token => {
    ast.push(new DataStructure(token));
  });
  
  return ast;
}

class TypeError{
  throwTypeError(value){
    throw `${value}는 올바른 타입이 아닙니다`;
  }
}

class TypeCheck{
  constructor(value){
    this.value = value;
    this.error = new TypeError();
  }
  isBoolean(){
    return this.value === 'true' || this.value === 'false';
  }
  isNull(){
    return this.value === 'null';
  }
  isString(){
    return this.value === this.value.match(/('.+?')*/)[0];
  }
  isNumber(){
    return this.value === this.value.match(/\d*/)[0];
  }
  isArray(){
    return this.value === '[' || this.value === ']';
  }
  isObject(){
    return this.value === '{' || this.value === '}';
  }
  isKey(){
    const {length} = this.value;
    if(this.value[length-1] === ':'){
      const compareValue = this.value.match(/\w+/);
      return compareValue ? this.value.slice(0,length-1) === compareValue[0] : false;
    }
    return false;
  }
  isEmpty(){
    return this.value === '';
  }
}

class DataStructure{
  constructor(source){
    this.key = undefined;
    this.type = this.getType(source);
    this.value = this.getValue(this.type, source);
    this.state = this.getState(source);
    this.child = [];
  }
  getType(source){
    const mySource = new TypeCheck(source);
    return mySource.isBoolean() ? 'boolean' : 
    mySource.isNull() ? 'null' : 
    mySource.isString() ? 'string' :
    mySource.isNumber() ? 'number' :
    mySource.isArray() ? 'array' :
    mySource.isObject() ? 'object' :
    mySource.isKey() ? 'key' :
    mySource.isEmpty() ? 'empty' : mySource.error.throwTypeError(source);
  }
  getValue(type, source){
    if(type === 'array') return 'ArrayObject';
    if(type === 'object') return 'Object';
    if(type === 'key') return source.slice(0, source.length-1);
    return source;
  }
  getState(source){
    if(source === '[' || source === '{') return 'open';
    if(source === ']' || source === '}') return 'close';
    return undefined;
  }
}