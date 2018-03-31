var input = `[1,2,[1,2,[],3],3]`;
var data = `[{value: 1}, {value: 2}, {value: [{value: 1}, {value: 2}, {}, {value: 3}]}, {value:3}]`
var char;
var stack = 0;
var res = [];

function myParse(val) {
  var cursor = -1;
  var arr = [0];
  var obj = [];
  val = val.trim();

  if (val[0] === '[' && val[val.length - 1] === ']') {
    val = val.substring(1, val.length - 1).trim();
  }
  while (++cursor < val.length) {
    char = val[cursor];
    switch (char) {
      case '[':
        stack++;
        continue;
      case ']':
        stack--;
        continue;
      case ',':
        if (stack !== 0) {
          break;
        } else if (stack === 0) {
          arr.push(cursor);
        }
        continue;
    }
  }

  for (var i = 0; i < arr.length; i++) {
    debugger;
    if (val.slice(arr[i], arr[i + 1])[0] !== ',') {
      obj.push(val.slice(arr[i], arr[i + 1]).trim());
    } else {
      obj.push(val.slice(arr[i], arr[i + 1]).substring(1).trim());
    }
  }

  res.push(obj);
  for (var i = 0; i < obj.length; i++) {
    if (obj[i][0] === '[') {
      myParse(obj[i]);
    }
  }
  return res
}



function secondParse(val) {
  for (var i = 0; i < val.length; i++) {
    for (var j = 0; j < val[i].length; j++) {
      if (val[i][j][0] === '[') {
        val[i][j] = val[i + 1];
      }
    }
  }
  var answer = val[0]
  return answer;
}


console.log(secondParse(myParse(input)));