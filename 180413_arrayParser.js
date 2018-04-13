function ArrayParser(str){
  let result = {}
  for(let i = 0; i < str.length; i++){
    if('1234567890'.indexOf(str[i]) !== -1){
      result.type = 'number';
      result.value = result.value ? result.value + str[i] : str[i];
      result.child = [];
    }
    else if('[]'.indexOf(str[i]) !== -1){
      result.type = 'array';
      result.child = str.slice(1, str.length-1).split(',')
      .reduce((acc, curr) => [...acc, ArrayParser(curr.trim())], []);
      break;
    }
  }
  return result;
}

let s1 = '[12, 14, 15]';
console.log(ArrayParser(s1));
/*
{type: 'array',
child: 
 [ { type: 'number', value: '12', child: [] },
   { type: 'number', value: '14', child: [] },
   { type: 'number', value: '15', child: [] } ] }
*/