var constants = require('./constants');
var characters = constants.characters;
var states = constants.states;

var validator = {
    state: null,
    input: null,
    index: null,
    currentChar: null,
    init: function(input) {
        this.input = input;
        this.index =  0;
        this.currentChar = this.input[this.index];
        this.state = states.getStateByName('INITIAL');

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

        this.state = states.getStateByName('WATING_ADDITIONAL_INPUT');
        this.index += indexOfNextQuote + 2;
    },
    encounterBoolean: function() {
        var keyword = null;
        var nextIndex = 0;
        var inputToken = null;

        if (this.currentChar === characters.true) {
            keyword = 'true';
            nextIndex = this.index + keyword.length;
            inputToken = this.input.substr(this.index, keyword.length);
        } else {
            keyword = 'false';
            nextIndex = this.index + keyword.length;
            inputToken = this.input.substr(this.index, keyword.length);
        }

        if (keyword === inputToken) {
            this.state = states.getStateByName('WATING_ADDITIONAL_INPUT');
            this.index = nextIndex;
        } else {
            throw Error('Syntax Error!');
        }
    },
    encounterNumber: function() {
        switch (this.state.name) {
            case 'ENCOUNTER_DOT':
                this.state = states.getStateByName('ENCOUNTER_FRACTIONAL_PARTS');
            break;

            case 'ENCOUNTER_SIGN_OF_EXPONENT':
            case 'ENCOUNTER_EXPONENT_SYMBOL':
                this.state = states.getStateByName('ENCOUNTER_EXPONENT_VALUE');
            break;

            case 'WATING_INPUT':
            case 'ENCOUNTER_SIGN':
            case 'ENCOUNTER_COMMA':
                if (this.currentChar === characters.zero) {
                    this.state = states.getStateByName('ENCOUNTER_ZERO');
                } else {
                    this.state = states.getStateByName('ENCOUNTER_NATURE_NUMBER');
                }
            break;
        }
    },
    encounterSignChar: function() {
        switch (this.state.name) {
            case 'ENCOUNTER_EXPONENT_SYMBOL':
                this.state = states.getStateByName('ENCOUNTER_SIGN_OF_EXPONENT');
            break;

            default:
                this.state = states.getStateByName('ENCOUNTER_SIGN');
            break;
        }
    },
    encounterSpace: function() {
        switch (this.state.name) {
            case 'ENCOUNTER_ZERO':
            case 'ENCOUNTER_FRACTIONAL_PARTS':
            case 'ENCOUNTER_NATURE_NUMBER':
            case 'ENCOUNTER_EXPONENT_VALUE':
                this.state = states.getStateByName('WATING_ADDITIONAL_INPUT');
                break;
        }
    },
    run: function () {
        while (this.state.name !== 'END') {
            var thisChar = this.currentChar = this.input[this.index];
            var validCharacters = this.state.validCharacters;

            if (characters.isQuote(thisChar)) {
                this.encounterQuote();
                continue;
            }

            if (characters.isBoolean(thisChar) ) {
                this.encounterBoolean();
                continue;
            }

            if (validCharacters.indexOf(thisChar) === -1) {
                throw Error('Syntax Error!!!');
            }

            if (characters.isNumber(thisChar)) {
                this.encounterNumber();
            } else if (characters.isSignCharacter(thisChar)) {
                this.encounterSignChar();
            } else if (thisChar === characters.bracketStart) {
                this.state = states.getStateByName('WATING_INPUT');
            } else if (thisChar === characters.comma) {
                this.state = states.getStateByName('ENCOUNTER_COMMA');
            } else if (thisChar === characters.space) {
                this.encounterSpace();
            } else if (thisChar === characters.exponent) {
                this.state = states.getStateByName('ENCOUNTER_EXPONENT_SYMBOL');
            } else if (thisChar === characters.dot) {
                this.state = states.getStateByName('ENCOUNTER_DOT');
            } else if (thisChar === characters.bracketEnd) {
                this.state = states.getStateByName('END');
            }

            this.index++;
        }

        return this.state.name === 'END';
    }
};

module.exports = validator;
