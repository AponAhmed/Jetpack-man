


class InputHandler {
    constructor(game) {
        this.game = game;
        this.keysUseable = ['f', 'd', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Shift'];

        window.addEventListener("keydown", (e) => {
            if (this.keysUseable.indexOf(e.key) > -1 && this.game.keys.indexOf(e.key) === -1) {
                this.game.keys.push(e.key);
            }
        });

        window.addEventListener("keyup", (e) => {
            if (this.keysUseable.indexOf(e.key) > -1 && this.game.keys.indexOf(e.key) > -1) {
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
    }

    draw(ctx) {

        /*ctx.fillStyle = 'red';
        ctx.fillRect(
            (this.x - this.outFreamX / 2),
            (this.y - this.outFreamY / 2),
            this.outFreamX,
            this.outFreamY
        );
        */
        //let image = this.spriteSheet;
        ctx.drawImage(
            this.spriteSheet,
            (this.freamX * this.freamWidth) + this.offsetX, //soyrce X
            this.freamY * this.freamHeight, //source Y
            this.freamWidth - this.offsetX,//source Width
            this.freamHeight,//source Height
            (this.x - this.outFreamX / 2), //Destination X
            (this.y - this.outFreamY / 2), //Destination Y
            this.outFreamX, //Destination Width
            this.outFreamY //Destination Height
        );

        //console.log(this.freamX, this.freamY);
    }

    update(gameFream) {

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


class Player {
    constructor(game, { position }) {
        this.game = game;
        this.spritesData = {
            sprite_width: 881,
            sprite_height: 639,
            path: "./assets/sprites/",
            type: "png",
            sprites: {
                weapon_flying_fly: {
                    col: 5,
                    row: 3,
                    repeat: true,
                    speed: 4
                },
                weapon_flying_die: {
                    col: 5,
                    row: 1,
                    repeat: false,
                    speed: 4
                },
                weapon_flying_idle: {
                    col: 5,
                    row: 2,
                    repeate: true,
                    speed: 8
                },
                weapon_flying_shoot: {
                    col: 5,
                    row: 2,
                    repeate: true,
                    speed: 3
                },
                weapon_standing_die: {
                    col: 5,
                    row: 1,
                    repeate: false,
                    speed: 10,
                    offsetX: false
                },
                weapon_standing_idle: {
                    col: 5,
                    row: 3,
                    repeate: true,
                    speed: 5
                },
                weapon_standing_jump: {
                    col: 5,
                    row: 2,
                    repeate: false,
                    speed: 5
                },
                weapon_standing_run: {
                    col: 5,
                    row: 3,
                    repeate: true,
                    speed: 2
                },
                weapon_standing_shoot: {
                    col: 5,
                    row: 1,
                    repeate: true,
                    speed: 4
                },
                weapon_standing_walk: {
                    col: 5,
                    row: 3,
                    repeate: true,
                    speed: 4
                }
            }
        };
        this.currentStage = "standing";
        this.currentState = "idle";
        this.setSprite(true)
        this.position = position;
        this.scale = .30;
        this.movementSpeed = 2;
        this.velocity = 0;


    }

    preloadSprite() {
        for (let sprite in this.spritesData.sprites) {
            this.spritesData.sprites[sprite].img = new Image();
            this.spritesData.sprites[sprite].img.src = this.spritesData.path + sprite + "." + this.spritesData.type;
        }
        this.sprite = new Sprite(
            {
                x: this.position.x,
                y: this.position.y,
                spriteSheet: this.currentSprite.img,
                freamWidth: this.spritesData.sprite_width,
                freamHeight: this.spritesData.sprite_height,
                freamXn: this.currentSprite.col,
                freamYn: this.currentSprite.row,
                offsetX: this.currentSprite.offsetX,
                offsetY: this.currentSprite.offsetY,
                outFreamX: (this.spritesData.sprite_width * this.scale),
                outFreamY: (this.spritesData.sprite_height * this.scale),
                freamSpeed: this.currentSprite.speed
            }
        );
    }

    draw(context) {
        //context.save();
        //context.rotate(20 * Math.PI / 180);
        this.sprite.draw(context);
        //context.restore();
    }

    update(gameFream) {

        //Derection Of Player 
        if (this.game.keyIn('ArrowLeft')) {
            this.direction = "left";
        } else if (this.game.keyIn('ArrowRight')) {
            this.direction = "right";
        }

        //stage Switch
        if (this.game.keyIn('f')) {
            this.currentStage = "flying";
            this.velocity = -10;
        }
        if (this.game.keyIn('d')) {
            this.currentStage = "standing";
            this.velocity = 1;
        }

        //State Of Player
        if ((this.game.keyIn('ArrowLeft') || this.game.keyIn('ArrowRight')) && this.game.keyIn('Shift')) {
            if (this.currentStage == "flying") {
                this.currentState = "fly";
            } else {
                this.currentState = "run";
            }
            if (this.game.keyIn('ArrowLeft')) {
                this.position.x -= this.movementSpeed * 2;
            } else {
                this.position.x += this.movementSpeed * 2;
            }

        } else if (this.game.keyIn('ArrowLeft') || this.game.keyIn('ArrowRight')) {
            if (this.currentStage == "flying") {
                this.currentState = "fly";
            } else {
                this.currentState = "walk";
            }
            if (this.game.keyIn('ArrowLeft')) {
                this.position.x -= this.movementSpeed;
            } else {
                this.position.x += this.movementSpeed;
            }
        } else {
            this.idle();
        }

        if (this.game.keyIn('ArrowUp')) {
            if (this.currentStage == "flying") {
                this.position.y -= this.movementSpeed;
                this.currentState = "fly";

            } else {
                this.currentState = "jump";
                this.velocity = -8;
            }
        }

        if (this.game.keyIn('ArrowDown')) {
            if (this.currentStage == "flying") {
                this.position.y += this.movementSpeed;
                this.currentState = "fly";
            }
        }
        //Shoot 
        if (this.game.keyIn(' ')) {
            this.currentState = "shoot";
        }

        if (this.currentstage == "flying" && this.position.y < (this.game.canvas.height / 2)) {
            if (this.position.y >= (this.game.canvas.height / 2)) {
                this.velocity = 0;
            }
        }

        if (this.velocity !== 0) {
            let v = this.velocity += this.game.gravity;
            this.position.y += v;
        }

        if (this.position.y >= (this.game.canvas.height - this.game.groundPosition)) {
            this.velocity = 0;
        }


        this.spriteUpdate();
        this.sprite.update(gameFream);
    }

    infly() {
        if (this.position.y < (this.game.canvas.height - this.game.groundPosition)) {
            return true
        }
        this.velocity = 0;
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
        this.currentSpriteKey = nxtSpriteKey
        this.currentSprite = this.spritesData.sprites[this.currentSpriteKey];

    }

    idle() {
        this.currentState = "idle";
    }
}

class Enemy {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        };
        this.scale = .30;
    }
}




class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.gameFream = 0;
        this.keys = [];
        this.input = new InputHandler(this);
        this.groundPosition = 100;

        this.player = new Player(
            this,
            {
                position: { x: 100, y: canvas.height - this.groundPosition }
                //position: { x: canvas.width / 2, y: canvas.height / 2 }
            }
        );
        this.gravity = .2;

    }

    keyIn(key = '') {
        if (this.keys.indexOf(key) > -1) {
            return true;
        }
        return false;
    }

    init() {
        this.player.preloadSprite();
    }

    draw() {
        this.player.draw(this.ctx);

    }

    update() {
        this.gameFream += 1;
        this.player.update(this.gameFream);
    }

}