var constants = require('./constants');
var characters = constants.characters;
var states = constants.states;

var parser = {
    state: null,
    input: null,
    index: 0,
    currentToken: null,
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
        token.nextIndex = indexOfNextQuote + 2;

        return token;
    },
    getBooleanToken: function() {
        var char = this.input[this.index];
        var keyword = (char === characters.true) ? 'true' : 'false' ;
        var inputToken = this.input.substr(this.index, keyword.length);
        var nextIndex = keyword.length;

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
    getContext: function() {
        var context = {};

        context.index = this.index;
        context.input = this.input;
        context.state = this.state;
        context.resultObject = this.resultObject;

        return context;
    },
    restoreContext: function(context) {
        this.index = context.index;
        this.input = context.input;
        this.state = context.state;
        this.resultObject = context.resultObject;
    },
    parseArray: function(input) {
        var indexOfValidChar = 0;
        var thisChar = null;
        var validCharacters = null;
        var token = '';
        var nextState;
        var context = null;

        debugger;

        while (this.state.name !== 'END_ARRAY') {
            debugger;
            thisChar = this.input[this.index];
            validCharacters = this.state.getValidCharacters('array');
            nextState = this.state.getNextState('array', thisChar);

            debugger;

            if (characters.isQuote(thisChar)) {
                token = this.getStringToken();

                this.index += token.nextIndex;
                this.state = nextState;

                continue;
            }

            if (characters.isBoolean(thisChar) ) {
                token = this.getBooleanToken();

                this.index += token.nextIndex;
                this.state = nextState;

                continue;
            }

            debugger;

            indexOfValidChar = validCharacters.indexOf(thisChar);

            if (indexOfValidChar === -1) {
                throw Error('Syntax Error!!!');
            }

            debugger;

            if (thisChar === characters.bracketStart)  {
                if (this.state.name === 'INITIAL') {
                    this.resultObject = [];
                    this.state = nextState;
                    this.index++;
                    continue;
                }

                // backup context
                context = this.getContext();
                token = this.parseArray.call(this, input);
                token.type = 'array';

                context.state = nextState;
                context.index = this.index;

                this.restoreContext(context);
                continue;
            }

            if (thisChar === characters.braceStart) {
                context = this.getContext();
                token = this.parseObject.call(this, input);
                token.type = 'object';

                context.state = nextState;
                context.index = this.index;

                this.restoreContext(context);
                continue;
            }

            debugger;

            if (characters.isSignCharacter(thisChar) || characters.isNumber(thisChar) || characters.exponent === thisChar || characters.dot === thisChar) {
                token += thisChar;
            }

            debugger;

            if (thisChar === characters.comma || thisChar === characters.bracketEnd) {
                if (token.type === 'array' || token.type === 'object') {
                    this.resultObject.push(token);
                } else if (token.type === 'string') {
                    this.resultObject.push(token.value);
                } else if (token.type === 'boolean') {
                    this.resultObject.push((token.value === 'true'));
                } else if (new Number(token).valueOf() !== NaN) {
                    this.resultObject.push(new Number(token).valueOf());
                }

                token = '';
            }

            debugger;

            this.state = nextState;
            this.index++;
        }

        debugger;

        return this.resultObject;
    },
    parseObject: function() {

    },
    parse: function(input) {
        debugger;
        // initialize
        this.input = input;
        this.state = states.getStateByName('INITIAL');
        this.index = 0;

        var indexOfBracket = input.indexOf(characters.bracketStart);
        var indexOfBrace = input.indexOf(characters.bracketStart);

        if (indexOfBracket === -1 && indexOfBrace === -1) {
            throw Error('Syntax error occurred!');
        } else if (indexOfBracket === -1 || indexOfBrace < indexOfBracket) {
            this.resultObject = this.parseObject(input);
        } else {
            this.resultObject = this.parseArray(input);
        }

        debugger;

        return this.resultObject;
    }
};

module.exports = parser;
