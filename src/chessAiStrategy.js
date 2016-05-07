var defaults = {
    depth: 3,
    monitor: false,
    strategy: 'basic',
    timeout: 100
};

var getRandomArbitrary = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

module.exports = {
    initialize: function(gameContext, userOptions) {
        var options = Object.assign(defaults, userOptions || []);
        this.ai = require('chess-ai-kong');
        this.ai.setOptions(options);
        this.gameContext = gameContext;
    },
    move: function() {
        var myMove = this.ai.play(this.gameContext.allMoves);
        
        // sometimes the AI makes moves that the engine doesn't consider legal?
        var sanitizedMove = myMove.replace('+','').replace('=',''); // todo fix this!
        if(!this.gameContext.notatedMoves[sanitizedMove]) {
            var legalMoves = Object.keys(this.gameContext.notatedMoves);
            myMove = legalMoves[getRandomArbitrary(0, legalMoves.length)];
            sanitizedMove = myMove;
        }
        
        this.gameContext.allMoves.push(myMove);
        this.gameContext.move(sanitizedMove);
        return this.gameContext;
    }
}