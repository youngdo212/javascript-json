var print = require('./print.js');
var tokenizer = {
    num: "0123456789",
    endvalue: [" ", ",", "]", "}"],
    readStr: function (input) {//문자열과 다음 i 반환, 에러는 -1 반환
        var pos = input.i;
        for (; input.i < input.length; input.i++) {
            if (input.value[input.i] === '"') {
                return input.value.slice(pos, input.i);
            }
        }
        console.log("문자열 Unexpected end of JSON input");
        process.exit();
    },
    readNum: function (input) { //숫자와 다음 i 반환 , 에러는 -1 반환
        var pos = input.i;
        for (; input.i < input.length; input.i++) {
            if (this.endvalue.indexOf(input.value[input.i]) !== -1) {
                return Number(input.value.slice(pos, input.i));
            }
            else if (this.num.indexOf(input.value[input.i]) !== -1) { }
            else {
                print.Error(input.value[input.i], input.i);
                return -1;
            }
        }
        console.log("숫자 Unexpected end of JSON input");
        process.exit();
    },
    readBool: function (input) {//bool값과 다음 i 반환, 에러는 -1 반환
        var pos = input.i;
        for (; input.i < input.length; input.i++) {
            if (this.endvalue.indexOf(input.value[input.i]) !== -1) {
                tmp = input.value.slice(pos, input.i);
                if (tmp === 'true') return true;
                else if (tmp === 'false') return false;
                else {
                    print.Error(tmp, input.i);
                    return -1;
                }
            }
        }
        console.log("불 Unexpected end of JSON input");
        process.exit();
    }
};
module.exports = tokenizer;