var str = "[12,[3],[[2],[2],[33]],8,10,[1,2,3,4,5]]";

const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value)



const _map = fn =>arr=> {
    const mappingArr = []
    for(let i=0; i<arr.length; i++){
        mappingArr.push(fn(arr[i]));
    }
    return mappingArr
}

const trimed = str => str.trim()

const removeFirstBrackets = str=> str.slice(1,str.length-1)

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
    itemList.push(item);
    console.log('itemList', itemList);
    return itemList;
}

// { type: 'array', value: ArrayObject, child: [{type:'number', value:22, child:[]}] }



const resultToObj = arr => {
    const left = '['
    const initialOne = { type: 'array',
    child: [] 
    }

    const result = arr.reduce((ac,c)=>{
        const childItem = c[0]===left ? 
        { type: 'array', value: 'ArrayObject', 
           child: [{type:'number', value: c.slice(1,c.length-1), child:[]}]
        } 
        :
        { type: 'number', value: c, child:[]};
        ac.child.push(childItem)
        return ac;
    },initialOne)
    return result;
}



const ArrayParser = str => {
    return pipe(trimed,removeFirstBrackets, splitArrItem,resultToObj)(str)
}

const result = ArrayParser(str);
console.log('result', result);
