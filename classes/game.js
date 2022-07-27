function random(max, min) {
  return Math.floor(Math.random() * max) + min;
}

class InputHandler {
  constructor(game) {
    this.game = game;
    this.keysUseable = [
      "f",
      "d",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      " ",
      "Shift",
      "+",
      "-",
      "8",
      "2",
      "s"
    ];

    window.addEventListener("keydown", (e) => {
      if (
        this.keysUseable.indexOf(e.key) > -1 &&
        this.game.keys.indexOf(e.key) === -1
      ) {
        this.game.keys.push(e.key);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (
        this.keysUseable.indexOf(e.key) > -1 &&
        this.game.keys.indexOf(e.key) > -1
      ) {
        this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
      }
    });
  }
}

class Sprite {
  constructor({ ...args }) {
    this.x = args.x;
    this.y = args.y;
    this.spriteSheet = args.spriteSheet;
    this.freamWidth = args.freamWidth || 100;
    this.freamHeight = args.freamHeight || 100;
    this.freamXn = args.freamXn || 1;
    this.freamYn = args.freamYn || 1;
    this.freamSpeed = args.freamSpeed || 1;
    this.outFreamX = args.outFreamX || 100;
    this.outFreamY = args.outFreamY || 100;

    this.offsetX = args.offsetX || 0;
    this.offsetY = args.offsetY || 0;
    this.freamX = args.freamX || 0;
    this.freamY = args.freamY || 0;
    this.pause = false;
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    /*ctx.fillRect(
      (this.x - this.outFreamX / 2),
      (this.y - this.outFreamY / 2),
      this.outFreamX,
      this.outFreamY
    );
    */
    //let image = this.spriteSheet;
    ctx.drawImage(
      this.spriteSheet,
      this.freamX * this.freamWidth + this.offsetX, //soyrce X
      this.freamY * this.freamHeight + this.offsetY, //source Y
      this.freamWidth - this.offsetX, //source Width
      this.freamHeight - this.offsetY, //source Height
      this.x - this.outFreamX / 2, //Destination X
      this.y - this.outFreamY / 2, //Destination Y
      this.outFreamX, //Destination Width
      this.outFreamY //Destination Height
    );

    //console.log(this.freamX, this.freamY);
  }

  update(gameFream) {
    if (this.pause) {
      //console.log("pause");
      return;
    }
    if (gameFream % this.freamSpeed === 0) {
      //FreamX Switch
      this.freamX += 1;
      if (this.freamX >= this.freamXn) {
        this.freamX = 0;
        //FreamY Switch if Fream X Complete
        if (this.freamYn > 1) {
          this.freamY += 1;
          if (this.freamY >= this.freamYn) {
            this.freamY = 0;
          }
        }
      }
    }
  }
}


class Particle {
  constructor(game, { ...arg }) {
    this.game = game;
    this.x = arg.x;
    this.y = arg.y;
    this.speed = random(4, 1);
    this.color = "red";
    //"hsl(" + (Math.random() * 360 - 180) + ",100%,50%)";
    this.moveX = Math.random() * 3 - 1.5;
    this.moveY = Math.random() * 3 - 1.5;
    this.size = random(5, 1);
    if (this.size < 1) {
      this.size = 1;
    }
    this.v = 0.0;
  }
  update(deltaTime) {
    this.x += this.moveX;
    this.y += this.moveY + this.v;
    if (this.size > 0.1) {
      this.v += 0.08;
      this.size -= 0.01;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}


class Bullet {
  constructor(game, args) {
    this.game = game;
    this.x = args.x;
    this.y = args.y;
    this.speed = args.speed || 8;
    this.expire = false;
    this.width = 8;
    this.height = 3;
    this.direction = args.direction || "right";
    if (this.direction === "right") {
      this.x += 50;
      this.y -= 10;
    } else {
      this.x -= 50;
      this.y -= 10;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "rgb(255, 165, 0)"; //orrange in rgb
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(gameFream) {
    this.speed += .2;
    if (this.direction === "right") {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
  }
}

class Enemy {
  constructor(game, position) {
    this.game = game;
    this.position = position;

    this.currentSprite =
      this.game.EnemySpriteData.sprites[
      Math.floor(Math.random() * this.game.EnemySpriteData.sprites.length)
      ];

    this.currentState = "walk";
    this.direction = "right";

    this.scale = this.currentSprite.scale;

    this.speed = 0;//this.currentSprite.speed | 0; // 
    this.life = this.currentSprite.power | 100;
    this.diying = false;
    this.deletion = false;
    this.deletionTimeAfterDie = 1500;

    this.sprite = new Sprite({
      x: this.position.x, //Image X
      y: this.position.y, //Image Y
      spriteSheet: this.currentSprite.img, //Image
      freamWidth: this.currentSprite.sprite_width, //Source Image Width
      freamHeight: this.currentSprite.sprite_height, //Source Image Height
      freamXn: this.currentSprite.state[this.currentState].freamXn, //Number of Columns
      freamYn: 1, //Number of Columns
      offsetX: 0,
      offsetY: 0,
      outFreamX: (this.currentSprite.sprite_width * this.scale) / 2, //Additionally Scale down divided by 2
      outFreamY: (this.currentSprite.sprite_height * this.scale) / 2,
      freamSpeed: this.currentSprite.state[this.currentState].speed,
    });
    //console.log(this.game.EnemySpriteData.sprites);
  }

  draw(context) {
    context.save();
    if (this.direction === "left") {
      context.translate(this.position.x, this.position.y);
      // context.rotate(-180 * Math.PI / 180);
      context.scale(-1, 1);
      this.sprite.x = 0;
      this.sprite.y = 0;
    }
    this.sprite.draw(context);
    context.restore();
  }

  update(gameFream) {
    this.spriteUpdate();
    if (this.life <= 0) {
      // console.log(this.sprite);
      if (!this.diying) {
        this.diying = true;
        this.sprite.freamX = 0;
      }
      this.sprite.freamY = 3;
      this.currentState = "die";
      this.spriteUpdate();
      // console.log(this.sprite.freamX, this.sprite.freamXn);
      if (this.sprite.freamX + 1 >= this.sprite.freamXn) {
        this.deletionTimeAfterDie -= this.game.deltaTime;
        if (this.deletionTimeAfterDie < 0) {
          this.deletion = true;
        }
        this.sprite.freamX = this.sprite.freamXn - 1;
        this.sprite.pause = true;
      }
    } else {
      this.sprite.x = this.position.x;
      this.sprite.y = this.position.y;

      switch (this.currentState) {
        case "idle":
          this.sprite.freamY = 0;
          break;
        case "walk":
          this.sprite.freamY = 1;
          break;
        case "attack":
          this.sprite.freamY = 2;
          break;
        case "die":
          this.sprite.freamY = 3;
          break;
      }
      if (this.direction === "right") {
        this.position.x += this.speed;
        if (this.position.x >= this.game.canvas.width) {
          this.sprite.freamX = 0;
          this.direction = "left";
        }
      } else {
        this.position.x -= this.speed;
        if (this.position.x <= 0) {
          this.sprite.freamX = 0;
          this.direction = "right";
        }
      }
      //console.log(this.sprite);
    }
    this.sprite.update(gameFream);
  }

  spriteUpdate() {
    this.sprite.freamXn = this.currentSprite.state[this.currentState].freamXn; //Number of Columns
  }

  setDerection() {
    this.game.player.position.x > this.position.x ? this.direction = "right" : this.direction = "left";
  }

  gethurt() {
    //console.log(this.game);
    for (let i = 0; i < 5; i++) {
      this.game.particles.push(new Particle(this.game,
        {
          x: this.position.x,
          y: this.position.y,
        }
      ));
    }
  }
}

class Player {
  constructor(game, { position }) {
    this.game = game;
    this.spritesData = {
      sprite_width: 881,
      sprite_height: 639,
      path: "./assets/sprites/player/",
      type: "png",
      sprites: {
        weapon_flying_fly: {
          col: 5,
          row: 3,
          repeat: true,
          speed: 4,
        },
        weapon_flying_die: {
          col: 5,
          row: 1,
          repeat: false,
          speed: 4,
        },
        weapon_flying_idle: {
          col: 5,
          row: 2,
          repeate: true,
          speed: 8,
        },
        weapon_flying_shoot: {
          col: 5,
          row: 2,
          repeate: true,
          speed: 3,
        },
        weapon_standing_die: {
          col: 5,
          row: 1,
          repeate: false,
          speed: 10,
          offsetX: false,
        },
        weapon_standing_idle: {
          col: 5,
          row: 3,
          repeate: true,
          speed: 5,
        },
        weapon_standing_jump: {
          col: 5,
          row: 2,
          repeate: false,
          speed: 5,
        },
        weapon_standing_run: {
          col: 5,
          row: 3,
          repeate: true,
          speed: 2,
        },
        weapon_standing_shoot: {
          col: 5,
          row: 1,
          repeate: true,
          speed: 4,
        },
        weapon_standing_walk: {
          col: 5,
          row: 3,
          repeate: true,
          speed: 4,
        },
      },
    };
    this.currentStage = "standing";
    this.currentState = "idle";
    this.setSprite(true);
    this.position = position;
    this.scale = 0.3;
    this.movementSpeed = 2;
    this.direction = "right";
    this.bullets = [];
    this.velocity = 0;

    this.actualWidth = (this.spritesData.sprite_width * this.scale) / 1.5;
    this.actualHeight = (this.spritesData.sprite_height * this.scale) / 1.5;
  }

  preloadSprite() {
    for (let sprite in this.spritesData.sprites) {
      this.spritesData.sprites[sprite].img = new Image();
      this.spritesData.sprites[sprite].img.src =
        this.spritesData.path + sprite + "." + this.spritesData.type;
    }
    this.sprite = new Sprite({
      x: this.position.x, //Image X
      y: this.position.y, //Image Y
      spriteSheet: this.currentSprite.img, //Image
      freamWidth: this.spritesData.sprite_width, //Source Image Width
      freamHeight: this.spritesData.sprite_height, //Source Image Height
      freamXn: this.currentSprite.col, //Number of Columns
      freamYn: this.currentSprite.row, //Number of Columns
      offsetX: this.currentSprite.offsetX,
      offsetY: this.currentSprite.offsetY,
      outFreamX: this.actualWidth,
      outFreamY: this.actualHeight,
      freamSpeed: this.currentSprite.speed,
    });
  }

  draw(context) {
    context.save();

    if (this.direction === "left") {
      context.translate(this.position.x, this.position.y);
      // context.rotate(-180 * Math.PI / 180);
      context.scale(-1, 1);
      this.sprite.x = 0;
      this.sprite.y = 0;
    }

    this.sprite.draw(context);
    context.restore();

    for (let bullet of this.bullets) {
      bullet.draw(context);
    }
  }

  update(gameFream) {

    if (this.game.keyIn('+')) {
      this.sprite.outFreamX += 1;

    }
    if (this.game.keyIn('-')) {
      this.sprite.outFreamX--;
    }

    if (this.game.keyIn('8')) {
      this.sprite.offsetX += 1;
    }
    if (this.game.keyIn('2')) {
      this.sprite.offsetX -= 1;
    }


    if (this.game.keyIn('s')) {
      console.log(this.sprite);
    }
    //console.log(this.sprite);


    this.velocity += this.game.gravity;
    if (this.currentStage !== "flying") {
      this.position.y += this.velocity;
    }

    if (this.position.y > this.game.canvas.height - this.game.groundPosition) {
      this.position.y = this.game.canvas.height - this.game.groundPosition;
    }

    //Derection Of Player
    if (this.game.keyIn("ArrowLeft")) {
      this.direction = "left";
    } else if (this.game.keyIn("ArrowRight")) {
      this.direction = "right";
    }

    //stage Switch
    if (this.game.keyIn("f")) {
      this.currentStage = "flying";
    }
    if (this.game.keyIn("d")) {
      this.currentStage = "standing";
      this.velocity = 0;
    }

    //State Of Player
    if (
      (this.game.keyIn("ArrowLeft") || this.game.keyIn("ArrowRight")) &&
      this.game.keyIn("Shift")
    ) {
      if (this.currentStage == "flying") {
        this.currentState = "fly";
      } else {
        this.currentState = "run";
      }
      if (this.game.keyIn("ArrowLeft")) {
        this.position.x -= this.movementSpeed * 2;
      } else {
        this.position.x += this.movementSpeed * 2;
      }
    } else if (this.game.keyIn("ArrowLeft") || this.game.keyIn("ArrowRight")) {
      if (this.currentStage == "flying") {
        this.currentState = "fly";
      } else {
        this.currentState = "walk";
      }
      if (this.game.keyIn("ArrowLeft")) {
        this.position.x -= this.movementSpeed;
      } else {
        this.position.x += this.movementSpeed;
      }
    } else {
      this.idle();
    }

    if (this.game.keyIn("ArrowUp")) {
      if (this.currentStage == "flying") {
        this.position.y -= this.movementSpeed;
        this.currentState = "fly";
      } else {
        this.currentState = "jump";
        this.velocity = -5;
      }
    }

    if (this.game.keyIn("ArrowDown")) {
      if (this.currentStage == "flying") {
        this.position.y += this.movementSpeed;
        this.currentState = "fly";
      }
    }
    //Shoot
    if (this.game.keyIn(" ")) {
      this.currentState = "shoot";
      if (gameFream % 20 == 0) {
        this.bullets.push(
          new Bullet(this.game, {
            x: this.position.x,
            y: this.position.y,
            direction: this.direction,
          })
        );
      }
    }

    this.spriteUpdate();
    this.sprite.update(gameFream);
    //Update Bullets
    for (let bullet of this.bullets) {
      bullet.update(gameFream);
      if (bullet.x + bullet.width > this.game.canvas.width || bullet.x < 0) {
        this.bullets.splice(this.bullets.indexOf(bullet), 1);
      }
    }
  }

  infly() {
    if (this.position.y < this.game.canvas.height - this.game.groundPosition) {
      return true;
    }
    return false;
  }

  spriteUpdate() {
    this.setSprite();

    //console.log(this.currentSpriteKey, this.currentStage, this.currentState);

    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.spriteSheet = this.currentSprite.img;
    this.sprite.freamSpeed = this.currentSprite.speed;
    this.sprite.freamXn = this.currentSprite.col;
    this.sprite.freamYn = this.currentSprite.row;
  }

  setSprite(init = false) {
    let nxtSpriteKey = "weapon_" + this.currentStage + "_" + this.currentState;
    if (!init && this.currentSpriteKey != nxtSpriteKey) {
      this.sprite.freamX = 0;
      this.sprite.freamY = 0;
    }
    this.currentSpriteKey = nxtSpriteKey;
    this.currentSprite = this.spritesData.sprites[this.currentSpriteKey];
  }

  idle() {
    this.currentState = "idle";
  }
}

class UI {
  constructor(game) {
    this.game = game;
    this.fontFamily = "Bangers";
    this.fontSize = "18";
    this.fontColor = "black";
    this.game.ctx.font = this.fontSize + "px " + this.fontFamily;
  }

  draw(context) {
    context.save();
    context.fillStyle = this.fontColor;
    context.fillText("Score: " + this.game.score, 10, 20);
    context.restore();
  } //Draw UI

  update(gameFream) { }
}

class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.gameFream = 0;
    this.keys = [];
    this.input = new InputHandler(this);
    this.groundPosition = 100;
    this.score = 0;
    this.enemies = [];
    this.particles = [];
    this.player = new Player(this, {
      //position: { x: 100, y: 0 }
      position: { x: 100, y: canvas.height / 2 + 150 },
    });
    this.EnemySpriteData = {
      path: "./assets/sprites/enemy/",
      type: "png",
      sprites: [
        {
          sprite_width: 360,
          sprite_height: 245,
          path: "enemy1",
          speed: 0.2,
          damage_per_hit: 10,
          scale: 0.5,
          state: {
            idle: {
              freamXn: 12,
              row: 0,
              speed: 6,
            },
            walk: {
              freamXn: 18,
              row: 1,
              speed: 4,
            },
            attack: {
              freamXn: 12,
              row: 2,
              speed: 5,
            },
            die: {
              freamXn: 15,
              row: 3,
              speed: 4,
            },
          },
        },
        {
          sprite_width: 360,
          sprite_height: 245,
          path: "enemy2",
          speed: 0.4,
          power: 150,
          scale: 0.7,
          damage_per_hit: 15,
          state: {
            idle: {
              freamXn: 12,
              row: 0,
              speed: 6,
            },
            walk: {
              freamXn: 18,
              row: 1,
              speed: 4,
            },
            attack: {
              freamXn: 12,
              row: 2,
              speed: 5,
            },
            die: {
              freamXn: 15,
              row: 3,
              speed: 4,
            },
          },
        },
        {
          sprite_width: 360,
          sprite_height: 245,
          path: "enemy3",
          speed: 0.3,
          power: 180,
          scale: .9,
          damage_per_hit: 25,
          state: {
            idle: {
              freamXn: 12,
              row: 0,
              speed: 6,
            },
            walk: {
              freamXn: 18,
              row: 1,
              speed: 4,
            },
            attack: {
              freamXn: 12,
              row: 2,
              speed: 5,
            },
            die: {
              freamXn: 15,
              row: 3,
              speed: 4,
            },
          },
        },
      ],
    };

    this.ui = new UI(this);
    this.gravity = 0.5;
    this.preloadEnemySprite();

    this.enemyAddInterval = Math.random() * 4000 + 5000;
    this.enemyAddTimer = 0;
  }

  keyIn(key = "") {
    if (this.keys.indexOf(key) > -1) {
      return true;
    }
    return false;
  }

  preloadEnemySprite() {
    for (let sprite in this.EnemySpriteData.sprites) {
      this.EnemySpriteData.sprites[sprite].img = new Image();
      this.EnemySpriteData.sprites[sprite].img.src =
        this.EnemySpriteData.path +
        this.EnemySpriteData.sprites[sprite].path +
        "." +
        this.EnemySpriteData.type;
    }
  }

  init() {
    this.player.preloadSprite();
  }

  draw() {
    this.player.draw(this.ctx);
    this.ui.draw(this.ctx);
    for (let enemy of this.enemies) {
      enemy.draw(this.ctx);
    }
    for (let particle of this.particles) {
      particle.draw(this.ctx);
    }
  }

  addNewEnemy() {
    this.enemyAddInterval = Math.random() * 4000 + 5000;
    this.enemies.push(
      new Enemy(this, {
        x: this.canvas.width + 10,
        y: this.canvas.height - this.groundPosition,
      })
    );
  }

  update(deltaTime) {
    //console.log(this.particles);
    this.deltaTime = deltaTime;
    this.gameFream += 1;
    //Enemy Add

    this.enemyAddTimer += 16.645; //Delta time
    if (
      this.enemyAddTimer >= this.enemyAddInterval &&
      this.enemies.length < 5
    ) {
      this.addNewEnemy();
      this.enemyAddTimer = 0;
    } //Enemy Add
    this.player.update(this.gameFream);
    this.ui.update(this.gameFream);

    for (let enemy of this.enemies) {
      if (
        this.collisionDetection(
          {
            x: this.player.position.x - (this.player.actualWidth / 2 - 35),
            y: this.player.position.y - this.player.actualHeight / 2,
            w: 100,// this.player.sprite.outFreamX,
            h: this.player.sprite.outFreamY,
          },
          {
            x: enemy.position.x,
            y: enemy.position.y,
            w: enemy.sprite.outFreamX,
            h: enemy.sprite.outFreamY,
          }
        )
      ) {
        enemy.speed = 0;
        enemy.setDerection();
        enemy.currentState = "attack";
      } else {
        enemy.speed = enemy.currentSprite.speed;
        enemy.currentState = "walk";
      }

      //Enemy Colision with bullets
      for (let bullet of this.player.bullets) {
        //console.log(bullet, enemy.position);
        if (bullet.x > enemy.position.x && enemy.life > 0) {
          enemy.life -= 20;
          enemy.gethurt();
          if (enemy.life <= 0) {
            this.score++;
          }
          this.player.bullets.splice(this.player.bullets.indexOf(bullet), 1);
        }
      }
      enemy.update(this.gameFream);
      //console.log(enemy);
      if (enemy.deletion == true) {
        // console("Enemy deleted");
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
      }
    }

    //Particles Update  
    for (let particle of this.particles) {
      particle.update(this.gameFream);
      if (particle.x > this.canvas.width || particle.y > this.canvas.height || particle.x < 0 || particle.y < 0) {
        this.particles.splice(this.particles.indexOf(particle), 1);
      }
    }
  }
  collisionDetection(rect1, rect2) {
    this.ctx.fillStyle = 'red';
    /*this.ctx.fillRect(
      rect1.x,
      rect1.y,
      rect1.w,
      rect1.h
    );*/


    if (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.h + rect1.y > rect2.y
    ) {
      return true;
    } else {
      return false;
    }
  }
}
