var str = "[123, 22, 33]";

const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value)

const splited = (str, selector = ',')  => str.split(selector); 

const flatened = array => array.reduce((ac, cr)=> {
    return ac.concat(cr)
})

const trimed = str => str.trim()

const removeBracket = str => {
    const len = str.length;
    const first = str[0]
    const last = str[len-1] 
    const hasBracketFirst = first ==='[' 
    const hasBracketLast = last === ']'
    if(hasBracketFirst ^ hasBracketLast){
       if(hasBracketFirst) return str.slice(1)
       else return str.slice(0,-1)
    }
    return str; 
}

const _map = fn =>arr=> {
    const mappingArr = []
    for(let i=0; i<arr.length; i++){
        mappingArr.push(fn(arr[i]));
    }
    return mappingArr
}

const isArrayString = str => {
    const len = str.length;
    const first = str[0]
    const last = str[len-1] 
    const hasBracketFirst = first ==='[' 
    const hasBracketLast = last === ']'
    return hasBracketFirst & hasBracketLast
}

const resultToObj = arr => {
    if(!Array.isArray(arr)) console.log('배열이 아닌 자료형입니다')
    const result = {type: 'array'}
    if(!arr.length) console.log('배열 아이템이 존재하지 않습니다')
    result.child = []
    arr.reduce((ac,cr)=>{
        const objItem = {type: "number", value: cr, child: []}
        if(isArrayString(cr)) ac.push({})
        ac.push(objItem)
        return ac;
    }, result.child)
    return result;
}


const ArrayParser = str => {
    return pipe(splited, _map(trimed), _map(removeBracket),resultToObj)(str)
}
var result = ArrayParser(str);
console.log('result', result);








// const ArrayParser2 = str => {
//     return pipe(splited, (arr)=>_map(arr, trimed), (arr)=>_map(arr,removeBracket))(str)
// }
// var result2 = ArrayParser2(str2);
// console.log('result2', result2);

// // 파이프 -> 트림 -> 

// // console.log(JSON.stringify(result, null, 2));  


// var exmpleAnswer = { type: 'array',
// child: 
//  [ { type: 'number', value: '123', child: [] },
//    { type: 'number', value: '22', child: [] },
//    { type: 'number', value: '33', child: [] } 
//   ] 
// }