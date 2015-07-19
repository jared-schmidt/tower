(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {
    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
      this.load.setPreloadSprite(this.asset);

      // this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.loadResources();

      this.ready = true;
    },

    loadResources: function () {
      // load your assets here
    //   this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    //   this.load.tilemap('level2', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
    //   this.load.tilemap('level3', 'assets/tilemaps/level3.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.tilemap('tower', 'assets/tilemaps/tower.json', null, Phaser.Tilemap.TILED_JSON);

      this.load.image('gameTiles', 'assets/images/tiles.png');
      this.load.image('bluecup', 'assets/images/bluecup.png');
      this.load.image('player', 'assets/images/player.png');
      this.load.image('browndoor', 'assets/images/browndoor.png');
    },

    create: function () {

    },

    update: function () {
      // if (!!this.ready) {
        // this.game.state.start('game');
        this.game.state.start('menu');
      // }
    },

    onLoadComplete: function () {
      // this.ready = true;
    }
  };

  window['crap'] = window['crap'] || {};
  window['crap'].Preloader = Preloader;
}());
