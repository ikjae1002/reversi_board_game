// reversi.js

function repeat(ele, n){
    // repeat creates an array that contains value as each element
    // for n elements.
    let i;
    const arr = new Array;
    for(i = 0; i < n; i++){
        //console.log(arr);
        arr.push(ele);
    }

    return arr;
}

function generateBoard(rows, cols, initialValue = " "){
    // creates a single dimensional array representation
    // of elements that would be in a rows x columns board
    // with each cell containing the initial value
    const mul = rows * cols;
    const board = repeat(initialValue, mul);
    
    return board;
}

function rowColToIndex(board, rowNumber, columnNumber){
    // A cell in a Reversi board can be specified by a row number and
    // column number. However, our board implementation uses one dimensional
    // array, so a cell must be specified by a single index. This function
    // translates a row and a column into an index in the one dimensional 
    // array representation of a Reversi board
    const widthHeight = Math.sqrt(board.length);
    const ind = (rowNumber * widthHeight) + columnNumber;

    return ind;
}

//module exports

module.exports = {
    repeat: repeat,
    generateBoard: generateBoard    
}

const board = generateBoard(4,4);
const out = rowColToIndex(board,2,3);
console.log(out);