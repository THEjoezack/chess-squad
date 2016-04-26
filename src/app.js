require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('./css/chess-squad.css');

var getDomSquares = function() {
    var elements = [];
    var rows = $('.table.board').children('tbody').children('tr');
    for(var rowNumber = rows.length; rowNumber >= 0; rowNumber--) {
        var row = $(rows[rowNumber])[0];
        var td = $(row).children('td');
        for(var tdNumber = 0; tdNumber < td.length; tdNumber++) {
            elements.push($(td[tdNumber]));
       }
    }
    return elements;
};

var pieceTemplate = require('./templates/piece.hbs');
var drawBoard = function(squareElements, boardSquares) {
    var pieceMap = {};
    for(var i = 0; i < squareElements.length; i++) {
        var model = boardSquares[i];
        var piece = model.piece;
        if(piece) {
            var html = pieceTemplate({ color: model.piece.side.name, type: model.piece.type });
            squareElements[i].html(html);
        } else {
            squareElements[i].html('');
        }
    }
};

var getRandomArbitrary = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var makeRandomMove = function(gc, domSquares) {
    var moves = Object.keys(gc.notatedMoves);
    if(moves.length == 0) {
        debugger;
        return;
    }
    var index = getRandomArbitrary(0, moves.length);
    var move = moves[index];

    gc.move(move);
    console.log(move);
    drawBoard(domSquares, gc.game.board.squares);
    console.log(gc);
    
    // bad algorithm, but temporary
    setTimeout(function() { result = makeRandomMove(gc, domSquares) }, 100);
};

// create a game client
$(function() {
    var chess = require('chess');
    var gc = chess.create(),
        m = null,
        status = null;
    var domSquares = getDomSquares(); 
    makeRandomMove(gc, domSquares);
});