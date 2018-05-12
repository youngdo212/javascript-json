const {tokenizer} = require('./tokenizer.js');
const {lexer} = require('./lexer.js');
const {parser} = require('./parser.js');

module.exports = class ArrayParser{
  constructor(source){
    this.originSource = source;
    this.ast = this.parse(source);
    this.stats = this.calcStats(this.ast);
  }
  parse(source){
    const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);
    const parsingProcess = pipe(tokenizer, lexer, parser);
    return parsingProcess(source);
  }
  calcStats(node){
    return node.child.reduce((acc, childNode) => this.mergeStats(acc, this.calcStats(childNode)), {[node.type]: 1})
  }
  mergeStats(originStats, targetStats){
    const newStats = Object.assign({}, originStats);
    for(let key in targetStats){
      newStats[key] = newStats[key] || 0;
      newStats[key] = newStats[key] + targetStats[key];
    }
    return newStats;
  }
  getStats(){
    return `숫자: ${this.stats.number || 0}개, 문자열: ${this.stats.string || 0}개, null: ${this.stats.null || 0}개, boolean: ${this.stats.boolean || 0}개, 빈 데이터: ${this.stats.empty || 0}개, 배열: ${this.stats.array || 0}개, 객체: ${this.stats.object || 0}개`;
  }
  getAST(){
    return this.ast;
  }
}