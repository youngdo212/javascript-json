var readline = require('readline');
var parser = require('./parser');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayCounts(object) {
    var count = {
        string: 0,
        number: 0,
        boolean: 0,
        object: 0,
        array: 0
    };

    if (object instanceof Array) {
        object.forEach(function(item) {
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
                    if (item instanceof Array) {
                        count.array++;
                    } else {
                        count.object++;
                    }
                break;
            }
        });

        if (object.length === 0) {
            console.log('빈 배열입니다.');
            return ;
        }

        var message = '총 ' + object.length + '개의 배열 데이터 중에 ';

    } else {
        var keys = Object.keys(object);

        keys.forEach(function(key) {
            var value = object[key];

            switch (typeof value) {
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
                    if (value instanceof Array) {
                        count.array++;
                    } else {
                        count.object++;
                    }
                break;
            }
        });

        if (keys.length === 0) {
            console.log('빈 객체입니다.');
            return ;
        }

        var message = '총 ' + keys.length + '개의 객체 데이터 중에 ';
    }

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

    if (count.array > 0) {
        message += '배열 ' + count.object + '개, ';
    }

    message = message.substring(0, message.length - 3);

    message += '가 포함되어 있습니다.';
    console.log(message);
}

rl.on('line', function(input) {
    try {
        var parsedObject = parser.parse(input);
        displayCounts(parsedObject);
    } catch(exception) {
        console.log(exception.message);
    }

    rl.close();
});
