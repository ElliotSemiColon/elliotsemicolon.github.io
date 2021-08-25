export default class Maze{

    constructor(w, h, start){

        //functional attributes
        this.cells = []; //let false be a wall, and true be a path cell (analogous to whether a cell is traversable or not)
        this.stack = []; //stack of cell grid references
        this.size = {w: w, h: h};
        this.current; //current cell
        this.complete = false;
        this.start = start;

        // aesthetic attributes 
        this.palette = 
        { 
            path: {r: 25, g: 25, b: 25},
            wall: {r: 0, g: 0, b: 0},
            entrance: {r: 255, g: 10, b: 10},
            stack: {r: 100, g: 100, b: 255},
            current: {r: 255, g: 255, b: 0},
            exit: {r: 0, g: 255, b: 10}
        };
        this.entrance = [w - 2, 1];
        this.exit = [1, h - 2];

    }

    initialize(){

        let row = [];

        for(let j = 0; j < this.size.h; j++){
            for(let i = 0; i < this.size.w; i++){
                row.push(false);
            }
            this.cells.push(row);
            row = [];
        }

        this.cells[this.start[1]][this.start[0]] = true;
        this.stack.push(this.start);

        // console.log(`maze initialised`);
        // console.log(this.cells);

    }

    generate(){ //one step of the generation (randomized depth-first search)

        let valids, choice, next;

        // look at last visited cell 
        // if backtracking, pop from stack until either you find a direction you can go in, or return to the start
        // if it ends up back at the start, the stack will be fully diminished

        this.current = this.stack.pop(); 

        valids = this.validNeighbours(this.current);
        //removes nulls
        for(let i = 0; i < valids.length; i++){
            if(valids[i] == null){ 
                valids.splice(i, 1); 
                i--;
            } 
        }

        //console.log(valids);

        if(valids.length > 0){ //if its found somewhere to go

            this.stack.push(this.current); //add the current cell to stack

            choice = Math.ceil(Math.random() * valids.length) - 1; //pick a random direction
            //console.log(choice, valids);
            try{ this.cells[valids[choice][1]][valids[choice][0]] = true; } catch(e) { console.log(this.stack); } //set the choice to a pathway
            
            next = [valids[choice][0], valids[choice][1]];

            this.stack.push(next); //add the pathway to the stack (gets popped in the next iteration)
            this.entranceExit(next);

        }

    }

    validNeighbours(cell){

        let x = cell[0], y = cell[1];
        let tx, ty; //temp values

        // possible directions
        let valids = [[x + 1, y], 
                      [x, y + 1], 
                      [x - 1, y], 
                      [x, y - 1]]; 

        // checks all directions to remove the option to go back the way it came
        for(let i = 0; i < 4; i++){ 
            if(this.cells[valids[i][1]][valids[i][0]]){ valids[i] = null; }
        }

        // four diagonals (eliminate the most paths)
        if(this.cells[y + 1][x + 1]){ valids[0] = valids[1] = null; }
        if(this.cells[y + 1][x - 1]){ valids[1] = valids[2] = null; }
        if(this.cells[y - 1][x - 1]){ valids[2] = valids[3] = null; }
        if(this.cells[y - 1][x + 1]){ valids[3] = valids[0] = null; }

        //check three to the right
        try{ if(this.cells[y - 1][x + 2] || this.cells[y][x + 2] || this.cells[y + 1][x + 2] || this.cells[y][x + 2] == undefined){ valids[0] = null; } }catch(e){ valids[0] = null; } //catch catches border conditions
        try{ if(this.cells[y + 2][x + 1] || this.cells[y + 2][x] || this.cells[y + 2][x - 1] || this.cells[y + 2][x] == undefined){ valids[1] = null; } }catch(e){ valids[1] = null; }
        try{ if(this.cells[y + 1][x - 2] || this.cells[y][x - 2] || this.cells[y - 1][x - 2] || this.cells[y][x - 2] == undefined){ valids[2] = null; } }catch(e){ valids[2] = null; }
        try{ if(this.cells[y - 2][x - 1] || this.cells[y - 2][x] || this.cells[y - 2][x + 1] || this.cells[y - 2][x] == undefined){ valids[3] = null; } }catch(e){ valids[3] = null; }

        return valids;
    }

    entranceExit(cell){

        if(cell[0] >= this.exit[0] && cell[1] <= this.exit[1]){
            this.exit = cell;
        }

        if(cell[0] <= this.entrance[0] && cell[1] >= this.entrance[1]){
            this.entrance = cell;
        }

    }

}