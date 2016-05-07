var defaults = {
    depth: 3,
    monitor: false,
    strategy: 'basic',
    timeout: 100
};

module.exports = {
    initialize: function(gameContext, userOptions) {
        var options = Object.assign(defaults, userOptions || []);
        this.ai = require('chess-ai-kong');
        this.ai.setOptions(options);
        this.gameContext = gameContext;
        this.gameContext.allMoves = [];
    },
    move: function() {
        var myMove = this.ai.play(this.gameContext.allMoves);
        
        // sometimes the AI makes moves that the engine doesn't consider legal?
        var sanitizedMove = myMove.replace('+','').replace('=',''); // todo fix this!
        if(!this.gameContext.notatedMoves[sanitizedMove]) {
            var legalMoves = Object.keys(this.gameContext.notatedMoves);
            var random = require('random-number-in-range')(0, legalMoves.length - 1);
            myMove = legalMoves[random];
            sanitizedMove = myMove;
        }

        this.gameContext.allMoves.push(myMove);
        this.gameContext.move(sanitizedMove);
        return myMove;
    }
}