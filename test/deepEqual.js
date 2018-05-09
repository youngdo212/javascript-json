exports.deepEqual = function(a,b){
  if(isObject(a,b)){
    if(!hasSameProperty(a,b)) return false;
    for(let property in a){
      if(!deepEqual(a[property], b[property])) return false;
    }
    return true;
  }
  return a === b;
}

function isObject(...values){
  return values.every(value => typeof value === 'object' && value !== null);
}

function hasSameProperty(a,b){
  if(Object.keys(a).length !== Object.keys(b).length) return false;
  for(let property in a){
    if(!b.hasOwnProperty(property)) return false;
  }
  return true;
}