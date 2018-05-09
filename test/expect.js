exports.expect = function(result){
  return new Expect(result);
}

class Expect{
  constructor(result){
    this.result = result;
  }
  toBe(answer){
    if(this.result === answer) return 'OK';
    return `FAIL (targetValue is ${this.result}, expectValue is ${answer})`;
  }
}