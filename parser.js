var constants = require('./constants');
var characters = constants.characters;
var states = constants.states;

var parser = {
    state: null,
    input: null,
    index: 0,
    depth: 0,
    resultObject: null,
    typeOfObject: null,
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
    getKeywordToken: function() {
        var char = this.input[this.index];
        var token = {};
        var keyword = null;
        var type = null;

        if (char === characters.true) {
            keyword = 'true';
            type = 'boolean';
        } else if (char === characters.false) {
            keyword = 'false';
            type = 'boolean';
        } else {
            keyword = 'null';
            type = 'null';
        }

        var tokenStr = this.input.substr(this.index, keyword.length);
        var nextIndex = this.index + keyword.length - 1;

        if (keyword === tokenStr) {
            token.value = keyword;
            token.nextIndex = nextIndex;
            token.type = type;

            return token;
        } else {
            throw Error('Syntax Error!');
        }
    },
    getContext: function() {
        var context = {};

        context.resultObject = this.resultObject;
        context.typeOfObject = this.typeOfObject;
        context.input = this.input;
        context.index = this.index;

        return context;
    },
    getObjectToken: function() {
        var token = {};
        var context = this.getContext();
        var subStr = this.input.substr(this.index);

        this.depth++;
        token.value = this.parse(subStr);
        this.depth--;

        this.resultObject = context.resultObject;
        this.typeOfObject = context.typeOfObject;
        this.input = context.input;
        this.index += context.index - 1;

        token.type = (token.value instanceof Array) ? 'array' : 'object';

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
        } else if (token.type === 'null') {
            parsed = null;
        } else {
            parsed = new Number(token).valueOf();
        }

        return parsed;
    },
    getTypeOfObject: function (input) {
        var indexOfBracket = input.indexOf(characters.bracketStart);
        var indexOfBrace = input.indexOf(characters.braceStart);

        var type = null;

        if (indexOfBracket === -1 && indexOfBrace === -1) {
            throw Error('Syntax error occurred!');
        } else if (indexOfBracket === -1) {
            type = 'object';
        } else if (indexOfBrace === -1) {
            type = 'array';
        } else if (indexOfBrace < indexOfBracket) {
            type = 'object';
        } else {
            type = 'array';
        }

        return type;
    },
    isEmptyObject: function() {
        var startChar = (this.typeOfObject === 'array') ? '[' : '{';
        var endChar = (this.typeOfObject === 'array') ? ']' : '}';

        var startIndex = this.input.indexOf(startChar) + 1;
        var endIndex = this.input.indexOf(endChar);

        for (var i = startIndex; i < endIndex; i++) {
            if (this.input[i] !== characters.space) {
                return false;
            }
        }

        return true;
    },
    validateRestOfInput: function() {
        for (var i = this.index; i < this.input.length; i++) {
            if (this.input[i] !== characters.space) {
                throw Error('Syntax Error!!');
            }
        }
    },
    parse: function(input) {
        //initialize
        this.state = states.getStateByName('INITIAL');
        this.input = input;
        this.index = 0;
        this.typeOfObject = this.getTypeOfObject(input);
        this.resultObject = (this.typeOfObject === 'array') ? [] : {};

        var thisChar = null;
        var isNotValidCharacter = null;
        var nextState = null;
        var parsedToken = null;
        var propertyKey = null;
        var token = '';

        debugger;

        if (this.isEmptyObject()) {
            var endChar = (this.typeOfObject === 'array') ? ']' : '}';
            this.index = this.input.indexOf(endChar) + 1;
            this.state = states.getStateByName('END');
        }

        while (this.state.name !== 'END') {
            thisChar = this.input[this.index];
            isNotValidCharacter = this.state.isNotValidCharacter(this.typeOfObject, thisChar);
            nextState = this.state.getNextState(this.typeOfObject, thisChar);

            debugger;

            // check syntax is valid
            if (isNotValidCharacter) {
                throw Error('Syntax Error!!!');
            }

            // make token (string)
            if (characters.isQuote(thisChar)) {
                token = this.getStringToken();
                this.index = token.nextIndex;

                if (this.state.name === 'WAITING_FOR_INPUT_KEY') {
                    propertyKey = token.value;
                    token = '';
                }
            } else if (characters.isKeyword(thisChar) ) {
                // true, false, null
                token = this.getKeywordToken();
                this.index = token.nextIndex;
            } else if (characters.isStartChar(thisChar) && this.state.name !== 'INITIAL') {
                token = this.getObjectToken();
            } else if (characters.isComponentOfNumber(thisChar)) {
                token += thisChar;
            } else if (thisChar === characters.comma || characters.isEndChar(thisChar)) {
                parsedToken = this.parseToken(token);

                if (this.typeOfObject === 'array') {
                    this.resultObject.push(parsedToken);
                } else {
                    this.resultObject[propertyKey] = parsedToken;
                }

                token = '';
            }

            debugger;

            this.state = nextState;
            this.index++;
        }

        if (this.depth === 0) {
            this.validateRestOfInput();
        }

        return this.resultObject;
    }
};

module.exports = parser;
