require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('./css/chess-squad.css');

var aiStrategy = require('./strategies/chessAiStrategy');
var randomStrategy = require('./strategies/randomStrategy');
var getPlayers = function(gc) {
    var players = [
        {
            name: 'AI Player',
            color: 'white',
            strategy: aiStrategy
        },
        {
            name: 'Random Player',
            color: 'black',
            strategy: randomStrategy
        }
    ];
    
    for(i in players) {
        players[i].strategy.initialize(gc);
    }
    return players;
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
        
        if(gc.isStalemate) {
            game.hideCheckAlert();
            game.showStatus('Stalemate, everybody loses');
            return;
        }
        
        if(gc.isRepetition) {
            game.hideCheckAlert();
            game.showStatus('Too many repeats, giving up');
            return;
        }
        
        if(gc.isCheckmate) {
            game.hideCheckAlert();
            game.showStatus('Checkmate! ' + gc.currentPlayer.name + ' wins.');
            return;
        }
        
        game.updateLog(gc);
        game.drawBoard(gc.game.board.squares);
        game.showCheckAlert(gc);
        
        turn++;
        setTimeout(scope.move, 5);
    };
    scope.move();
});