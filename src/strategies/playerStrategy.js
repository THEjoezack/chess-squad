require('expose?$!expose?jQuery!jquery');

var makeAlgebraicMove = function(source, destination, scope, next) {
    var result = '';
    for(var algebraicMove in scope.gameContext.notatedMoves) {
        var move = scope.gameContext.notatedMoves[algebraicMove];
        if(destination.rank === move.dest.rank && destination.file === move.dest.file) {
            if(source.rank === move.src.rank && source.file === move.src.file) {
                result = algebraicMove;
            }
        }
    }
    
    // if the source is a pawn
    // if the file is 1 or 8
    // offer the user a choice
    if(source.piece.type === 'pawn' && (destination.rank === 1 || destination.rank === 8)) {
        var modal = $('#pawn-promotion');
        modal.modal('show');
        modal.find('.btn-primary').on('click', function() {
            var selectedValue = modal.find('input[type=radio]:checked')[0].value;
            result = result.slice(0, result.length - 1) + selectedValue;
            modal.modal('hide');
            next(result);
        });
    } else {
        next(result);
    }
};

var clearAvailableMoves = function(allSquares) {
    allSquares.removeClass('valid-move');
    allSquares.removeClass('selected');
};

var addMoveablePieceHandlers = function(validMoves, scope) {
    var allSquares = $('.table.board td');
    validMoves.forEach(function(m) {
        var source = m.src;
        var el = scope.gameInterface.getSquare(source.file + source.rank);
        el.on('click',function() {
            clearAvailableMoves(allSquares);
            el.addClass('selected');
            m.squares.forEach(function(square) {
                var element = scope.gameInterface.getSquare(square.file + square.rank);
                element.addClass('valid-move');
                element.on('click', function() {
                    makeAlgebraicMove(m.src, square, scope, function(algebraicMove) {
                        clearAvailableMoves(allSquares);
                        allSquares.off('click');
                        scope.gameContext.move(algebraicMove);
                        setTimeout(scope.after, 50); // TODO Ew!                        
                    });
                });
                // attach handlers here to listen for next click
            });
        });
    });
}

module.exports = {
    name: "Random",
    // Options don't do anything for this, but keeping it for consistency
    initialize: function(gameContext, gameInterface, userOptions) {
        this.gameContext = gameContext;
        if(!gameInterface) {
            throw 'gameInterface is required for player strategy';
        }
        this.gameInterface = gameInterface;
    },
    move: function(after) {
        this.after = after;
        addMoveablePieceHandlers(this.gameContext.validMoves, this);
    }
}