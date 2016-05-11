require('expose?$!expose?jQuery!jquery');

var pieceTemplate = require('./templates/piece.hbs');

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
    showCheckAlert: function(checkPlayer) {
        $('#check-alert-message .status-message').html(checkPlayer + " is in check!");
        $('#check-alert-message').removeClass('hidden');
    },
    hideCheckAlert: function() {
        $('#check-alert-message').addClass('hidden');
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

