require('expose?$!expose?jQuery!jquery');
var logEntry = require('./templates/logEntry.hbs');
module.exports = {
    initialize: function(selector) {
        this.el = $(selector);
        this.container = this.el.parent();
    },
    updateLog: function(gameContext) {
        var status = '';
        status = gameContext.isCheck ? 'check' : status;
        status = gameContext.isStalemate ? 'stalemate' : status;
        status = gameContext.isRepetition ? 'repetition' : status;
        status = gameContext.isCheckmate ? 'checkmate' : status;
        var alertType = status === 'check' ? 'warning' : 'info';
        var lastMove = gameContext.game.moveHistory[gameContext.game.moveHistory.length - 1];

        var html = logEntry({
            player: gameContext.currentPlayer.name,
            color: gameContext.currentPlayer.color,
            type: lastMove.piece.type, 
            move: lastMove.algebraic,
            status: status,
            alertType: alertType
        });
        
        this.el.append(html);
        this.container.animate({
            scrollTop: this.container.prop('scrollHeight')
        }, 'fast');
    }
};