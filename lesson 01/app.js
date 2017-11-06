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

    try {
      parsedData = parser.parseJson(insert);
      // dataCount = reader.countType(parsedData);
      // common.messages.jsonCount(dataCount);
      console.log(parsedData);
    }
    catch (error) {
      console.log(error);
    }

    common.messages.waitInsert();
    readline.prompt();
  });
})();