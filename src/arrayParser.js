const {tokenizer} = require('./tokenizer.js');
const {lexer} = require('./lexer.js');
const {parser} = require('./parser.js');

module.exports = class ArrayParser{
  constructor(source){
    this.originSource = source;
    this.ast = this.parse(source);
    this.stats = {
      'number': 0,
      'string': 0,
      'null': 0,
      'boolean': 0,
      'empty': 0,
      'array': 0,
      'object': 0
    }
    this.setStats(this.ast);
  }
  parse(source){
    const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);
    const parsingProcess = pipe(tokenizer, lexer, parser);
    return parsingProcess(source);
  }
  setStats(node){
    this.stats[node.type]++;
    node.child.forEach(childNode => {
      this.setStats(childNode);
    })
  }
  getStats(){
    return `숫자: ${this.stats.number}개, 문자열: ${this.stats.string}개, null: ${this.stats.null}개, boolean: ${this.stats.boolean}개, 빈 데이터: ${this.stats.empty}개, 배열: ${this.stats.array}개, 객체: ${this.stats.object}개`;
  }
  getAST(){
    return this.ast;
  }
}