var characters = {
    singleQuote: '\'',
    doubleQuote: '\"',
    backslash: '\\',
    comma: ',',
    space: ' ',
    bracketStart: '[',
    bracketEnd: ']',
    braceStart: '{',
    braceEnd: '}',
    numbers: ['0','1','2','3','4','5','6','7','8','9'],
    plus: '+',
    minus: '-',
    exponent: 'e'
};

var states = {
    INITIAL: 0,
    WATING_INPUT: 1,
    WATING_EXTRA_INPUT: 2,
    ENCOUNTER_SIGN: 3,
    ENCOUNTER_ZERO: 4,
    ENCOUNTER_COMMA: 5,
    ENCOUNTER_DOT: 6,
    ENCOUNTER_FRACTIONAL_PARTS: 7,
    ENCOUNTER_NATURE_NUMBER: 8,
    ENCOUNTER_EXPONENT_SYMBOL: 9,
    ENCOUNTER_SIGN_OF_EXPONENT: 10,
    ENCOUNTER_EXPONENT_VALUE: 11,
    ENCOUNTER_SINGLE_QUOTE: 12,
    ENCOUNTER_DOUBLE_QUOTE: 13,
    END: 14
};

var validCharactersMap = [
    [' ', '[', ],
    [' ', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '\'', '\"', ']' ],
    [' ', ',', ']'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    [' ', '.', ',', ']'],
    [' ', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '\'', '\"'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', ' ', ',', ']'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', ' ', '.', ',', ']'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', ',', ']']
];

module.exports.characters = characters;
module.exports.states = states;
module.exports.validCharactersMap = validCharactersMap;
