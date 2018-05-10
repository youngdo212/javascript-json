const {deepEqual} = require("./deepEqual.js");

exports.expect = function(result){
  return new Expect(result);
}

class Expect{
  constructor(result){
    this.result = result;
  }
  toBe(answer){
    if(deepEqual(this.result, answer)) console.log('OK');
    else console.log(`FAIL (targetValue is ${JSON.stringify(this.result)}, expectValue is ${JSON.stringify(answer)})`);
  }
}