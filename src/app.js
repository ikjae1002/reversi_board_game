// app.js
// you can name the object whatever you like
// "rev" is used below...
const rev = require('./reversi.js');
const fs = require('fs');

const readlineSync = require('readline-sync');

console.log(process.argv[2]);

fs.readFile(process.argv[2], 'utf8', function(err, data) {
    console.log("inside readfile");
    if (err) {
        console.log('uh oh', err); 
    } else {
        console.log("printing data file");
        console.log(data);
    }
    console.log(data);
});

const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
'P','Q','R','S','T','U','V','W','X','Y','Z'];

let answer = readlineSync.question('How wide should the board be? (even numbers between 4 and 26, inclusive): ');
console.log(answer);
while(isNaN(answer) || answer <4 || answer > 26){
    answer = readlineSync.question('How wide should the board be? (even numbers between 4 and 26, inclusive): ');
    console.log(answer);
}
let board = rev.generateBoard(answer,answer, " ");
//console.log(rev.boardToString(board));

let alg1 = alpha[Math.floor(answer/2) -1];
let alg2 = alpha[Math.floor(answer/2)-1]; alg1 += Math.floor(answer/2); alg2 += (Math.floor(answer/2) +1);
let alg3 = alpha[Math.floor(answer/2)];
let alg4 = alpha[Math.floor(answer/2)];
alg3 += Math.floor(answer/2); alg4 += (Math.floor(answer/2) + 1);
//console.log(alg1,alg2,alg3,alg4);
board = rev.placeLetters(board,"O",alg1,alg4);
board = rev.placeLetters(board,"X",alg2,alg3);


console.log(rev.boardToString(board));
let answer2 = readlineSync.question('\nPick your letter: X (black) or O (white): ');
console.log(answer2);
while(answer2 !== 'X' && answer2 !== 'O'){
    answer2 = readlineSync.question('\nPick your letter: X (black) or O (white): ');
    console.log(answer2);
}
console.log("\nPlayer is: " + answer2);
const playerletter = answer2;

console.log(rev.boardToString(board));

function scores(board){
    const result = rev.getLetterCounts(board);
    console.log("\nScore");
    console.log("=====");
    console.log("X: ",result['X']);
    console.log("O: ",result['O']);
}

let passes = 0;
let playerTurn;
let completter;
if(playerletter === "X"){
    playerTurn = true;
    completter = "O";
}else{
    playerTurn = false;
    completter = "X";
}
//while(rev.getValidMoves(board, "X")[0] !== undefined || rev.getValidMoves(board, "O")[0] !== undefined)
while(passes < 4 && !rev.isBoardFull(board)){
    if(playerTurn){
        console.log("\nPlayer's turn");
        console.log(rev.getValidMoves(board, playerletter));
        console.log(rev.getValidMoves(board, playerletter)[0]);
        if(rev.getValidMoves(board, playerletter)[0] === undefined){
            readlineSync.question("\nPlayer has no valid moves. Press <ENTER> to continue");
            passes += 1;
            playerTurn = false;
        }else{
            passes = 0;
            let moves = readlineSync.question('\nWhat is your move?: \n');
            while(!rev.isValidMoveAlgebraicNotation(board, playerletter, moves)){
                console.log("\n\nINVALID MOVE. Your move shoud:");
                console.log("* be in a format");
                console.log("* specify an existing empty cell");
                console.log("* flip at least one of your opponent's pieces\n");

                moves = readlineSync.question('\nWhat is your move?: \n');
            }
            board = rev.placeLetters(board, playerletter, moves);
            const obj = rev.algebraicToRowCol(moves);
            const flipping = rev.getCellsToFlip(board,obj['row'],obj['col']);
            board = rev.flipCells(board, flipping);
            console.log(rev.boardToString(board));
            scores(board);
            playerTurn = false;
        }
    }else{
        console.log("\nComputer's turn");
        if(rev.getValidMoves(board, completter)[0] === undefined){
            readlineSync.question("\nComputer has no valid moves. Press <ENTER> to continue");
            passes += 1;
            playerTurn = true;
        }else{
            passes = 0;
            const possible = rev.getValidMoves(board, completter);
            const ind = Math.floor(Math.random() * possible.length);
            const mov = alpha[possible[ind][1]] + (possible[ind][0] + 1);
            board = rev.placeLetters(board, completter, mov);
            const fl = rev.getCellsToFlip(board, possible[ind][0],possible[ind][1]);
            board = rev.flipCells(board, fl);
            readlineSync.question("\nIt's computer's turn! Press <ENTER> to show moves!");
            console.log(rev.boardToString(board));
            scores(board);
            playerTurn = true;  
        }
    }
}
