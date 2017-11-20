//var jsonState = require('./merge.js');
var print = {
    Error: function (token, position) {
        console.log("Unexpected token ", token, "at position ", position);
    },
    out: function (input, get) {
        var depth;
        var output = "";
        get === undefined ? depth = 0 : depth = get;
        for (var i = 0; i < depth; i++) {
            output += "  ";
        }
        for (prop in input) {
            if (typeof input[prop] !== 'object') {
                console.log(output + '\x1b[33m' + input[prop] + '\x1b[0m');
            }
            else {
                ++depth;
                this.out(input[prop], depth);
            }
        }
    },
    Count: function (input) {
        var output, output2;
        var count = { string: 0, number: 0, boolean: 0, object: 0, array: 0, null: 0 };
        var countkey = ["문자열", "숫자", "부울", "객체", "배열"];
        var length = 0;
        for (prop in input) {
            value = input[prop];
            if (value === null) this.count.null++;
            else if (value instanceof Array)
                count.array++;
            else count[typeof (value)]++;
            length++;
        }

        output = "총 " + '\x1b[33m' + length + '\x1b[0m' + "개의"
        output += Array.isArray(input) ? " 배열 데이터중에 " : " 객체 데이터중에 ";
        Object.keys(count).forEach(show);
        function show(value, index) {
            if (count[value] !== 0) {
                if (output2 === undefined) output2 = countkey[index] + " " + '\x1b[33m' + count[value] + '\x1b[0m' + "개";
                else output2 += ", " + countkey[index] + " " + '\x1b[33m' + count[value] + '\x1b[0m' + "개 ";
            }
        }
        console.log(output + output2 + "\b가 포함되어있습니다.");
    }
}
module.exports = print;

//print.out([10, "jk", [1, [2, 3], 4, 5], 4, "314", 99, "crong", false]);