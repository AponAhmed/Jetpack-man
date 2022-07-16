let canvas = document.getElementById("canvas");
let loader = document.querySelector("#loading");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let game = new Game(canvas);
game.preloadAssets();

window.onload = function () {
    loader.remove();
    game.play();
    animation();
}


function animation() {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.anim();
    //fream++;
    //handleCircle();
    window.requestAnimationFrame(animation);
}