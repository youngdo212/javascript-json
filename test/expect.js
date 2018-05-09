const {deepEqual} = require("./deepEqual.js");

const expect = function(result){
  return new Expect(result);
}

class Expect{
  constructor(result){
    this.result = result;
  }
  toBe(answer){
    if(deepEqual(this.result, answer)) return 'OK';
    return `FAIL (targetValue is ${JSON.stringify(this.result)}, expectValue is ${JSON.stringify(answer)})`;
  }
}