require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('./css/chess-squad.css');

var aiStrategy = require('./strategies/chessAiStrategy');
var randomStrategy = require('./strategies/randomStrategy');
var playerStrategy = require('./strategies/playerStrategy');

var getPlayers = function(gc, gameInterface) {
    var players = [
        {
            name: 'Player #1',
            color: 'white',
            strategy: aiStrategy
        },
        {
            name: 'Player #2',
            color: 'black',
            strategy: playerStrategy
        }
    ];
    
    for(i in players) {
        players[i].strategy.initialize(gc, gameInterface);
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
        ui = require('./gameInterface');
    ui.initialize();
    
    // super code smell - why do the players know about ui?
    gc.players = getPlayers(gc,ui);
    
    
    var turn = 0;
    var check = false;
    scope.move = function() {
        gc.currentPlayer = gc.players[turn % 2];
        gc.offPlayer = gc.players[(turn + 1) % 2];
        gc.currentPlayer.strategy.move(function() {
            ui.updateLog(gc);
            ui.drawBoard(gc.game.board.squares);
            ui.showCheckAlert(gc);
            
            turn++;
            
            if(isGameOver(gc)) {
                game.showStatus(gc);
                return;
            }
            
            scope.move();
        });
    };
    ui.drawBoard(gc.game.board.squares);
    scope.move();
});