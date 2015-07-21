(function() {
    'use strict';

    function GameOver() {}

    GameOver.prototype = {
        create: function () {
          var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5,
            'GAME-OVER', {
                font: '20px Arial',
                fill: '#ffffff',
                align: 'center'
          });
          text.anchor.set(0.5);
          this.input.onDown.add(this.onDown, this);
        },

        update: function () {

        },

        onDown: function () {
          this.game.state.start('game');
        }
    };
    window['crap'] = window['crap'] || {};
    window['crap'].GameOver = GameOver;
}());
