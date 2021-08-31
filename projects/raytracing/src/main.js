import Circle from "./circle.js";
import Player from "./player.js";
import Rays from "./rays.js";
import Rect from "./rect.js";
import Maze from "./maze.js";

var canvas = document.getElementById("canvas"); //links the script to the canvas in html
var ctx = canvas.getContext("2d"); //sets renderer context

let dt = 0, pt = 0;
let rays = new Rays({w: canvas.width, h: canvas.height});
let player = new Player();
let maze = new Maze(20, 20, [19, 1]);

maze.initialize();
maze.generate();

maze.cells[1][1] = true; 
maze.cells[maze.cells.length - 2][maze.cells[0].length - 2] = true; 

let scene = {objects: [], size: 12, w: 0, h: 0};

scene.h = (maze.cells.length - 1) * scene.size;
scene.w = (maze.cells[0].length - 1) * scene.size;

for(let j = 1; j < maze.cells.length - 1; j++){
    for(let i = 1; i < maze.cells[j].length - 1; i++){

        if(!maze.cells[j][i]){
            if(Math.random() >= 0.5){
                scene.objects.push(new Rect(
                    {x: i * scene.size, y: j * scene.size}, 
                    {r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255}, 
                    {w: scene.size, h: scene.size}
                    ));
            }else{
                scene.objects.push(new Circle(
                    {x: i * scene.size, y: j * scene.size}, 
                    {r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255}, 
                    scene.size/(Math.random() + 2)
                    ));
            }
        }
    }
}

const wallColour = {r: 255, g: 255, b: 255};

//four walls
scene.objects.push(new Rect({x: 0, y: scene.h/2 + scene.size}, wallColour, {w: scene.size, h: scene.h - scene.size})); //left vertical
scene.objects.push(new Rect({x: scene.w/2, y: 0}, wallColour, {w: scene.w + scene.size, h: scene.size}));//top
scene.objects.push(new Rect({x: scene.w, y: scene.h/2 - scene.size}, wallColour, {w: scene.size, h: scene.h - scene.size})); //right vertical
scene.objects.push(new Rect({x: scene.w/2, y: scene.h}, wallColour, {w: scene.w + scene.size, h: scene.size}));//bottom

function drawScene(){ //render 2d scene

    // let dist = 1000000;

    scene.objects.forEach(object =>{
        object.draw(ctx);
        //dist = Math.min(dist, object.distance({x: player.pos.x, y: player.pos.y}));
    });

    // ctx.strokeStyle = "#ffffff";
    // ctx.beginPath();
    // ctx.arc(player.pos.x, player.pos.y, dist, 0, 2 * Math.PI);
    // ctx.stroke(); 

    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.size, 0, 2 * Math.PI);
    ctx.stroke(); 
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

        player.update(dt, scene);
        rays.update(player.heading, {x: player.pos.x, y: player.pos.y}, scene);

    }

    rays.draw(ctx);
    //drawScene();

    requestAnimationFrame(mainLoop);
}

mainLoop();