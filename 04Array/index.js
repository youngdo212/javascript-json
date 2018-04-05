// var str = "['1a3','1a'3',[[null,false,['11',[112233],112],55, '99'],33, 3d3, true]";

var str = "['1a3','1a'3',[[null,,55, '99'],33, 3d3, true]";

const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value)

const _map = fn =>arr=> {
    const mappingArr = []
    for(let i=0; i<arr.length; i++){
        mappingArr.push(fn(arr[i]));
    }
    return mappingArr
}

const _isArrayString = str => {
    str = str.trim();
    return str[0]==='[' && str[str.length-1] ===']'
}

const trimed = str => str.trim()

const removeFirstBrackets = str => str.slice(1,str.length-1)

//split Item이 잘 못 된 경우 ?.? 


const splitArrItem = str => {
    let item = '',
        close = 2;
    const len = str.length,
          itemList = [],
          left = '[',
          right = ']';

    for(let i=0; i<len; i++){
        if(str[i]===' ') continue;
        if(str[i]===','&& close === 2){
            itemList.push(item)
            item = '';
        }
        else{
            if(str[i]===left) close = close << 1;
            if(str[i]===right) close = close >> 1;
            item+=str[i]
        }  
    }
    if(close !==2){
        item = {error: item}
    }
    itemList.push(item);
    // console.log('itemList', itemList);
    return itemList;
}

// const stringSelectorKey = ['\'','\`','\"'];
const stringSelector = '\''

class identityObject {
    constructor(type, value, child=[]){
        this.type = type;
        this.value = value ;
        this.child = child;
    }
}

//'1a'3'은 올바른 문자열이 아닙니다.

const isStringClosed = (str) => {
    let identifier = stringSelector;
    let close = true;
    for(let i=0; i<str.length; i++){
          if(str[i]===identifier){
              close = !close
          } 
    }
    return close;
}

const detectType = stringItem => {
   const lastIdx = stringItem.length-1
   console.log('stringItem', stringItem);
   if(!isStringClosed(stringItem)) console.log('잘 못된 형태입니다', stringItem)
   else{
    if(stringItem[0]=== stringSelector) return new identityObject('string', stringItem)
    if(stringItem==='null') return new identityObject(null, stringItem)
    if(stringItem === 'true' | stringItem === 'false') return new identityObject('boolean', stringItem)
    if(!isNaN(stringItem)) return new identityObject('number', stringItem)
    console.log(stringItem, '는 알수 없는 타입입니다')
   }
}


const resultToObj = arr => {
    const left = '['
    const initialOne = { type: 'array',
    child: [] 
    }

    const result = arr.reduce((ac,c)=>{
        const childItem = c[0]===left ? 
        ArrayParser(c)
        :
        detectType(c)
        ac.child.push(childItem)
        return ac;
    },initialOne)
    return result;
}



const ArrayParser = str => {
    if(!_isArrayString(str)) console.log('Oops Array String이 아닙니다')
    return pipe(trimed,removeFirstBrackets, splitArrItem, resultToObj )(str)
}

const result = ArrayParser(str);
console.log(JSON.stringify(result, null, 2));