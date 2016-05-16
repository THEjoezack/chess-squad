module.exports = {
    showStatus: function(gc) {
        if(gc.isStalemate) {
            var message = 'Stalemate, everybody loses';
        }
        else if(gc.isRepetition) {
            var message = 'Too many repeats, giving up';
        }
        else if(gc.isCheckmate) {
            var message = 'Checkmate! ' + gc.currentPlayer.name + ' wins.';
        } else {
            var message = 'Game over, but I don\'t know why'; // This should never happen
        }
        
        // TODO ID!
        $('#check-alert-message').addClass('hidden');
        $('#site-status-message .status-message').html(message);
        $('#site-status-message').removeClass('hidden');
    },
    hideStatus: function() {
        $('#check-alert-message').addClass('hidden');
        $('#site-status-message').addClass('hidden');
    },
    showCheckAlert: function(gc) {
        // TODO ID!
        if(gc.isCheck) {
            $('#check-alert-message .status-message').html(gc.offPlayer.name + ' is in check!');
            $('#check-alert-message').removeClass('hidden');
            this.check = true;
        } else if(this.check) {
            $('#check-alert-message').addClass('hidden');
            this.check = false;
        }
    }
};