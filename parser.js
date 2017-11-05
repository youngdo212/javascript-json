var constants = require('./constants');
var characters = constants.characters;
var states = constants.states;

var parser = {
    state: null,
    input: null,
    index: 0,
    resultObject: null,
    getStringToken: function() {
        var quote = this.input[this.index];
        var restOfInput = this.input.substr(this.index + 1);
        var indexOfNextQuote = this.findIndexOfNextQuote(restOfInput, quote);

        if (indexOfNextQuote === -1) {
            throw Error('index:' + this.index + ' 에서 시작하는 ' + quote + '가 닫히지 않음.')
        }

        var token = {};
        token.value = restOfInput.substr(0, indexOfNextQuote);
        token.type = 'string';
        token.nextIndex = indexOfNextQuote + 1;

        return token;
    },
    getBooleanToken: function() {
        var char = this.input[this.index];
        var keyword = (char === characters.true) ? 'true' : 'false' ;
        var inputToken = this.input.substr(this.index, keyword.length);
        var nextIndex = keyword.length - 1;

        var token = {};

        if (keyword === inputToken) {
            token.value = inputToken;
            token.nextIndex = nextIndex;
            token.type = 'boolean';

            return token;
        } else {
            throw Error('Syntax Error!');
        }
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
    parseToken: function(token) {
        var value = null;

        if (token.type === 'array' || token.type === 'object') {
            value = token;
        } else if (token.type === 'string') {
            value = token.value;
        } else if (token.type === 'boolean') {
            value = (token.value === 'true');
        } else {
            value = new Number(token).valueOf();
        }

        return value;
    },
    parseArray: function() {
        var thisChar = null;
        var isNotValidCharacter = null;
        var nextState;
        var resultObject = [];
        var token = '';
        var value = null;

        debugger;

        this.state = states.getStateByName('INITIAL');

        while (this.state.name !== 'END_ARRAY') {
            thisChar = this.input[this.index];
            isNotValidCharacter = this.state.isNotValidCharacter('array', thisChar);
            nextState = this.state.getNextState('array', thisChar);

            debugger;

            // check syntax is valid
            if (isNotValidCharacter) {
                throw Error('Syntax Error!!!');
            }

            // make token (string)
            if (characters.isQuote(thisChar)) {
                token = this.getStringToken();
                this.index += token.nextIndex;
            } else if (characters.isBoolean(thisChar) ) {
                token = this.getBooleanToken();
                this.index += token.nextIndex;
            } else if (thisChar === characters.bracketStart && this.state.name !== 'INITIAL')  {
                token = this.parseArray();
                token.type = 'array';
            } else if (thisChar === characters.braceStart) {
                token = this.parseObject();
                token.type = 'object';
            } else if (characters.isComponentOfNumber(thisChar)) {
                token += thisChar;
            }

            debugger;

            // get value from token
            if (thisChar === characters.comma || thisChar === characters.bracketEnd) {
                value = this.parseToken(token);
                resultObject.push(value);
                token = '';
            }

            debugger;

            this.state = nextState;
            this.index++;
        }

        return resultObject;
    },
    parseObject: function() {
        var indexOfValidChar = 0;
        var thisChar = null;
        var isNotValidCharacter = null;
        var nextState;
        var resultObject = {};
        var token;
        var key;
        var value;

        debugger;

        this.state = states.getStateByName('INITIAL');

        while (this.state.name !== 'END_OBJECT') {
            thisChar = this.input[this.index];
            isNotValidCharacter = this.state.isNotValidCharacter('object', thisChar);
            nextState = this.state.getNextState('object', thisChar);

            debugger;

            if (isNotValidCharacter) {
                throw Error('Syntax Error!!!');
            }

            // make token (string)
            if (characters.isQuote(thisChar)) {
                token = this.getStringToken();
                this.index += token.nextIndex;

                if (this.state.name === 'WAITING_FOR_INPUT_KEY') {
                    key = token.value;
                    token = '';
                }
            } else if (characters.isBoolean(thisChar) ) {
                token = this.getBooleanToken();
                this.index += token.nextIndex;
            } else if (thisChar === characters.bracketStart)  {
                token = this.parseArray();
                token.type = 'array';
            } else if (thisChar === characters.braceStart && this.state.name !== 'INITIAL') {
                token = this.parseObject();
                token.type = 'object';
            } else if (characters.isComponentOfNumber(thisChar)) {
                token += thisChar;
            }

            if (thisChar === characters.comma || thisChar === characters.braceEnd) {
                value = this.parseToken(token);
                resultObject[key] = value;
                token = '';
            }

            this.state = nextState;
            this.index++;

            debugger;
        }

        return resultObject;
    },
    parse: function(input) {
        //initialize
        this.input = input;

        debugger;
        var indexOfBracket = input.indexOf(characters.bracketStart);
        var indexOfBrace = input.indexOf(characters.braceStart);

        debugger;

        if (indexOfBracket === -1 && indexOfBrace === -1) {
            throw Error('Syntax error occurred!');
        } else if (indexOfBracket === -1 || (indexOfBrace > indexOfBracket)) {
            this.resultObject = this.parseObject();
        } else {
            this.resultObject = this.parseArray();
        }

        debugger;

        return this.resultObject;
    }
};

module.exports = parser;
