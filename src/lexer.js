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

class ValueError{
  throwKeyValueError(value){
    throw `키에 숫자와 문자 혼용 시 숫자는 앞에 올 수 없습니다: ${value}`;
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
    return this.value === this.value.match(/('.+?')?/)[0];
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
    if(this.value[length-1] === ':' && length > 1){
      return this.value.slice(0,length-1) ===  this.value.match(/\w*/)[0];
    }
    return false;
  }
  isEmpty(){
    return this.value === '';
  }
}

class ValueCheck{
  constructor(type, value){
    this.type = type;
    this.value = value;
    this.error = new ValueError();
  }
  isValid(){
    if(this.type === 'key') return this.isValidKey();
  }
  isValidKey(){
    if(/\d/.test(this.value) && /\D/.test(this.value)){
      return /\D/.test(this.value[0]);
    }
    return true;
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
    return mySource.isEmpty() ? 'empty' : 
      mySource.isBoolean() ? 'boolean' : 
      mySource.isNull() ? 'null' : 
      mySource.isString() ? 'string' :
      mySource.isNumber() ? 'number' :
      mySource.isArray() ? 'array' :
      mySource.isObject() ? 'object' :
      mySource.isKey() ? 'key' : mySource.error.throwTypeError(source);
  }
  getValue(type, source){
    if(type === 'array') return 'ArrayObject';
    if(type === 'object') return 'Object';
    if(type === 'key'){
      const keyValue = source.slice(0, source.length-1);
      const mySource = new ValueCheck(type, keyValue);
      return mySource.isValid() ? keyValue : mySource.error.throwKeyValueError(keyValue);
    }
    return source;
  }
  getState(source){
    if(source === '[' || source === '{') return 'open';
    if(source === ']' || source === '}') return 'close';
    return undefined;
  }
}