var constants = require('./constants');
var characters = constants.characters;
var states = constants.states;
var validCharactersMap = constants.validCharactersMap;

var validator = {
    state: states.INITIAL,
    index: 0,
    isNumber: function(char) {
        return characters.numbers.indexOf(char) !== -1
    },
    isSignCharacter: function(char) {
        return char === characters.plus || char === characters.minus;
    },
    isQuote: function(char) {
        return char === characters.singleQuote || char === characters.doubleQuote;
    },
    findIndexOfNextQuote: function(str, quote) {
        var lastIndex = str.length - 1;
        var foundIndex = str.indexOf(quote);

        if (foundIndex === -1) {
            return -1;
        }

        if (foundIndex > 0 && str[foundIndex - 1] === characters.backslash) {
            var nextIndex = findIndexOfNextQuote(str.substr(foundIndex + 1, lastIndex), quote);

            if (nextIndex === -1) {
                foundIndex = -1;
            } else {
                foundIndex += nextIndex + 1;
            }
        }
        return foundIndex;
    },
    validate: function (input) {
        while (this.state !== states.END) {
            var thisChar = input[this.index];
            var validCharacters = validCharactersMap[this.state];

            //string 처리 먼저
            if (this.isQuote(thisChar)) {
                if (this.state === states.QUOTES_OPENED) {
                    var restOfInput = input.substr(this.index + 1, input.length - 1);
                    var indexOfNextQuote = this.findIndexOfNextQuote(restOfInput, thisChar);

                    if (indexOfNextQuote === -1) {
                        throw Error('index:' + this.index + ' 에서 시작하는 ' + thisChar + '가 닫히지 않음.')
                    }

                    this.state = states.WATING_EXTRA_INPUT;
                    this.index += indexOfNextQuote + 2;
                } else {
                    this.state = states.QUOTES_OPENED;
                    this.index++;
                }

                continue;
            }

            if (validCharacters.indexOf(thisChar) === -1) {
                throw Error('Syntax Error!!!');
            }

            if (thisChar === characters.bracketStart) { // [
                this.state = states.WATING_INPUT;
            } else if (thisChar === characters.space) {
                if (this.state !== states.INITIAL &&
                    this.state !== states.WATING_INPUT &&
                    this.state !== states.WATING_EXTRA_INPUT &&
                    this.state !== states.ENCOUNTER_COMMA) {

                    this.state = states.WATING_EXTRA_INPUT;
                }
            } else if (thisChar === characters.zero) { // num
                if (this.state === states.AFTER_SPACE) {
                    throw Error ('공백 뭐냐');
                }
                this.state = states.AFTER_NUMBER;
            } else if (thisChar === characters.comma) { // ,
                this.state = states.AFTER_COMMA;
            } else if (this.isSignCharacter(thisChar)) { // - or +
                this.state = states.AFTER_SIGN;
            } else if (thisChar === characters.exponent) { // e
                this.state = states.AFTER_EXPONENT;
            } else if (thisChar === characters.bracketEnd) { // ]
                this.state = states.END;
            }

            this.index++;
        }
    }
};

module.exports = validator;
