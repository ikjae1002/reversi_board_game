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

function indexToRowCol(board,i){
    // Translates a single index in a one dimensional array representation of
    // a board to that cell's row and column. The board supplied can be used 
    // to determine the max column and row numbers. You can assume that the 
    // board is always square. Row and column numbers start at 0.
    const rowcol = new Object;
    const widthHeight = Math.sqrt(board.length);

    const row = Math.floor(i/widthHeight);
    const col = i - (row*widthHeight);

    rowcol["row"] = row;
    rowcol["col"] = col;
    //console.log(row,col);

    return rowcol;
}

function setBoardCell(board, letter, row, col){
    // Set the value of the cell at the specified row and column numbers on the
    // board to the value, letter without mutating the original board passed in
    const newBoard = [...board];
    const ind = rowColToIndex(board, row, col);
    newBoard[ind] = letter;

    return newBoard;
}

//module exports

module.exports = {
    repeat: repeat,
    generateBoard: generateBoard    
}

const board = generateBoard(3,3);
const out = setBoardCell(board, 'x', 1, 1);
console.log(out);