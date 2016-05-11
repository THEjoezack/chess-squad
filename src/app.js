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

var showSiteStatus = function(message) {
    $('#site-status-message .status-message').html(message);
    $('#site-status-message').removeClass('hidden');
}

// create a game client
$(function() {
    var chess = require('chess');
    var gc = chess.create(),
        domSquares = getDomSquares(),
        strategy = require('./strategies/chessAiStrategy'),
        scope = this;

    strategy.initialize(gc);
    
    scope.move = function() {
        var lastMove = strategy.move();
        
        if(gc.isStalemate) {
            showSiteStatus('Stalemate, every body loses');
            return;
        }
        
        if(gc.isRepetition) {
            showSiteStatus('Too many repeats, giving up');
            return;
        }
        
        if(gc.isCheckmate) {
            showSiteStatus('Check mate!');
            return;
        }
        
        drawBoard(domSquares, gc.game.board.squares);
        setTimeout(scope.move, 50);
    };
    scope.move();
});