require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('./css/chess-squad.css');

var aiStrategy = require('./strategies/chessAiStrategy');
var randomStrategy = require('./strategies/randomStrategy');
var getPlayers = function(gc) {
    var players = [
        {
            name: 'Player #1',
            color: 'white',
            strategy: aiStrategy
        },
        {
            name: 'Player #2',
            color: 'black',
            strategy: randomStrategy
        }
    ];
    
    for(i in players) {
        players[i].strategy.initialize(gc);
    }
    return players;
}

var isGameOver = function(gc) {
    return gc.isStalemate || gc.isRepetition || gc.isCheckmate;
}

$(function() {
    var chess = require('chess');
    var gc = chess.create(),
        scope = this,
        game = require('./gameInterface');
    gc.players = getPlayers(gc);
    
    var turn = 0;
    var check = false;
    scope.move = function() {
        gc.currentPlayer = gc.players[turn % 2];
        gc.offPlayer = gc.players[(turn + 1) % 2];
        gc.currentPlayer.strategy.move();
        
        game.updateLog(gc);
        game.drawBoard(gc.game.board.squares);
        game.showCheckAlert(gc);
        
        turn++;
        
        if(isGameOver(gc)) {
            game.showStatus(gc);
            return;
        }
        
        setTimeout(scope.move, 5);
    };
    scope.move();
});