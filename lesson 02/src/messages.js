var util = require('./utils');
var log = util.log;

var messages = {
  waitInsert: function () {
    log('Please insert json data');
  },
  jsonData: function (count) {
    log(count);
  },
  jsonCount: function (count) {
    log(count);
  },
  error: function (errorMassage) {
    log(errorMassage);
  },
};

module.exports = messages;