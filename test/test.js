exports.test = function(testMessage, testFunction){
  const result = testFunction();
  console.log(`${testMessage} : ${result}`);
};