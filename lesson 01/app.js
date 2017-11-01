"use strict";

var readline = require('./config/readline')();
var common = require('./src/common');
var parser = require('./src/jsonParser');


(function () {
  common.messages.waitInsert();
  readline.prompt();

  readline.on('line', function (insert) {
    var dataCount = parser.parse(insert);
    console.log(dataCount);
    // common.messages.jsonCount(dataCount);
    common.messages.waitInsert();
    readline.prompt();
  });
})();