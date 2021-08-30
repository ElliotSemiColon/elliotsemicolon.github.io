export default class Shape{

    constructor(pos, colour){

        this.pos = pos;
        this.colour = colour;

    }

    length(v){ return Math.sqrt(v.x * v.x + v.y * v.y); }

}