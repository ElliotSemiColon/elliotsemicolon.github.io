import Shape from "./shape.js";

export default class Circle extends Shape{

    constructor(pos, colour, radius){

        super(pos, colour); 
        this.radius = radius;

    }

    distance(p){ return this.length({x: this.pos.x - p.x, y: this.pos.y - p.y}) - this.radius; }

    draw(ctx){

        ctx.fillStyle = `rgba(${this.colour.r}, ${this.colour.g}, ${this.colour.b})`;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(); 

    }

}