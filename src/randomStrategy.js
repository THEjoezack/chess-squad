module.exports = {
    // Options don't do anything for this, but keeping it for consistency
    initialize: function(gameContext, userOptions) {
        this.gameContext = gameContext;
    },
    move: function() {
        var moves = Object.keys(this.gameContext.notatedMoves);
        var index = require('randRange').getRandomArbitrary(0, moves.length);
        var move = moves[index];

        return this.gameContext;
    }
}