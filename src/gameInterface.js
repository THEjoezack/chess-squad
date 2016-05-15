require('expose?$!expose?jQuery!jquery');

var pieceTemplate = require('./templates/piece.hbs');

module.exports = {
    initialize: function() {
        var elements = [];
        var map = {};
        var rowNumbers = [8,7,6,5,4,3,2,1];
        var columnLetters = ['a','b','c','d','e','f','g','h'];
        
        var rows = $('.table.board').children('tbody').children('tr');
        for(var rowNumber = rows.length; rowNumber >= 0; rowNumber--) {
            var row = $(rows[rowNumber])[0];
            var td = $(row).children('td');
            for(var tdNumber = 0; tdNumber < td.length; tdNumber++) {
                elements.push($(td[tdNumber]));
                var index = columnLetters[tdNumber] + rowNumbers[rowNumber];
                map[index] = $(td[tdNumber]);
            }
        }
        this.squareElements = elements;
        this.squareMap = map;
    },
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
    drawBoard : function(boardSquares) {
        var pieceMap = {};
        for(var i = 0; i < this.squareElements.length; i++) {
            var model = boardSquares[i];
            var piece = model.piece;
            if(piece) {
                var html = pieceTemplate({ color: piece.side.name, type: piece.type });
                this.squareElements[i].html(html);
            } else {
                this.squareElements[i].html('&nbsp;');
            }
        }
    },
    getSquare: function(alphaNumericSpace) {
        return this.squareMap[alphaNumericSpace];
    }
};

