exports.test = function(testMessage, testFunction){
  console.log(`${testMessage} : `);
  testFunction();  
};