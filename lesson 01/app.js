"use strict";

var readline = require('./config/readline')();
var common = require('./src/common');
var parser = require('./src/jsonParser');
var reader = require('./src/jsonReader');


(function () {
  common.messages.waitInsert();
  readline.prompt();

  readline.on('line', function (insert) {
    var parsedData;
    var dataCount;

    parsedData = parser.parseJson(insert);
    dataCount = reader.countType(parsedData);
    common.messages.jsonCount(dataCount);

    common.messages.waitInsert();
    readline.prompt();
  });
})();