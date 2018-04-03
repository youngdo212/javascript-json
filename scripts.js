var text = `[1,2,[[11,[112233,"aaa",[23424,[444,[23243]]]],112],55, 99], 33]`;

var res = [];

function initial(val) {
  var cursor = -1;
  var arr = [0];
  var obj = [];
  var stack = 0;
  var char;

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
    if (val.slice(arr[i], arr[i + 1])[0] !== ',') {
      obj.push(val.slice(arr[i], arr[i + 1]).trim());
    } else {
      obj.push(val.slice(arr[i], arr[i + 1]).substring(1).trim());
    }
  }
  
  res.push(obj);

  for (var i = 0; i < obj.length; i++) {
    if (obj[i][0] === '[') {
      initial(obj[i]);
    }
  }
  return res;
}


function parsing(val) {
  for (var i = 0; i < val.length; i++) {
    for (var j = 0; j < val[i].length; j++) {
      if (val[i][j][0] === '[') {
        val[i][j] = val[i + 1];
      }
    }
  }
  var answer = val[0]
  return JSON.stringify(answer, null, 4);
}

console.log(JSON.stringify((text)));