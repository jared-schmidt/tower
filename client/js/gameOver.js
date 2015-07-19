(function() {
    'use strict';

    function GameOver() {}

    GameOver.prototype = {
        init: function(score, level) {
            this.score = score;
            this.level = level;
        },
        create: function() {
            var self = this;
            var text = self.add.text(self.game.width * 0.5, self.game.height * 0.5,
                'GAME-OVER', {
                    font: '20px Arial',
                    fill: '#ffffff',
                    align: 'center'
                });
            text.anchor.set(0.5);

            var text = self.add.text((self.game.width * 0.5) - 25, (self.game.height * 0.5) + 50,
                'Score: ' + self.score, {
                    font: '12px Arial',
                    fill: '#ffffff',
                    align: 'center'
                });
            text.anchor.set(0.5);

            // TODO: Cancel button still submits
            // TODO: Way to check if text in text box?
            bootbox.prompt({
                closeButton: false,
                title: "Enter your name for leaderboard",
                buttons: {
                    confirm: {
                        label: 'Submit',
                    }
                },
                callback: function(result){
                    console.log(result);
                    if (result){
                        var obj = {
                            name: result,
                            score: self.score,
                            level: self.level
                        };
                        Meteor.call('addScore', obj);
                    }
                }
            });

            // bootbox.prompt('Your name', function(result) {
            //
            //
            // });

            this.input.onDown.add(this.onDown, this);
        },

        update: function() {

        },

        onDown: function() {
            this.game.state.start('game');
        }
    };
    window['crap'] = window['crap'] || {};
    window['crap'].GameOver = GameOver;
}());
