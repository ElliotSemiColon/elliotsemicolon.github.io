import Maze from "./maze.js"

var canvas = document.getElementById("canvas"); //links the script to the canvas in html
var ctx = canvas.getContext("2d"); //sets renderer context


let maze = new Maze(canvas.width, canvas.height, [1,1]);
let dt, pt;
let frame, data, index, frameID = 0;

initialize();
maze.initialize();

function pushFrame(){

    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = frame.data;

    for(let j = 0; j < canvas.height; j++){
        for(let i = 0; i < canvas.width; i++)
        {
            if(maze.cells[j][i]){
                data = colour([i, j], maze.palette.path, data);
            }else{ data = colour([i, j], maze.palette.wall, data); }
        }
    }

    maze.stack.forEach(cell => {
        data = colour(cell, maze.palette.stack, data);
    });

    if(maze.stack.length > 0){ 
        data = colour(maze.stack[maze.stack.length - 1], maze.palette.current, data);
    } //set blue

    data = colour(maze.entrance, maze.palette.entrance, data);
    data = colour(maze.exit, maze.palette.exit, data);

    ctx.putImageData(frame, 0, 0);

}

function colour(coords, rgb, data){

    let index = (coords[0] + coords[1] * canvas.width) * 4;

    data[index] = rgb.r;
    data[index + 1] = rgb.g;
    data[index + 2] = rgb.b;

    return data;

}

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

    for(let i = 0; i < 10; i++){
        if(maze.stack.length > 0){ maze.generate(); }
    }

    if(frameID % 1 == 0){ pushFrame(); } //displays maze cells to canvas

    frameID++;
    requestAnimationFrame(mainLoop);
    //setTimeout(() => {requestAnimationFrame(mainLoop);}, 100);
}

mainLoop();