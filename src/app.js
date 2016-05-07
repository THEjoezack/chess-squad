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

// create a game client
$(function() {
    var chess = require('chess');
    var gc = chess.create(),
        domSquares = getDomSquares(),
        strategy = require('./chessAiStrategy'),
        scope = this;

    gc.allMoves = []; // not crazy about this...
    strategy.initialize(gc);
    
    scope.move = function() {
        gc = strategy.move();
        
        if(gc.isStalemate) {
            alert('Stalemate, every body loses');
            return;
        }
        
        if(gc.isRepetition) {
            alert('Too many repeats, giving up');
            return;
        }
        
        if(gc.isCheckmate) {
            alert('Check mate!');
            return;
        }
        
        drawBoard(domSquares, gc.game.board.squares);
        setTimeout(scope.move, 200);
    };
    scope.move();
});