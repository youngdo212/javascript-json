var readline = require('readline');
var validator = require('./validator');
var parser = require('./parser');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayResult(result) {
    var countOfString = 0;
    var countOfNumber = 0;
    var countOfBoolean = 0;

    result.forEach(function(item) {
        switch (typeof item) {
            case 'number':
                countOfNumber++;
            break;

            case 'string':
                countOfString++;
            break;

            case 'boolean':
                countOfBoolean++;
            break;
        }
    });

    if (result.length === 0) {
        console.log('빈 배열입니다.');
        return ;
    }

    var message = '총 ' + result.length + '개의 데이터 중에 ';

    if (countOfString > 0) {
        message += '문자열 ' + countOfString + '개';
    }

    if (countOfNumber > 0) {
        if (countOfString > 0) {
            message += ', ';
        }
        message += '숫자 ' + countOfNumber + '개';
    }

    if (countOfBoolean > 0) {
        if (countOfNumber > 0) {
            message += ', ';
        }
        message += '부울 ' + countOfBoolean + '개';
    }

    message += '가 포함되어 있습니다.';
    console.log(message);
}

rl.on('line', function(input) {
    try {
        var isValidInput = validator.init(input).run();

        if (isValidInput) {
            var result = parser.init(input).parse();
            displayResult(result);
        }
    } catch(exception) {
        console.log(exception.message);
    }

    rl.close();
});
