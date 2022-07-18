let canvas = document.getElementById("canvas");
let loader = document.querySelector("#loading");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let game = new Game(canvas);
game.init();//Preload All assets before starting the game

window.onload = function () {
    loader.remove();
    animation();
    //console.log(game);
}


function animation() {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.update();
    game.draw();
    window.requestAnimationFrame(animation);
}