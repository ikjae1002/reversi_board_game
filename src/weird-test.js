/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const expect = chai.expect; 
const rev = require('/reversi.js');

const board = rev.generateBoard(3, 3, " ");
console.log(rev.rowColToIndex(board, 1, 1), "WTF");
const i = rev.rowColToIndex(board, 1, 1);
const j = rev.rowColToIndex(board, 0, 2);
console.log(i,j);