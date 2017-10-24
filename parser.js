var parser = {
    result: [],

    checkTypeOfString: function(token) {
        /* TODO
         * - {token}값이 String 값인지 여부를 반환
         */

        return false;
    },
    checkTypeOfNumber: function(token) {
        /* TODO
         * - {token}값이 Number 값인지 여부를 반환
         */

        return false;
    },
    checkTypeOfBoolean: function(token) {
        /* TODO
         * - {token}값이 Boolean 값인지 여부를 반환
         */

        return false;
    },
    removeWhiteSpcaces: function(input) {
        /* TODO
         * - {input}값을 순회하며 double quotes내에 존재하는 공백을 제외한 모든 공백을 제거한다.
         */

        return input;
    },
    parse: function(input) {
        var tokens = removeWhiteSpcaces(input).split('$');

        tokens.forEach(function(token) {

            // 1. checkTypeOfString()
            // 2. checkTypeOfNumber()
            // 3. checkTypeOfBoolean()
            // 4. throw Error

        }.bind(this));

        return this.result;
    }
};

module.exports = parser;
