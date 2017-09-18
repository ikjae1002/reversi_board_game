// reversi.js

const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
'P','Q','R','S','T','U','V','W','X','Y','Z'];

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

function algebraicToRowCol(algebraicNotation){
    // Translates algebraic notation specifying a cell into a row and column
    // specifiying the same cell. If the notation passed in is not valid,
    // then return undefined.
    let i;
    if(algebraicNotation.length >= 2){
        let goodtogo = false;
        const exp = /[A-Z]/gi;
        const col = algebraicNotation.match(exp);
        if (alpha.includes(col[0])){
            goodtogo = true;
        }
        algebraicNotation = algebraicNotation.substr(1);
        if(isNaN(algebraicNotation) || algebraicNotation > 26){
            goodtogo = false;
        }const row = algebraicNotation -1;
        if(goodtogo){
            let column;
            for(i = 0; i<alpha.length; i++){
                if(col[0] === alpha[i]){
                    column = i;
                }
            }
            const obj = {'row': row, 'col': column};

            return obj;
        }
    }
}

function placeLetters(board, letter, ...algebraicNotation){
    // Translates one or more moves in algebraic notation to row and column...
    // and uses the row and column to set the letter specified on the board.

    let i;
    let j;
    for(i = 0; i < algebraicNotation.length; i++){
        const ob = algebraicToRowCol(algebraicNotation[i]);
        const copy = setBoardCell(board, letter, ob['row'], ob['col']);
        for(j = 0; j < copy.length; j++){
            if(letter === copy[j]){
                board[j] = letter;
            }
        }
    }

    return board;
}

function boardToString(board){
    // creates a text drawing representation of the board passed in. The
    // board should have:
    //  - boarders between each cell
    //  - the contents of each cell
    //  - labels on the rows and columns
    const widthHeight = Math.sqrt(board.length);
    let hor = "  +";
    for(let i = 0; i < widthHeight; i++){
        hor += "---+";
    }
    let col = "    ";
    for(let i = 0; i < widthHeight; i++){
        col += alpha[i];
        col += "   ";
    }//console.log(col);
    // console.log(hor);
    let outstr = col; outstr += "\n" + hor;
    for(let i = 0; i < widthHeight; i++){
        let ver = i+1; ver += " | ";
        for(let j = 0; j < widthHeight; j++){
            const ind = rowColToIndex(board, i, j);
            ver += board[ind]; ver += " | ";
        }outstr += "\n" + ver + "\n" + hor;
    }

    return outstr;
}

function isBoardFull(board){
    // Examines the board passed in to determine whether or not it's full.
    // it returns true if there are no empty squares, false if there are 
    // still squares available. Assume that the board uses the space
    // character , " ", to mark a square as empty"

    return !board.includes(" ");
}

function flip(board, row, col){
    // Using the board passed in, flip the piece at the specified row and 
    // col so that it is the opposite color by changing X to O or O to X.
    // If no letter is present, do not change the contents of the cell.

    const ind = rowColToIndex(board, row, col);
    if(board[ind] != " "){
        if(board[ind] === "X"){
            board[ind] = "O";
        }else{
            board[ind] = "X";
        }
    }
    
    return board;
}

function flipCells(board, cellsToFlip){
    // Using the board passed in, flip the pieces in the cells specified 
    // by cellsToFlip
    
    for(let i = 0; i < cellsToFlip.length; i++){
        for(let j = 0; j < cellsToFlip[i].length; j++){
            board = flip(board, cellsToFlip[i][j][0], cellsToFlip[i][j][1]);
        }
    }

    return board;
}

function getCellsToFlip(board, lastRow, lastCol){
    // Using the board passed in determine which cells contain pieces to
    // flip based on the last move. For example, if the last move was the
    // x played at D3, then all of the O's on the board would be flipped
    //    A   B   C   D
    //  +---+---+---+---+
    //1 |   |   |   | X |
    //  +---+---+---+---+
    //2 |   |   |   | O |
    //  +---+---+---+---+
    //3 | X | O | O | X |
    //  +---+---+---+---+
    //4 |   |   |   |   |
    //  +---+---+---+---+

    const widthHeight = Math.sqrt(board.length);
    const myletter = board[rowColToIndex(board, lastRow, lastCol)];

    let potential = new Array();
    const change = new Array;
    
    //check right
    for(let i = lastCol + 1; i< widthHeight && board[rowColToIndex(board,lastRow,i)] !==" "; i++){
        const next = rowColToIndex(board, lastRow, i);
        console.log("right: ", lastRow, i);
        if(board[next] !== myletter && board[next] !== " "){
            potential.push([lastRow,i]);
        }else if(board[next] === myletter){
            console.log("good");
            change.push(potential);
        }
    }potential = new Array();

    //check righttop
    let j = lastRow - 1
    for(let i = lastCol + 1; i < widthHeight && j >= 0 && board[rowColToIndex(board,j,i)] !==" "; i++, j--){
        const next = rowColToIndex(board, j, i);
        console.log("righttop: ", j, i);
        if(board[next] !== myletter && board[next] !== " "){
            potential.push([j,i]);
        }else if(board[next] === myletter){
            console.log("good");
            change.push(potential);
        }
    }potential = new Array();

    //check top
    for(let i = lastRow - 1; i >= 0 && board[rowColToIndex(board,i, lastCol)] !==" "; i--){
        const next = rowColToIndex(board, i, lastCol);
        console.log("top: ",i,lastCol);
        if(board[next] !== myletter && board[next] !== " "){
            potential.push([i,lastCol]);
        }else if(board[next] === myletter){
            console.log("good");
            change.push(potential);
        }
    }potential = new Array();

    // check lefttop
     j = lastCol - 1;
    for(let i = lastRow - 1; i >=0 && j >=0 && board[rowColToIndex(board,i,j)] !==" "; i--, j--){
        const next = rowColToIndex(board, i, j);
        console.log("lefttop: ",i,j);
        if(board[next] !== myletter && board[next] !== " "){
            potential.push([i,j]);
        }else if(board[next] === myletter){
            console.log("good");
            change.push(potential);
        }
    }potential = new Array();

    // check left
    for(let i = lastCol - 1; i >= 0 && board[rowColToIndex(board,lastRow,i)] !==" "; i--){
        const next = rowColToIndex(board, lastRow, i);
        console.log("left: ",lastRow,i);
        if(board[next] !== myletter && board[next] !== " "){
            potential.push([lastRow,i]);
        }else if(board[next] === myletter){
            console.log("good");
            change.push(potential);
        }
    }potential = new Array();

    // check leftbottom
    j = lastCol - 1;
    for(let i = lastRow + 1; i < widthHeight && j >=0 && board[rowColToIndex(board,i,j)] !==" "; i++, j--){
        const next = rowColToIndex(board, i, j);
        console.log("leftbottom: ",i,j);
        if(board[next] !== myletter && board[next] !== " "){
            potential.push([i,j]);
        }else if(board[next] === myletter){
            console.log("good");
            change.push(potential);
        }
    }potential = new Array();

    // check bottom
    for(let i = lastRow + 1; i < widthHeight && board[rowColToIndex(board,i, lastCol)] !==" "; i++){
        const next = rowColToIndex(board, i, lastCol);
        console.log("bottom: ",i,lastCol);
        if(board[next] !== myletter && board[next] !== " "){
            potential.push([i,lastCol]);
        }else if(board[next] === myletter){
            console.log("good");
            change.push(potential);
        }
    }potential = new Array();

    // check rightbottom
    j = lastRow + 1
    for(let i = lastCol + 1; i < widthHeight && j < widthHeight && board[rowColToIndex(board,j,i)] !==" "; i++, j++){
        const next = rowColToIndex(board, j, i);
        console.log("rightbottom: ",j,i);
        if(board[next] !== myletter && board[next] !== " "){
            potential.push([j,i]);
        }else if(board[next] === myletter){
            console.log("good");
            change.push(potential);
        }
    }potential = new Array();

    return change;
}

function isValidMove(board, letter, row, col){
    // Using the board passed in, determines whether or not a move with
    // letter to row and col is valid.

    const widthHeight = Math.sqrt(board.length);
    if(row >= widthHeight || col >= widthHeight || row < 0 || col < 0){
        return false;
    }else{
        const ind = rowColToIndex(board,row,col);
        if(board[ind] !== " "){
            return false;
        }else{
            let newboard = [...board];
            const str = alpha[col] + (row+1);
            newboard = placeLetters(newboard, letter, str);
            const result = getCellsToFlip(newboard,row,col);
            console.log(result[0][0]);
            if(result[0][0] === undefined){
                return false;
            }else{
                return true;
            }
        }
    }
}

//module exports

module.exports = {
    repeat: repeat,
    generateBoard: generateBoard    
}


let board = generateBoard(8,8, " ");
//const out = setBoardCell(board, 'x', 1, 1);
//const out = algebraicToRowCol("A6");
board = placeLetters(board, 'O', 'C3', 'D3', 'E3','F2','C4','E4','F4','C5','D5','E5');
board = placeLetters(board, 'X', 'B2', 'D2', 'G1','B4','G4','B6','D6','F6','D4');
//const outb = flipCells(outa, [[[0,0], [0,1]],[[1,1]]]);
//const outb = flip(outa, 2, 0);
//const outb = getCellsToFlip(board, 3, 3);
//const outa = flipCells(board,outb);
//const out = boardToString(outa);
//const outa = isBoardFull(outb);
const out = isValidMove(board,"X",0,5);
console.log(out);