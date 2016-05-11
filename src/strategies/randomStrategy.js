module.exports = {
    name: "Random",
    // Options don't do anything for this, but keeping it for consistency
    initialize: function(gameContext, userOptions) {
        this.gameContext = gameContext;
    },
    move: function() {
        var moves = Object.keys(this.gameContext.notatedMoves);
        var index = require('random-number-in-range')(0, moves.length - 1);
        var myMove = moves[index];
        this.gameContext.move(myMove);
        return myMove;
    }
}