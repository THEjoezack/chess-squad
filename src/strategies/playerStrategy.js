require('expose?$!expose?jQuery!jquery');

// Algebraic notation is not...very programmer friendly.
// It favors a lazy approach, using as few characters as possible, only adding
// characters if moves are ambiguous.
var getAlgebraicMove = function(source, destination, scope) {
    var algebraicMove = (source.piece.notation + destination.file + destination.rank);
    if(destination.piece) {
        //When a pawn makes a capture, the file from which the pawn departed is used to identify the pawn.
        if(source.piece.notation === '') {
            algebraicMove = source.piece.notation + source.file + 'x' + destination.file + destination.rank;
        } else {
            // TODO Extract this!
        
            // Ambiguous moves
            // the file of departure (if they differ); or
            // the rank of departure (if the files are the same but the ranks differ); or
            // both the file and rank (if neither alone is sufficient to identify the piece—which occurs only in rare cases where one or more pawns have promoted, resulting in a player having three or more identical pieces able to reach the same square).
            var algebraicMove = source.piece.notation + 'x' + destination.file + destination.rank;
            if(!scope.gameContext.notatedMoves[algebraicMove]) { // assuming ambiguous
                algebraicMove = source.piece.notation + source.file + 'x' + destination.file + destination.rank;
            }
            if(!scope.gameContext.notatedMoves[algebraicMove]) { // assuming ambiguous
                algebraicMove = source.piece.notation + source.rank + 'x' + destination.file + destination.rank;
            }
            if(!scope.gameContext.notatedMoves[algebraicMove]) { // assuming ambiguous
                algebraicMove = source.piece.notation + source.file + source.rank + 'x' + destination.file + destination.rank;
            }
        }
    } else {
        var castle = false;
        if(source.piece.notation === 'K') {
            // if it's a 2fer
            // we can ignore the rules about the rook because we scope to available moves
            if(source.file === 'e') {
                if(destination.file === 'c') {
                    algebraicMove = '0-0-0';
                    castle = true;
                } else if(destination.file === 'g') {
                    algebraicMove = '0-0';
                    castle = true;
                }
            }
        }
    }
    return algebraicMove;
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
                    var algebraicMove = getAlgebraicMove(m.src, square, scope);
                    clearAvailableMoves(allSquares);
                    allSquares.off('click');
                    
                    scope.gameContext.move(algebraicMove);
                    
                    setTimeout(scope.after, 50); // TODO Ew!
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