var print = require('./print.js');
var tokenizer = {
    num: "0123456789",
    endvalue: [" ", ",", "]", "}"],
    readStr: function (input, i) {//문자열과 다음 i 반환, 에러는 -1 반환
        var pos = i;
        for (; i < input.length; i++) {
            if (input.value[i] === '"') {
                return [i, input.value.slice(pos, i)];
            }
        }
        console.log("Unexpected end of JSON input");
        process.exit();
    },
    readNum: function (input, i) { //숫자와 다음 i 반환 , 에러는 -1 반환
        var pos = i;
        for (; i < input.length; i++) {
            if (this.endvalue.indexOf(input.value[i]) !== -1) {
                return [i, Number(input.value.slice(pos, i))];
            }
            else if (this.num.indexOf(input.value[i]) !== -1) { }
            else {
                print.Error(input.value[i], i);
                return -1;
            }
        }
        console.log("Unexpected end of JSON input");
        process.exit();
    },
    readBool: function (input, i) {//bool값과 다음 i 반환, 에러는 -1 반환
        var pos = i;
        for (; i < input.length; i++) {
            if (this.endvalue.indexOf(input.value[i]) !== -1) {
                tmp = input.value.slice(pos, i);
                if (tmp === 'true') return [i, true];
                else if (tmp === 'false') return [i, false];
                else {
                    print.Error(tmp, i);
                    return -1;
                }
            }
        }
        console.log("Unexpected end of JSON input");
        process.exit();
    }
};
module.exports = tokenizer;