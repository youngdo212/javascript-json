var constants = require('./constants');
var characters = constants.characters;
var states = constants.states;
var validCharactersMap = constants.validCharactersMap;

var validator = {
    state: null,
    input: null,
    index: null,
    currentChar: null,
    init: function(input) {
        this.input = input;
        this.index =  0;
        this.currentChar = this.input[this.index];
        this.state = states.INITIAL;

        return this;
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
    encounterQuote: function() {
        var restOfInput = this.input.substr(this.index + 1, this.input.length - 1);
        var indexOfNextQuote = this.findIndexOfNextQuote(restOfInput, this.currentChar);

        if (indexOfNextQuote === -1) {
            throw Error('index:' + this.index + ' 에서 시작하는 ' + this.currentChar + '가 닫히지 않음.')
        }

        this.state = states.WATING_EXTRA_INPUT;
        this.index += indexOfNextQuote + 2;
    },
    encounterBoolean: function() {
        var keyword = null;
        var nextIndex = 0;
        var inputToken = null;

        if (this.currentChar === 't') {
            keyword = 'true';
            nextIndex = this.index + keyword.length;
            inputToken = this.input.substr(this.index, keyword.length);
        } else {
            keyword = 'false';
            nextIndex = this.index + keyword.length;
            inputToken = this.input.substr(this.index, keyword.length);
        }

        if (keyword === inputToken) {
            this.state = states.WATING_EXTRA_INPUT;
            this.index = nextIndex;
        } else {
            throw Error('Syntax Error!');
        }
    },
    encounterNumber: function() {
        switch (this.state) {
            case states.ENCOUNTER_DOT:
                this.state = states.ENCOUNTER_FRACTIONAL_PARTS;
            break;

            case states.ENCOUNTER_SIGN_OF_EXPONENT:
            case states.ENCOUNTER_EXPONENT_SYMBOL:
                this.state = states.ENCOUNTER_EXPONENT_VALUE;
            break;

            case states.WATING_INPUT:
            case states.ENCOUNTER_SIGN:
            case states.ENCOUNTER_COMMA:
                if (this.currentChar === characters.zero) {
                    this.state = states.ENCOUNTER_ZERO;
                } else {
                    this.state = states.ENCOUNTER_NATURE_NUMBER;
                }
            break;
        }
    },
    run: function () {
        while (this.state !== states.END) {
            this.currentChar = this.input[this.index];
            var validCharacters = validCharactersMap[this.state];

            if (characters.isQuote(this.currentChar)) {
                this.encounterQuote();
                continue;
            }

            if (characters.isBoolean(this.currentChar) ) {
                this.encounterBoolean();
                continue;
            }

            if (validCharacters.indexOf(this.currentChar) === -1) {
                throw Error('Syntax Error!!!');
            }

            if (characters.isNumber(this.currentChar)) {
                this.encounterNumber();
            } else if (characters.isSignCharacter(this.currentChar)) {
                if (this.state === states.ENCOUNTER_EXPONENT_SYMBOL) {
                    this.state = states.ENCOUNTER_SIGN_OF_EXPONENT;
                } else {
                    this.state = states.ENCOUNTER_SIGN;
                }
            } else if (this.currentChar === characters.bracketStart) {
                this.state = states.WATING_INPUT;
            } else if (this.currentChar === characters.comma) {
                this.state = states.ENCOUNTER_COMMA;
            } else if (this.currentChar === characters.space) {
                if (states.isNotAllowedSpaceCharacter(this.state)) {
                    this.state = states.WATING_EXTRA_INPUT;
                }
            } else if (this.currentChar === characters.exponent) {
                this.state = states.ENCOUNTER_EXPONENT_SYMBOL;
            } else if (this.currentChar === characters.dot) {
                this.state = states.ENCOUNTER_DOT;
            } else if (this.currentChar === characters.bracketEnd) {
                this.state = states.END;
            }

            this.index++;
        }

        return this.state === states.END;
    }
};

module.exports = validator;
