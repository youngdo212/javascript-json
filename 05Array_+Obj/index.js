var str = "['1a3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]";
//  var str = "[{a:'a'}, {b: [1,2,3]}, {c: 123}]"

const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value)

const _each = (list, iter) => {
    for(let i =0; i<list.length; i++){
        iter(list[i])
    }
    return list;
} 

const _map = mapper => list =>{

    const new_list = [];
    _each(list, function(val){
        new_list.push(mapper(val));
    })
    return new_list;
}

const _isArrayString = str => {
    str = str.trim();
    return str[0]==='[' && str[str.length-1] ===']'
}

const _isObjString = str => {
    str = str.trim();
    return str[0]==='{' && str[str.length-1] ==='}'
}

const isClosedString = (str, opener, closer = opener) => {
    str = str.trim();
    return str[0]=== opener && str[str.length-1] === closer
} 

const trimed = str => str.trim()
const removeFirstBrackets = str => str.slice(1,str.length-1)

const splitItem = str => {
    let item = '',
        close = 2;
    const len = str.length,
          itemList = [],
          leftBracket = '[',
          rightBracket = ']',
          leftCurly = '{',
          rightCurly = '}';

    for(let i=0; i<len; i++){
        if(str[i]===','&& close === 2){
            itemList.push(item)
            item = '';
        }
        else{
            if(str[i]===leftBracket | str[i]===leftCurly) close = close << 1;
            if(str[i]===rightBracket | str[i]===rightCurly) close = close >> 1;
            item+=str[i]
        }  
    }
    if(close !==2){
        item = {error: item}
    }
    itemList.push(item);
    console.log('itemList', itemList);
    return itemList;
}

// const stringSelectorKey = ['\'','\`','\"'];
const stringSelector = '\''

class identityObject {
    constructor(type, value, child){
        this.type = type;
        this.value = value;
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
   if(!isStringClosed(stringItem)) console.log('잘 못된 형태입니다', stringItem)
   if(stringItem.error){
        console.log('잘  못된 형태입니다', stringItem)
   } 
   else{
    if(stringItem[0] === stringSelector) return new identityObject('string', stringItem)
    stringItem = stringItem.trim();
    if(stringItem==='null') return new identityObject(null, stringItem)
    if(stringItem === 'true' || stringItem === 'false') return new identityObject('boolean', stringItem)
    if(!isNaN(stringItem)) return new identityObject('number', stringItem)
    console.log(stringItem, '는 알수 없는 타입입니다')
   }
}

const resultToObj = arr => {
    const leftBracket = '['
    const leftCurly = '{'
    const initialOne = { type: 'array',
    child: [] 
    }
    const result = arr.reduce((ac,c)=>{
        const childItem = c[0]===leftBracket ? 
        ArrayParser(c)
        : c[0]===leftCurly ? ObjParser(c) :detectType(c)
        ac.child.push(childItem)
        return ac;
    },initialOne)
    return result;
}
const resultToObjParser = arr => {
    const leftBracket = '['
    const leftCurly = '{'
    const initialOne = {type: 'object', }
    const result = arr.reduce((ac, c)=>{
        const divisor = c.indexOf(':')
        const key = c.slice(0,divisor).trim();
        const value = c.slice(divisor+1).trim() 
        ac.key = key;
        ac.value = value[0]===leftBracket ? ArrayParser(value)
        : value[0]===leftCurly ? ObjParser(value) :detectType(value) 
        return ac;
    }, initialOne)
    return result;
}
 
const splitKeyValue = objString => objString.split(':')


const ArrayParser = str => {
    if(!_isArrayString(str)) console.log('Oops Array String이 아닙니다')
    return pipe(trimed,removeFirstBrackets, splitItem, _map(trimed),resultToObj)(str)
}

const ObjParser = str => {
    if(!isClosedString(str, '{', '}')) console.log('Oops Obj String이 아닙니다')
    return pipe(trimed, removeFirstBrackets, splitItem, resultToObjParser)(str)
}
// _map(splitKeyValue)

const result = ArrayParser(str)
// console.log('result', result);
console.log(JSON.stringify(result, null, 2));




// const result = ArrayParser(str);
// console.log(JSON.stringify(result, null, 2));