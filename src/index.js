import Phaser from "phaser";
import streetImg from "./assets/street.png";

let scaleRatio = window.devicePixelRatio / 3;

const config = {
  type: Phaser.AUTO,
  parent: "phaser-app",
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300},
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// global game options
let gameOptions = {
  platformStartSpeed: 350,
  spawnRange: [100, 350],
  platformSizeRange: [50, 250],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2
}

const game = new Phaser.Game(config);

function preload() {
  this.load.image("street", streetImg);
}

// CREATE
function create() {
  // group platforms
  this.platformGroup = this.add.group({
    // once a platform is removed it's added to the pool
    removeCallback: function(platform) {
      platform.scene.platformPool.add(platform)
    }
  });
  // pool
  this.platformPool = this.add.group({
    // once a platform is removed from the pool, it's added to the active platforms group
    removeCallback: function(platform){
        platform.scene.platformGroup.add(platform)
    }
  });
  // add a platform to the game
  this.physics.add.sprite(this.game.clientLeft, this.game.clientTop, "street");
}

// UPDATE
function update() {
  // recycling platforms
  let minDistance = this.game.config.height;
  this.platformGroup.getChildren().forEach(function(platform){
      let platformDistance = this.game.config.height - platform.y - platform.displayHeight / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if(platform.y < - platform.displayHeight / 2){
          this.platformGroup.killAndHide(platform);
          this.platformGroup.remove(platform);
      }
  }, this);

  // adding new platforms
  if(minDistance > this.nextPlatformDistance){
      var nextPlatformHeight = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
      this.physics.add.sprite(this.game.clientLeft, nextPlatformHeight, "street");
  }
}
