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

    var values = null;
    var objectName = null;

    if (object instanceof Array) {
        values = object;
        objectName = '배열';
    } else {
        var keys = Object.keys(object);
        values = keys.map(function(key) {
            return object[key];
        });
        objectName = '객체';
    }

    values.forEach(function(item) {
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

    if (values.length === 0) {
        console.log('빈 ' + objectName + '입니다.');
        return ;
    }

    var message = '총 ' + values.length + '개의 ' + objectName + ' 데이터 중에 ';

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

    message = message.substring(0, message.length - 2);
    message += '가 포함되어 있습니다.';

    console.log(message);
}

function toJsonString(options) {
    var object = options.object;
    var tabSize = options.tabSize || 4;
    var limitPerLine = options.limitPerLine || 4;
    var depth = options.depth || 1;

    var jsonStr = '';
    var keys = null;
    var values = null;
    var hasObject = false;

    var startChar;
    var endChar;

    if (object instanceof Array) {
        startChar = '[';
        endChar = ']';
        values = object;
    } else {
        startChar = '{';
        endChar = '}';
        keys = Object.keys(object);
        values = keys.map(function(key) {
            return object[key];
        });
    }

    jsonStr += startChar;

    hasObject = values.some(function (item) {
        return typeof item === 'object';
    });

    if (hasObject || values.length > limitPerLine) {
        jsonStr += '\n';
    }

    values.forEach(function(item, index) {
        if (hasObject || values.length > limitPerLine) {
            for (var i = 0; i < depth * tabSize; i++) {
                jsonStr += ' ';
            }
        }

        if (object instanceof Array === false) {
            jsonStr += '\"' + keys[index] + '\" : ';
        }

        switch (typeof item) {
            case 'string':
                jsonStr += '\"' + item + '\"';
            break;

            case 'number':
            case 'boolean':
                jsonStr += item;
            break;

            case 'object':
                jsonStr += toJsonString({
                    object: item,
                    tabSize: tabSize,
                    limitPerLine: limitPerLine,
                    depth: depth + 1
                });
            break;
        }

        if (index !== values.length - 1) {
            jsonStr += ', ';
        }

        if (hasObject || values.length > limitPerLine) {
            jsonStr += '\n';
        }
    });

    if (hasObject || values.length > limitPerLine) {
        for (var i = 0; i < (depth - 1) * tabSize; i++) {
            jsonStr += ' ';
        }
    }

    jsonStr += endChar;

    return jsonStr;
}

rl.on('line', function(input) {
    try {
        var parsedObject = parser.parse(input);
        displayCounts(parsedObject);

        var jsonStr = toJsonString({
            object: parsedObject,
            tabSize: 4
        });

        console.log(jsonStr);
    } catch(exception) {
        console.log(exception);
        console.log(exception.message);
    }

    rl.close();
});
