var characters = {
    singleQuote: '\'',
    doubleQuote: '\"',
    backslash: '\\',
    comma: ',',
    space: ' ',
    dot: '.',
    bracketStart: '[',
    bracketEnd: ']',
    braceStart: '{',
    braceEnd: '}',
    numbers: ['0','1','2','3','4','5','6','7','8','9'],
    zero: '0',
    plus: '+',
    minus: '-',
    true: 't',
    false: 'f',
    exponent: 'e',
    isNumber: function(char) {
        return this.numbers.indexOf(char) !== -1;
    },
    isSignCharacter: function(char) {
        return (char === this.plus || char === this.minus);
    },
    isQuote: function(char) {
        return (char === this.singleQuote || char === this.doubleQuote);
    },
    isBoolean: function(char) {
        return char === this.true || char === this.false;
    }
};

var states = [
    {
        name: 'INITIAL',
        validCharacters: [' ', '[', ]
    },
    {
        name: 'WATING_INPUT',
        validCharacters: [' ', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '\'', '\"', ']' ]
    },
    {
        name: 'WATING_ADDITIONAL_INPUT',
        validCharacters: [' ', ',', ']']
    },
    {
        name: 'ENCOUNTER_SIGN',
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    },
    {
        name: 'ENCOUNTER_ZERO',
        validCharacters: [' ', '.', 'e', ',', ']']
    },
    {
        name: 'ENCOUNTER_COMMA',
        validCharacters: [' ', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '\'', '\"']
    },
    {
        name: 'ENCOUNTER_DOT',
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    },
    {
        name: 'ENCOUNTER_FRACTIONAL_PARTS',
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', ' ', ',', ']']
    },
    {
        name: 'ENCOUNTER_NATURE_NUMBER',
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', ' ', '.', ',', ']']
    },
    {
        name: 'ENCOUNTER_EXPONENT_SYMBOL',
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-']
    },
    {
        name: 'ENCOUNTER_SIGN_OF_EXPONENT',
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    },
    {
        name: 'ENCOUNTER_EXPONENT_VALUE',
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', ',', ']']
    },
    {
        name: 'ENCOUNTER_SINGLE_QUOTE'
    },
    {
        name: 'ENCOUNTER_DOUBLE_QUOTE'
    },
    {
        name: 'ENCOUNTER_BOOLEAN_TRUE'
    },
    {
        name: 'ENCOUNTER_BOOLEAN_FALSE'
    },
    {
        name: 'END'
    }
];

states.getStateByName = function(name) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].name === name) {
            return this[i];
        }
    }
};

module.exports.characters = characters;
module.exports.states = states;
