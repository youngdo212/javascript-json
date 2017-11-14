"use strict";

var readline = require('./config/readline')();
var messages = require('./src/messages');
var parser = require('./src/jsonParser');
var reader = require('./src/jsonReader');


(function () {
  messages.waitInsert();
  readline.prompt();

  readline.on('line', function (insert) {
    var parsedData;
    var readData;

    try {
      parsedData = parser.parse(insert);
      readData = reader(parsedData);
      messages.jsonCount(readData.count);
      messages.jsonData(readData.data);
    }
    catch (error) {
      messages.error(error);
    }

    messages.waitInsert();
    readline.prompt();
  });
})();