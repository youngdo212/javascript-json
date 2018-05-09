exports.expect = function(answer){
  return new Expect(answer);
}

class Expect{
  constructor(answer){
    this.answer = answer;
  }
  toBe(result){
    if(this.answer === result) return 'OK';
    return `FAIL (targetValue is ${result}, expectValue is ${this.answer}`;
  }
}