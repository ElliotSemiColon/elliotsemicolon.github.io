export default class Maze{

    constructor(w, h, start){

        //functional attributes
        this.cells = []; //let false be a wall, and true be a path cell (analogous to whether a cell is traversable or not)
        this.stack = []; //stack of cell grid references
        this.size = {w: w, h: h};

        this.current; //current cell
        this.next; //next cell
        this.dirqueue = [];

        this.start = start;

        // aesthetic attributes 
        this.palette = 
        { 
            path: {r: 125, g: 125, b: 125},
            wall: {r: 0, g: 0, b: 0},
            entrance: {r: 255, g: 10, b: 10},
            stack: {r: 100, g: 100, b: 255},
            current: {r: 255, g: 255, b: 0},
            exit: {r: 0, g: 255, b: 10}
        };

        // entrance and exit attributes

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

    generate(){ 

        while(this.stack.length > 0){

            let valids, choice, cell;

            this.current = this.stack.pop(); 

            valids = this.validNeighbours(this.current);

            //removes nulls
            for(let i = 0; i < valids.length; i++){
                if(valids[i] == null){ 
                    valids.splice(i, 1); 
                    i--;
                } 
            }

            if(valids.length > 0){ //if it's found somewhere to go
                this.stack.push(this.current); //add the current cell to stack

                choice = Math.ceil(Math.random() * valids.length) - 1; //pick a random direction
                cell = valids[choice];

                this.cells[cell[1]][cell[0]] = true;

                this.next = [cell[0], cell[1]];

                this.stack.push(this.next); //add the pathway to the stack (gets popped in the next iteration)
            }
        }
    }

    bias(valids, dirWeights){ //adds another of every direction you want to bias

        for(let i = 0; i < valids.length; i++){
            for(let j = 0; j < dirWeights.length; j++){
                if(`${valids[i]}` == `${dirWeights[j][0]}`){ 
                    for(let k = 1; k < dirWeights[j][1]; k++){ // ok yeah three for loops is bad but the most iterations it will ever do is 3 * 4 * n where n is the average weighting of all directions
                        valids.splice(i + 1, 0, valids[i]);
                        //console.log("biased");
                        i++;
                    }
                }
            }
        }

        return valids;

    }

    validNeighbours(cell){

        let x = cell[0], y = cell[1];

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

        valids = this.bias(valids, [ //direction, number of times direction appears in valids list (effective weighting)
                                   [[x + 1, y], 1], //right
                                   [[x, y + 1], 1], //down
                                   [[x - 1, y], 1], //left
                                   [[x, y - 1], 1]  //up
                                   ]);

        return valids;
    }

    entranceExit(){

        if(this.next[0] >= this.exit[0] && this.next[1] <= this.exit[1]){
            this.exit = this.next;
        }

        if(this.next[0] <= this.entrance[0] && this.next[1] >= this.entrance[1]){
            this.entrance = this.next;
        }

    }

    toIndex(coords){ // converts a grid reference to an index in the flat pixel array of the canvas
        return (coords[0] + coords[1] * this.size.w) * 4; 
    }

}