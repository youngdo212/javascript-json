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
    null: 'n',
    exponent: 'e',
    isKeyword: function(char) {
        return char === this.true || char === this.false || char === this.null;
    },
    isStartChar: function(char) {
        return char === this.bracketStart || char === this.braceStart;
    },
    isEndChar: function(char) {
        return char === this.bracketEnd || char === this.braceEnd;
    },
    isComponentOfNumber: function(char) {
        return (this.numbers.indexOf(char) !== -1) || char === this.plus || char === this.minus || char === this.dot || char === this.exponent;
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
        name: 'INITIAL', // 0
        validCharacters: {
            array: [' ', '[', ],
            object: [' ', '{', ]
        },
        nextState: {
            array: [0, 1],
            object: [0, 3]
        }
    },
    {
        name: 'WAITING_FOR_INPUT_VALUE', // 1
        validCharacters: {
            array: [' ', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'f', 'n', 'u', '\'', '\"', '{', '[' ],
            object: [' ', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'f', 'n', 'u', '\"', '{', '[' ]
        },
        nextState: {
            array: [1, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2],
            object: [1, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2]
        }
    },
    {
        name: 'WAITING_FOR_CONTINUE_OR_END', // 2
        validCharacters: {
            array: [' ', ',', ']'],
            object: [' ', ',', '}']
        },
        nextState: {
            array: [2, 1, 13],
            object: [2, 3, 13]
        }
    },
    {
        name: 'WAITING_FOR_INPUT_KEY', // 3
        validCharacters: [' ', '\"'],
        nextState: [3, 4]
    },
    {
        name: 'ENCOUNTER_KEY', // 4
        validCharacters: [' ', ':'],
        nextState: [4, 1]
    },
    {
        name: 'ENCOUNTER_SIGN', // 5
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        nextState: [6, 7, 7, 7, 7, 7, 7, 7, 7, 7]
    },
    {
        name: 'ENCOUNTER_ZERO', // 6
        validCharacters: {
            array: [',', ' ', '.', 'e', 'E', ']'],
            object: [',', ' ', '.', 'e', 'E', '}']
        },
        nextState: {
            array: [1, 2, 8, 10, 10, 13],
            object: [3, 2, 8, 10, 10, 13]
        }
    },
    {
        name: 'ENCOUNTER_NATURE_NUMBER', // 7
        validCharacters: {
            array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', 'E', '.', ' ', ',', ']'],
            object: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', 'E', '.', ' ', ',', '}']
        },
        nextState: {
            array: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 10, 8, 2, 1, 13],
            object: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 10, 8, 2, 3, 13]
        }
    },
    {
        name: 'ENCOUNTER_DOT', // 8
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        nextState: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
    },
    {
        name: 'ENCOUNTER_FRACTIONAL_PARTS', // 9
        validCharacters: {
            array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', 'E', ' ', ',', ']'],
            object: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', 'E', ' ', ',', '}']
        },
        nextState: {
            array: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 2, 1, 13],
            object: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 2, 3, 13]
        }
    },
    {
        name: 'ENCOUNTER_EXPONENT_SYMBOL', // 10
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-'],
        nextState: [12, 12, 12 ,12 ,12 ,12 ,12, 12, 12, 12, 11, 11]
    },
    {
        name: 'ENCOUNTER_SIGN_OF_EXPONENT', // 11
        validCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        nextState: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
    },
    {
        name: 'ENCOUNTER_EXPONENT_VALUE', // 12
        validCharacters: {
            array: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', ',', ']'],
            object: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', ',', '}']
        },
        nextState: {
            array: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 2, 1, 13],
            object: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 2, 3, 13]
        }
    },
    {
        name: 'END' // 13
    }
];

states.getStateByName = function(name) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].name === name) {
            return this[i];
        }
    }
};

states.forEach(function(state) {
    state.isNotValidCharacter = function (type, char) {
        if (!this.validCharacters) {
            return undefined;
        }

        var validCharacters = null;

        if (this.validCharacters instanceof Array) {
            validCharacters = this.validCharacters;
        } else {
            validCharacters = this.validCharacters[type];
        }

        return validCharacters.indexOf(char) === -1;
    };

    state.getNextState = function(type, char) {
        var index = -1;

        if (typeof nextState === 'number') {
            return states[nextState];
        }

        if (this.validCharacters instanceof Array) {
            index = this.validCharacters.indexOf(char);
            return states[this.nextState[index]];
        }

        index = this.validCharacters[type].indexOf(char);

        return states[this.nextState[type][index]];
    };
});

module.exports.characters = characters;
module.exports.states = states;
