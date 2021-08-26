import Maze from "./maze.js"

var canvas = document.getElementById("canvas"); //links the script to the canvas in html
var ctx = canvas.getContext("2d"); //sets renderer context


let maze = new Maze(canvas.width, canvas.height, [1,1]);
let dt, pt;
let frame, data, index, frameID = 0, speed = 1000;

initialize();
maze.initialize();

function initialize(){

    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = frame.data;

    for(let j = 0; j < canvas.height; j++){
        for(let i = 0; i < canvas.width; i++)
        {
            index = (i + j * canvas.width) * 4;
            data[index + 3] = 255;
        }
    }

    ctx.putImageData(frame, 0, 0);

}

function mainLoop(timestamp){

    dt = timestamp - pt;
    pt = timestamp;

    for(let i = 0; i < speed; i++){
        if(maze.stack.length > 0){ 
            maze.generate();
        }
    }

    maze.draw(ctx);

    frameID++;
    requestAnimationFrame(mainLoop);
    //setTimeout(() => {requestAnimationFrame(mainLoop);}, 100);
}

mainLoop();