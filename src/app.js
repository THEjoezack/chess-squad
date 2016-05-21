require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
require('./css/chess-squad.css');

var isGameOver = function(gc) {
    return gc.isStalemate || gc.isRepetition || gc.isCheckmate;
}

var startGame = function(playerType1, playerType2) {
    var gc = require('chess').create(),
        scope = this,
        ui = require('./game/game').initialize(),
        log = require('./game/log').initialize('.game-log'),
        status = require('./game/status'),
        playerManager = require('./game/playerManager');
    
    // This is annoying, there are sublte differences in how
    // the various strategies create their algebraic moves.
    // Doing this makes things much smoother since the strategies
    // recieves the exact move they put in.
    gc.allMoves = [];
    log.clear();
    status.hideStatus();
    
    // super code smell - why do the players know about ui?
    gc.players = playerManager.getPlayers(playerType1, playerType2, gc, ui);
    
    var turn = 0;
    var check = false;
    scope.move = function() {
        gc.currentPlayer = gc.players[turn % 2];
        gc.offPlayer = gc.players[(turn + 1) % 2];
        gc.currentPlayer.strategy.move(function() {
            log.updateLog(gc);
            ui.drawBoard(gc.game.board.squares);
            status.showCheckAlert(gc);
            
            turn++;
            
            if(isGameOver(gc)) {
                status.showStatus(gc);
                $('#game-setup').modal('show');
                return;
            }
            
            scope.move();
        });
    };
    ui.drawBoard(gc.game.board.squares);
    scope.move();
};

$(function() {
    $('#game-setup').find('.btn.btn-primary').on('click', function() {
        var fields = $('#game-setup select');
        startGame(fields[0].value, fields[1].value);
        $('#game-setup').modal('hide');
    });
    $('#game-setup').modal('show');
});