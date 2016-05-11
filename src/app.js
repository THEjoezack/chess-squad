require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('./css/chess-squad.css');

var aiStrategy = require('./strategies/chessAiStrategy');
var randomStrategy = require('./strategies/randomStrategy');

$(function() {
    var chess = require('chess');
    var gc = chess.create(),
        scope = this,
        game = require('./gameInterface'),
        players = [
            {
                name: 'White',
                color: 'White',
                strategy: aiStrategy
            },
            {
                name: 'Black',
                color: 'Black',
                strategy: randomStrategy
            }
        ];
    
    for(i in players) {
        players[i].strategy.initialize(gc);
    }
    
    var turn = 0;
    var check = false;
    scope.move = function() {
        var currentPlayer = players[turn % 2];
        var offPlayer = players[(turn + 1) % 2];
        var strategy = currentPlayer.strategy;
        var lastMove = strategy.move();
        
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
            game.showStatus('Checkmate! ' + currentPlayer.name + ' wins.');
            return;
        }
        
        game.drawBoard(gc.game.board.squares);
        
        // show alert on check!
        if(gc.isCheck) {
            game.showCheckAlert(offPlayer.name);
            check = true;
        } else if(check) {
            game.hideCheckAlert();
            check = false;
        }
        
        turn++;
        setTimeout(scope.move, 5);
    };
    scope.move();
});