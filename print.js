var print = {
    Error: function (token, position) {
        console.log("Unexpected token ", token, "at position ", position);
    },

    Count: function (input) {
        var count = { string: 0, number: 0, boolean: 0, array: 0, object: 0, null: 0 };
        var countkey = ["문자열", "숫자", "불리언", "배열", "객체"];
        var length = 0;
        for (prop in input) {
            value = input[prop];
            if (value === null) this.count.null++;
            else if (value instanceof Array)
                count.array++;
            else count[typeof (value)]++;
            length++;
        }
        console.log("총 ", length, "개의", Array.isArray(input) ? "배열" : "객체", " 데이터중에");
    }
}

module.exports = print;