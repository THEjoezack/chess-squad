require('expose?$!expose?jQuery!jquery');

var pieceTemplate = require('./templates/piece.hbs');
var logEntry = require('./templates/logEntry.hbs');

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

module.exports = {
    showStatus: function(message) {
        $('#site-status-message .status-message').html(message);
        $('#site-status-message').removeClass('hidden');
    },
    showCheckAlert: function(gc) {
        if(gc.isCheck) {
            $('#check-alert-message .status-message').html(gc.offPlayer.name + ' is in check!');
            $('#check-alert-message').removeClass('hidden');
            this.check = true;
        } else if(this.check) {
            $('#check-alert-message').addClass('hidden');
            this.check = false;
        }
    },
    updateLog: function(gameContext) {
        var status = '';
        status = gameContext.isCheck ? 'check' : status;
        status = gameContext.isStalemate ? 'stalemate' : status;
        status = gameContext.isRepetition ? 'repetition' : status;
        status = gameContext.isCheckmate ? 'checkmate' : status;
        var warning = status === 'check' ? 'warning' : 'info';
        var lastMove = gameContext.game.moveHistory[gameContext.game.moveHistory.length - 1];

        var html = logEntry({
            player: gameContext.currentPlayer.name,
            color: gameContext.currentPlayer.color,
            type: lastMove.piece.type, 
            move: lastMove.algebraic,
            status: status,
            alertType: 'warning'
        });
        $('#game-log').append(html);
    },
    drawBoard : function(boardSquares) {
        var squareElements = getDomSquares();
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
    }
};

