let canvas = document.getElementById("canvas");
let loader = document.querySelector("#loading");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let game = new Game(canvas);
game.init();//Preload All assets before starting the game

window.onload = function () {
    loader.remove();
    gameLoop();
    //console.log(game);
}

let lastTime = 0;
function gameLoop(time) {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    let deltaTime = time - lastTime;
   // console.log(deltaTime);
    lastTime = time;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(gameLoop);
}
