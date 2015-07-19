(function() {
    'use strict';

    var playerSpeed = 100;

    var currentLevel = 1;

    var points = 0;

    var healthTextValue;

    var textStyleKey = {
        font: 'bold 11px snas-serif',
        fill: '#46c0f9',
        align: 'center'
    };

    var textStyleValue = {
        font: 'bold 11px sans-serif',
        fill: '#fff',
        align: 'center'
    };

    function Game() {}

    Game.prototype = {
        findObjectsByType: function(type, map, layer) {
            var result = [];
            map.objects[layer].forEach(function(element) {
                if (element.properties.type === type) {
                    element.y -= map.tileHeight;
                    result.push(element);
                }
            });
            return result;
        },
        createFromTiledObject: function(element, group) {
            var sprite = group.create(element.x, element.y, element.properties.sprite);

            Object.keys(element.properties).forEach(function(key) {
                // console.log(element.properties);
                sprite[key] = element.properties[key];
            });
        },
        createItems: function() {
            var self = this;
            self.items = self.game.add.group();
            self.items.enableBody = true;
            var result = self.findObjectsByType('item', this.map, 'objectsLayer');
            result.forEach(function(element) {
                self.createFromTiledObject(element, self.items);
            });
        },
        createDoors: function() {
            var self = this;
            self.doors = self.game.add.group();
            self.doors.enableBody = true;
            var result = self.findObjectsByType('door', this.map, 'objectsLayer');
            result.forEach(function(element) {
                self.createFromTiledObject(element, self.doors);
            });
        },
        createPlayer: function(){
            var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
            this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
            this.player.hasKey = false;
            this.player.health = 100;
            this.game.physics.arcade.enable(this.player);
        },
        createRooms: function() {
            var self = this;
            self.rooms = this.game.add.group();
            self.rooms.enableBody = true;

            var result = self.findObjectsByType('room', this.map, 'objectsLayer');
            var keyRoom = Math.floor(Math.random() * result.length) + 1;
            result.forEach(function(element, index) {

                var offset = 13;

                if (element.x > 20){
                    element.x += offset;
                    // console.log("LEFT");
                } else {
                    // console.log("RIGHT");
                }

                element.y += offset;

                self.addRoomItems(element, index, keyRoom);
                self.createFromTiledObject(element, self.rooms);
            });
        },
        addRoomItems: function(item, index, keyRoom) {
            item.properties['hasKey'] = false;
            item.properties['hasMonster'] = true;
            if (keyRoom === index) {
                item.properties['hasKey'] = true;
                item.properties['hasMonster'] = false;
            }
            item.properties['sprite'] = 'red';

        },
        create: function() {
            this.input.onDown.add(this.onInputDown, this);
            this.loadMap('tower');
        },
        loadMap: function(lvl) {
            this.map = this.game.add.tilemap(lvl);

            this.map.addTilesetImage('tiles', 'gameTiles');

            this.backgroundlayer = this.map.createLayer('backgroundLayer');
            this.blockedLayer = this.map.createLayer('blockingLayer');

            this.map.setCollisionBetween(1, 2000, true, 'blockingLayer');

            this.backgroundlayer.resizeWorld();

            this.createItems();
            this.createDoors();
            this.createRooms();

            this.createPlayer();

            this.game.camera.follow(this.player);

            this.cursors = this.game.input.keyboard.createCursorKeys();
            // this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

            var healthTextKey = this.game.add.text(1, 1, 'Health:', textStyleKey);
            healthTextKey.fixedToCamera = true;

            healthTextValue = this.game.add.text(40, 1, this.player.health.toString(), textStyleValue);
            healthTextValue.fixedToCamera = true;

            var levelTextKey = this.game.add.text(70, 1, 'Level:', textStyleKey);
            levelTextKey.fixedToCamera = true;

            levelTextKey = this.game.add.text(100, 1, currentLevel.toString(), textStyleValue);
            levelTextKey.fixedToCamera = true;

            var pointsTextKey = this.game.add.text(1, this.game.height - 11, 'Points:', textStyleKey);
            pointsTextKey.fixedToCamera = true;

            pointsTextKey = this.game.add.text(35, this.game.height - 11, points.toString(), textStyleValue);
            pointsTextKey.fixedToCamera = true;

        },
        update: function() {
            $("#update").text(this.player.health);
            this.player.body.velocity.y = 0;
            this.player.body.velocity.x = 0;

            if (this.cursors.up.isDown) {
                this.player.body.velocity.y -= playerSpeed;
            } else if (this.cursors.down.isDown) {
                this.player.body.velocity.y += playerSpeed;
            }

            if (this.cursors.left.isDown) {
                this.player.body.velocity.x -= (playerSpeed*(Math.round(currentLevel/2)));
            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x += (playerSpeed*(Math.round(currentLevel/2)));
            }

            // if(this.spaceKey.isDown){
            //     console.log('s key pressed');
            // }

            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
            this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
            this.game.physics.arcade.overlap(this.player, this.rooms, this.inRoom, null, this);

            healthTextValue.text = '' + this.player.health;

            if(this.player.hasKey){
                var foundKeyText = this.game.add.text(125, 1, 'KEY', textStyleKey);
                foundKeyText.fixedToCamera = true;
            }
        },
        collect: function(player, collectable) {
            console.log('yummy!');

            //remove sprite
            collectable.destroy();
        },
        inRoom: function(player, room) {
            if (room.hasKey && !this.player.hasKey) {
                console.log('FOUND KEY!');
                this.player.hasKey = true;
            }
            if (room.hasMonster) {
                console.log('MONSTER!');
                this.player.health -= 1;
                if (this.player.health <= 0){
                    currentLevel = 1;
                    this.game.state.start('gameOver', true, false, points, currentLevel);
                    points = 0;
                }
            }
        },
        enterDoor: function(player, door) {
            if (door.isLocked && !this.player.hasKey){
                console.log('Locked');
                this.player.body.velocity.x -= playerSpeed + 50;
            } else{
                // console.log('Open');
                if (door.targetTilemap !== 'null') {
                    console.log('entering door that will take you to ' + door.targetTilemap);
                    this.loadMap(door.targetTilemap);
                } else {
                    points += (currentLevel * this.player.health);
                    currentLevel += 1;
                    playerSpeed += 6;
                    this.loadMap('tower');
                }
            }
        },
        onInputDown: function() {
            console.log("Game Click");
            // this.game.state.start('menu');
        }
    };

    window['crap'] = window['crap'] || {};
    window['crap'].Game = Game;
}());
