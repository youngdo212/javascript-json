var readline = require('readline');
var parser = require('./parser');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayArray(array) {
    var count = {
        string: 0,
        number: 0,
        boolean: 0,
        object: 0
    };

    array.forEach(function(item) {
        switch (typeof item) {
            case 'number':
                count.number++;
            break;

            case 'string':
                count.string++;
            break;

            case 'boolean':
                count.boolean++;
            break;

            case 'object':
                count.object++;
            break;
        }
    });

    if (array.length === 0) {
        console.log('빈 배열입니다.');
        return ;
    }

    var message = '총 ' + array.length + '개의 배열 데이터 중에 ';

    if (count.string > 0) {
        message += '문자열 ' + count.string + '개, ';
    }

    if (count.number > 0) {
        message += '숫자 ' + count.number + '개, ';
    }

    if (count.boolean > 0) {
        message += '부울 ' + count.boolean + '개, ';
    }

    if (count.object > 0) {
        message += '객체 ' + count.object + '개, ';
    }

    message = message.substring(0, message.length - 3);

    message += '가 포함되어 있습니다.';
    console.log(message);
}

function displayObject(object) {

}

rl.on('line', function(input) {
    try {
        var parsedObject = parser.parse(input);

        if (parsedObject instanceof Array) {
            displayArray(parsedObject);
        } else {
            displayObject(parsedObject);
        }
    } catch(exception) {
        console.log(exception);
        console.log(exception.message);
    }

    rl.close();
});
