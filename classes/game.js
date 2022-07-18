const spriteConfig = {
    "sprite_width": 881,
    "sprite_height": 639,
    "path": "./assets/sprites/",
    "type": "png",
    "sprites": {
        "player": {
            "weapon_flying": {
                "col": 5,
                "row": 3,
                "repeat": true,
                "speed": 4
            },
            "weapon_flying_die": {
                "col": 5,
                "row": 1,
                "repeat": false,
                "speed": 4
            },
            "weapon_flying_idle": {
                "col": 5,
                "row": 2,
                "repeat": true,
                "speed": 8
            },
            "weapon_flying_shoot": {
                "col": 5,
                "row": 2,
                "repeat": true,
                "speed": 3
            },
            "weapon_standing_die": {
                "col": 5,
                "row": 1,
                "repeat": false,
                "speed": 10,
                "offsetX": false
            },
            "weapon_standing_idle": {
                "col": 5,
                "row": 3,
                "repeat": true,
                "speed": 5
            },
            "weapon_standing_jump": {
                "col": 5,
                "row": 2,
                "repeat": false,
                "speed": 5
            },
            "weapon_standing_run": {
                "col": 5,
                "row": 3,
                "repeat": true,
                "speed": 2
            },
            "weapon_standing_shoot": {
                "col": 5,
                "row": 1,
                "repeat": true,
                "speed": 4
            },
            "weapon_standing_walk": {
                "col": 5,
                "row": 3,
                "repeat": true,
                "speed": 4
            }
        },
        "enemy": {

        }

    }
}

// Language: javascript
//state : {flying, standing}
//stage : {idle, run, jump, shoot, die}
let eventState = {
    state: "standing",
    stage: "idle"
}

class InputHandler {
    constructor(game) {
        this.game = game;
        this.keysUseable = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Shift'];
        window.addEventListener("keydown", (e) => {
            if (this.keysUseable.indexOf(e.key) > -1 && this.game.keys.indexOf(e.key) === -1) {
                this.game.keys.push(e.key);
            }
            console.log(this.game.keys);
        });

        window.addEventListener("keyup", (e) => {
            if (this.keysUseable.indexOf(e.key) > -1 && this.game.keys.indexOf(e.key) > -1) {
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
            }
            console.log(this.game.keys);
        });


    }
}

class EventHandler {
    constructor(e, prased) {
        this.prased = prased;
        this.e = e;
        this.stage = "idle";
        this.state = 'standing';
        if (this.e) {
            this.PlayerState();
        }
        this.direction = "right";

    }
    PlayerState() {
        if (this.e.key == "f") {
            if (this.state == "flying") {
                this.state = "standing";
            } else {
                this.state = "flying";
            }
        } else {
            switch (this.e.key) {
                case "ArrowRight":
                    if (this.prased) {
                        this.stage = this.state == "flying" ? "" : "run";
                    } else {
                        this.stage = this.state == "flying" ? "" : "walk";
                    }

                    this.direction = "right";
                    break
                case "ArrowLeft":
                    if (this.prased) {
                        this.stage = this.state == "flying" ? "" : "run";
                    } else {
                        this.stage = this.state == "flying" ? "" : "walk";
                    }
                    this.direction = "left";
                    break
                case "ArrowUp":
                    this.stage = this.state == "flying" ? "" : "jump";
                    break
            }
        }
    }

}

window.addEventListener('keyup', function (e) {
    eventState = new EventHandler(e);
})
window.addEventListener('keydown', function (e) {
    eventState = new EventHandler(e, true);
})

class Sprite {
    constructor(ctx, { ...args }) {
        this.ctx = ctx;
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

    draw() {
        //let image = this.spriteSheet;
        this.ctx.drawImage(
            this.spriteSheet,
            (this.freamX * this.freamWidth) + this.offsetX, //soyrce X
            this.freamY * this.freamHeight, //source Y
            this.freamWidth - this.offsetX,//source Width
            this.freamHeight,//source Height
            this.x, //Destination X
            this.y, //Destination Y
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
    constructor(ctx, spriteObjects) {
        this.ctx = ctx;
        this.spriteObjects = spriteObjects;
        this.EventHandler = new EventHandler();

        this.sprite = new Sprite(ctx,
            {
                x: 300,
                y: 500,
                spriteSheet: this.spriteObjects["weapon_standing_walk"],
                freamWidth: 881,
                freamHeight: 639,
                freamXn: 5,
                freamYn: 3,
                offsetX: 200,
                outFreamX: (881 / 4),
                outFreamY: (639 / 4),
                freamSpeed: 8
            }
        );


    }

    draw(gameFream) {
        //console.log(this.EventHandler);
        let spriteKey = "weapon_" + eventState.state + "_" + eventState.stage;
        let spriteSettings = spriteConfig.sprites.player[spriteKey]

        this.sprite.spriteSheet = this.spriteObjects[spriteKey];
        this.sprite.freamYn = spriteSettings.row;
        this.sprite.freamSpeed = spriteSettings.speed;
        this.sprite.freamXn = spriteSettings.col;

        if (!spriteSettings.offsetX) {
            this.sprite.offsetX = 0;
        }

        this.sprite.update(gameFream);
        this.sprite.draw();
    }
}

class Enemy {
    constructor() {

    }
}




class Game {
    constructor(canvas) {
        this.spriteConfig = spriteConfig;
        this.spriteObjects = [];
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.gameFream = 0;
        this.keys = [];
        this.input = new InputHandler(this);
    }

    preloadAssets() {
        let sprites = this.spriteConfig.sprites;
        for (let key in sprites) {
            let spriteGroup = sprites[key];
            for (let nme in spriteGroup) {
                let sprite_sheet = new Image();
                sprite_sheet.src = this.spriteConfig.path + nme + "." + this.spriteConfig.type;
                this.spriteObjects[nme] = sprite_sheet;
            }
        }
        return this.spriteObjects;
    }

    play() {
        this.player = new Player(this.ctx, this.spriteObjects);
    }

    anim() {
        this.gameFream += 1;
        this.player.draw(this.gameFream);
    }

}