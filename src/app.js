require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('./css/chess-squad.css');

var init = function(){
    var pieces = {
        black: {
            '8': ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'],
            '7': ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn']
        },
        white: {
            '1': ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'],
            '2': ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn']
        }
    };

    function getHtml(color, type) {
        return '<span href="#" data-toggle="tooltip" class="' + color + ' piece ' + type + '" title="' + color + ' ' + type + '"></span>';
    }
    
    var maxRows = 8;
    var rows = $('.table.board').children('tbody').children('tr');
    for(var color in pieces) {
        if (pieces.hasOwnProperty(color)) {
            for(var rowNumber in pieces[color]) {
                if (pieces[color].hasOwnProperty(rowNumber)) {
                    console.log('Row: ' + rowNumber);
                    var columnNumber = 0;
                    for(var piece in pieces[color][rowNumber]) {
                        if (pieces[color][rowNumber].hasOwnProperty(piece)) {
                            var row = $($(rows)[maxRows - rowNumber])[0];
                            var column = $($(row).children('td')[columnNumber])[0];
                            
                            var html = getHtml(color, pieces[color][rowNumber][piece]);
                            $(column).html(html);
                            
                            columnNumber += 1;
                        }
                    }
                }
            }
        }
    }
};

$(function() {
    init();
});