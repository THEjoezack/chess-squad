var aiStrategy = require('./strategies/chessAiStrategy');
var randomStrategy = require('./strategies/randomStrategy');
var playerStrategy = require('./strategies/playerStrategy');

var getStrategy = function(playerType) {
    switch(playerType) {
        case 'ai':
            return aiStrategy;
        case 'random':
            return randomStrategy;
        case 'human':
            return playerStrategy;
    }
    return aiStrategy;
};

module.exports = {
    getPlayers: function(playerType1, playerType2, gc, gameInterface) {
        var players = [
            {
                name: 'Player #1',
                color: 'white',
                strategy: getStrategy(playerType1)
            },
            {
                name: 'Player #2',
                color: 'black',
                strategy: getStrategy(playerType2)
            }
        ];
        
        for(i in players) {
            players[i].strategy.initialize(gc, gameInterface);
        }
        
        return players;
    }
};