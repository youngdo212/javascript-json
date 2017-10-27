var constants = require('./constants');
var characters = constants.characters;
var states = constants.states;

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


        return this.result;
    }
};

module.exports = parser;
