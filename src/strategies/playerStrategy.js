require('expose?$!expose?jQuery!jquery');

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
        // TODO stop touching the DOM! Events!
        var me = this;
        var gameInterface = this.gameInterface;
        this.after = after;
        this.playerTurn = true;
        
        var validMoves = this.gameContext.validMoves;
        validMoves.forEach(function(m) {
            var src = gameInterface.getSquare(m.src.file + m.src.rank);
            src.on('click',function() {
                $('td').removeClass('valid-move');
                $('td').removeClass('selected');
                src.addClass('selected');
                m.squares.forEach(function(square) {
                    var element = gameInterface.getSquare(square.file + square.rank);
                    element.addClass('valid-move');
                    element.on('click', function() {
                        var algebraicMove = (m.src.piece.notation + square.file + square.rank);
                        if(square.piece) {
                            //When a pawn makes a capture, the file from which the pawn departed is used to identify the pawn.
                            if(m.src.piece.notation === '') {
                                algebraicMove = m.src.piece.notation + m.src.file + 'x' + square.file + square.rank;
                            } else {
                                // TODO Extract this!
                            
                                // Ambiguous moves
                                // the file of departure (if they differ); or
                                // the rank of departure (if the files are the same but the ranks differ); or
                                // both the file and rank (if neither alone is sufficient to identify the piece—which occurs only in rare cases where one or more pawns have promoted, resulting in a player having three or more identical pieces able to reach the same square).
                                var algebraicMove = m.src.piece.notation + 'x' + square.file + square.rank;
                                if(!me.gameContext.notatedMoves[algebraicMove]) { // assuming ambiguous
                                    algebraicMove = m.src.piece.notation + m.src.file + 'x' + square.file + square.rank;
                                }
                                if(!me.gameContext.notatedMoves[algebraicMove]) { // assuming ambiguous
                                    algebraicMove = m.src.piece.notation + m.src.rank + 'x' + square.file + square.rank;
                                }
                                if(!me.gameContext.notatedMoves[algebraicMove]) { // assuming ambiguous
                                    algebraicMove = m.src.piece.notation + m.src.file + m.src.rank + 'x' + square.file + square.rank;
                                }
                            }
                        } else {
                                var castle = false;
                                if(m.src.piece.notation === 'K') {
                                    // if it's a 2fer
                                    // we can ignore the rules about the rook because we scope to available moves
                                    if(m.src.file === 'e') {
                                        if(square.file === 'c') {
                                            algebraicMove = '0-0-0';
                                            castle = true;
                                        } else if(square.file === 'g') {
                                            algebraicMove = '0-0';
                                            castle = true;
                                        }
                                    }
                                }
                            }
                        // TODO castling!
                        $('td').removeClass('valid-move');
                        $('td').removeClass('selected');
                        $('td').off('click');
                        
                        console.log(m);
                        try {
                            me.gameContext.move(algebraicMove);
                        } catch(e) {
                            console.log(e);
                            console.log('Huh? ' + algebraicMove);
                            console.log('Huh? ' + me);
                            debugger;
                        }
                        setTimeout(me.after, 50); // TODO Ew!
                    });
                    // attach handlers here to listen for next click
                });
            });
        });
        // TODO invalid moves should have better messages!
    }
}