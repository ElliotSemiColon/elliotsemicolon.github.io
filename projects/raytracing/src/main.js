import Circle from "./circle.js";
import Player from "./player.js";
import Rays from "./rays.js";
import Rect from "./rect.js";

var canvas = document.getElementById("canvas"); //links the script to the canvas in html
var ctx = canvas.getContext("2d"); //sets renderer context

let dt = 0, pt = 0;
let rays = new Rays({w: canvas.width, h: canvas.height});
let player = new Player();

let scene = [
    new Rect({x: 128, y: 0}, {r: 100, g: 100, b: 100}, {w: 256, h: 5}),
    new Rect({x: 0, y: 72}, {r: 100, g: 100, b: 100}, {w: 5, h: 144}),
    new Rect({x: 128, y: 144}, {r: 100, g: 100, b: 100}, {w: 256, h: 5}),
    new Rect({x: 256, y: 72}, {r: 100, g: 100, b: 100}, {w: 5, h: 144}),

    new Rect({x: 100, y: 20}, {r: 100, g: 10, b: 100}, {w: 200, h: 5}),
    new Rect({x: 100, y: 50}, {r: 100, g: 10, b: 100}, {w: 10, h: 50}),
    new Rect({x: 30, y: 50}, {r: 155, g: 150, b: 100}, {w: 30, h: 10}),
    new Circle({x: 100, y: 80}, {r: 255, g: 10, b: 10}, 10),
    new Circle({x: 140, y: 35}, {r: 100, g: 100, b: 255}, 20),
    new Circle({x: 240, y: 35}, {r: 100, g: 10, b: 255}, 5),
    new Circle({x: 140, y: 100}, {r: 100, g: 10, b: 255}, 15)
];

function drawScene(){

    let dist = 1000000;

    scene.forEach(object =>{
        object.draw(ctx);
        dist = Math.min(dist, object.distance({x: player.pos.x, y: player.pos.y}));
    });

    //ctx.beginPath();
    //ctx.arc(player.pos.x, player.pos.y, dist, 0, 2 * Math.PI);
    //ctx.stroke(); 

}

// let square = new Rect({x: 100, y: 50}, "#445522", {w: 10, h: 20});
// let circle = new Circle({x: 100, y: 50}, "#445522", 10);

//keylisteners

document.body.addEventListener("keydown", function (e) { player.keystroke(e.keyCode, 1); });
document.body.addEventListener("keyup", function (e) { player.keystroke(e.keyCode, 0); });

function mainLoop(timestamp){

    dt = timestamp - pt;
    pt = timestamp;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    if(dt){

        player.update(dt);
        rays.update(player.heading, {x: player.pos.x, y: player.pos.y}, scene);

    }

    rays.draw(ctx);
    //drawScene();

    requestAnimationFrame(mainLoop);
}

mainLoop();