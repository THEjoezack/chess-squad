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
                            algebraicMove = m.src.piece.notation + m.src.file + m.src.rank + 'x' + square.piece.notation + square.file + square.rank;
                            console.log(algebraicMove);
                        }
                        // TODO if there's ambiguity
                        // TODO if a piece is taken...
                        $('td').removeClass('valid-move');
                        $('td').removeClass('selected');
                        $('td').off('click');
                        
                        console.log(m);
                        try {
                            me.gameContext.move(algebraicMove);
                        } catch(e) {
                            console.log(e);
                            debugger;
                        }
                        setTimeout(me.after, 50);
                        
                        // TODO: castle!
                    });
                    // attach handlers here to listen for next click
                });
            });
        });
        // TODO invalid moves should have better messages!
    }
}