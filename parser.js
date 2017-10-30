var constants = require('./constants');
var characters = constants.characters;
var states = constants.states;

var parser = {
    index: null,
    input: null,
    currentChar: null,
    resultObject: [],
    getStringToken: function() {
        var restOfInput = this.input.substr(this.index + 1);
        var nextIndex = this.findIndexOfNextQuote(restOfInput, this.currentChar);

        var stringToken = this.input.substr(this.index + 1, nextIndex);
        this.resultObject.push(stringToken);
        this.index += nextIndex + 2;
    },
    getBooleanToken: function() {
        var keyword = null;
        var nextIndex = 0;
        var inputToken = null;

        if (this.currentChar === 't') {
            nextIndex = 4;
            inputToken = this.input.substr(this.index, nextIndex);
            this.resultObject.push(true);
        } else {
            nextIndex = 5;
            inputToken = this.input.substr(this.index, nextIndex);
            this.resultObject.push(false);
        }

        this.index += nextIndex;
    },
    getNumberToken: function() {
        var restOfInput = this.input.substr(this.index);

        var indexOfNextComma = restOfInput.indexOf(characters.comma);
        var indexOfNextSpace = restOfInput.indexOf(characters.space);
        var indexOfBracketEnd = restOfInput.indexOf(characters.bracketEnd);

        var nextIndex = 0;

        if (indexOfNextComma === -1 && indexOfNextSpace === -1) {
            nextIndex = indexOfBracketEnd;
        } else if (indexOfNextComma === -1) {
            nextIndex = indexOfNextSpace;
        } else if (indexOfNextSpace === -1) {
            nextIndex = indexOfNextSpace;
        } else {
            nextIndex = (indexOfNextComma < indexOfNextSpace) ? indexOfNextComma : indexOfNextSpace;
        }

        var numberToken = this.input.substr(this.index, nextIndex);

        this.resultObject.push(new Number(numberToken).valueOf());
        this.index += nextIndex;
    },
    findIndexOfNextQuote: function(str, quote) {
        var foundIndex = str.indexOf(quote);

        if (foundIndex === -1) {
            return -1;
        }

        if (foundIndex > 0 && str[foundIndex - 1] === characters.backslash) {
            var nextIndex = findIndexOfNextQuote(str.substr(foundIndex + 1), quote);

            if (nextIndex === -1) {
                foundIndex = -1;
            } else {
                foundIndex += nextIndex + 1;
            }
        }
        return foundIndex;
    },
    init: function(input) {
        this.index = 0;
        this.input = input;
        this.currentChar = this.input[this.index];

        return this;
    },
    parse: function() {
        while (this.input[this.index] !== characters.bracketEnd) {
            this.currentChar = this.input[this.index];

            if (characters.isQuote(this.currentChar)) {
                this.getStringToken();
                continue;
            }

            if (characters.isBoolean(this.currentChar)) {
                this.getBooleanToken();
                continue;
            }

            if (characters.isNumber(this.currentChar)) {
                this.getNumberToken();
                continue;
            }

            this.index++;
        }

        return this.resultObject;
    }
};

module.exports = parser;
