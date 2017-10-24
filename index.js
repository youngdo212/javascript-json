var readline = require('readline');
var parser = require('./parser');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function(input) {
    var result = parser.parse(input);
    console.log(result);
});
