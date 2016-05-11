var defaults = {
    depth: 3,
    monitor: false,
    strategy: 'basic',
    timeout: 50
};

module.exports = {
    name: "Chess AI",
    initialize: function(gameContext, userOptions) {
        var options = Object.assign(defaults, userOptions || []);
        this.ai = require('chess-ai-kong');
        this.ai.setOptions(options);
        this.gameContext = gameContext;
    },
    move: function() {
        var allMoves = [];
        this.gameContext.game.moveHistory.forEach(function(m) {
            allMoves.push(m.algebraic)
        });
        
        // sometimes the AI makes moves that the engine doesn't consider legal?
        try {
            var myMove = this.ai.play(allMoves);
            var sanitizedMove = myMove.replace('+','').replace('=',''); // todo fix this!
        } catch(e) {
            console.log('Illegal move was made by previous player? ' + e);
            console.log(allMoves);
            sanitizedMove = '';
        }

        if(!this.gameContext.notatedMoves[sanitizedMove]) {
            console.log('Illegal move was attempted by AI? ' + myMove);
            var legalMoves = Object.keys(this.gameContext.notatedMoves);
            var random = require('random-number-in-range')(0, legalMoves.length - 1);
            myMove = legalMoves[random];
            sanitizedMove = myMove;
        }

        this.gameContext.move(sanitizedMove);
        return myMove;
    }
}