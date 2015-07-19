window.addEventListener('load', function () {
  'use strict';

  // var Phaser = Meteor.npmRequire('phaser');

  var ns = window['crap'];
  var game = new Phaser.Game(150, 150, Phaser.AUTO, 'crap-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('gameOver', ns.GameOver);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */
  game.state.start('boot');
}, false);
