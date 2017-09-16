// reversi.js

function repeat(ele, n){
    //implementation
    let i;
    const arr = new Array;
    for(i = 0; i < n; i++){
        //console.log(arr);
        arr.push(ele);
    }
    
    return arr;
}

function generateBoard(rows, cols, initialValue){
    //implementation
}


//module exports

module.exports = {
    repeat: repeat,
    generateBoard: generateBoard    
}

const arr = repeat(4,5);
console.log(arr);