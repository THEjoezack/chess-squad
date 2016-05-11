require('expose?$!expose?jQuery!jquery');

var pieceTemplate = require('./templates/piece.hbs');
var logEntry = require('./templates/logEntry.hbs');

var getSquaresElements = function() {
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
    showStatus: function(gc) {
        if(gc.isStalemate) {
            var message = 'Stalemate, everybody loses';
        }
        else if(gc.isRepetition) {
            var message = 'Too many repeats, giving up';
        }
        else if(gc.isCheckmate) {
            var message = 'Checkmate! ' + gc.currentPlayer.name + ' wins.';
        } else {
            var message = 'Game over, but I don\'t know why'; // This should never happen
        }
        
        $('#check-alert-message').addClass('hidden');
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
        var alertType = status === 'check' ? 'warning' : 'info';
        var lastMove = gameContext.game.moveHistory[gameContext.game.moveHistory.length - 1];

        var html = logEntry({
            player: gameContext.currentPlayer.name,
            color: gameContext.currentPlayer.color,
            type: lastMove.piece.type, 
            move: lastMove.algebraic,
            status: status,
            alertType: alertType
        });
        $('#game-log').append(html);
    },
    drawBoard : function(boardSquares) {
        var squareElements = this.squareElements || getSquaresElements();
        this.squareElements = squareElements;
        var pieceMap = {};
        for(var i = 0; i < squareElements.length; i++) {
            var model = boardSquares[i];
            var piece = model.piece;
            if(piece) {
                var html = pieceTemplate({ color: piece.side.name, type: piece.type });
                squareElements[i].html(html);
            } else {
                squareElements[i].html('&nbsp;');
            }
        }
    }
};

