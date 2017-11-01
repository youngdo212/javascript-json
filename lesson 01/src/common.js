var util = require('./utils');
var log = util.log;

var common = (function () {
  var messages = {
    waitInsert: function () {
      log('Please insert json data');
    },
  };

  return {
    messages
  };
})();

module.exports = common;