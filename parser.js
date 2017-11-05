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
        token.nextIndex = this.index + indexOfNextQuote + 1;

        return token;
    },
    getBooleanToken: function() {
        var char = this.input[this.index];
        var keyword = (char === characters.true) ? 'true' : 'false' ;
        var inputToken = this.input.substr(this.index, keyword.length);
        var nextIndex = this.index + keyword.length - 1;

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
    getArrayToken: function() {
        var token = {};

        token.value = this.parseArray();
        token.type = 'array';
        token.nextIndex = this.index - 1;

        return token;
    },
    getObjectToken: function() {
        var token = {};

        token.value = this.parseObject();
        token.type = 'object';
        token.nextIndex = this.index - 1;

        return token;
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
        var parsed = null;

        if (token.type === 'array' || token.type === 'object' || token.type === 'string') {
            parsed = token.value;
        } else if (token.type === 'boolean') {
            parsed = (token.value === 'true');
        } else {
            parsed = new Number(token.value).valueOf();
        }

        return parsed;
    },
    parseArray: function() {
        var thisChar = null;
        var isNotValidCharacter = null;
        var nextState;
        var resultObject = [];
        var parsedToken = null;
        var token = {
            value: ''
        };

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
                this.index = token.nextIndex;
            } else if (characters.isBoolean(thisChar) ) {
                token = this.getBooleanToken();
                this.index = token.nextIndex;
            } else if (thisChar === characters.bracketStart && this.state.name !== 'INITIAL')  {
                token = this.getArrayToken();
                this.index = token.nextIndex;
            } else if (thisChar === characters.braceStart) {
                token = this.getObjectToken();
                this.index = token.nextIndex;
            } else if (characters.isComponentOfNumber(thisChar)) {
                token.value += thisChar;
            } else if (thisChar === characters.comma || thisChar === characters.bracketEnd) {
                parsedToken = this.parseToken(token);
                resultObject.push(parsedToken);
                token = {
                    value: ''
                };
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
        var propertyKey;
        var token = {
            value: ''
        };
        var parsedToken;

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
                this.index = token.nextIndex;

                if (this.state.name === 'WAITING_FOR_INPUT_KEY') {
                    propertyKey = token.value;
                    token = {
                        value: ''
                    };
                }
            } else if (characters.isBoolean(thisChar) ) {
                token = this.getBooleanToken();
                this.index = token.nextIndex;
            } else if (thisChar === characters.bracketStart)  {
                token = this.getArrayToken();
                this.index = token.nextIndex;
            } else if (thisChar === characters.braceStart && this.state.name !== 'INITIAL') {
                token = this.getObjectToken();
                this.index = token.nextIndex;
            } else if (characters.isComponentOfNumber(thisChar)) {
                token.value += thisChar;
            } else if (thisChar === characters.comma || thisChar === characters.braceEnd) {
                parsedToken = this.parseToken(token);
                resultObject[propertyKey] = parsedToken;
                token = {
                    value: ''
                };
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
        } else if (indexOfBracket === -1) {
            this.resultObject = this.parseObject();
        } else if (indexOfBrace === -1) {
            this.resultObject = this.parseArray();
        } else if (indexOfBrace < indexOfBracket) {
            this.resultObject = this.parseObject();
        } else {
            this.resultObject = this.parseArray();
        }

        debugger;

        return this.resultObject;
    }
};

module.exports = parser;
