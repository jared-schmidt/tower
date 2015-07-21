window.addEventListener('load', function () {
  'use strict';

  var ns = window['crap'];
  var game = new Phaser.Game(160, 160, Phaser.AUTO, 'crap-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('gameOver', ns.GameOver);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */
  game.state.start('boot');
}, false);
