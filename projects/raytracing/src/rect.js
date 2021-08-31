import Shape from "./shape.js";

export default class Rect extends Shape{

    constructor(pos, colour, sides){

        super(pos, colour); 
        this.sides = sides;

    }

    distance(p){ //distance calculation for the spheretracing

        //half of the side lengths
        const w2 = this.sides.w/2;
        const h2 = this.sides.h/2;

        const A = p.x - this.pos.x;
        const B = p.y - this.pos.y;

        //coords of closest vertex to the point p
        const x = this.pos.x + (Math.abs(A * w2) / A);
        const y = this.pos.y + (Math.abs(B * h2) / B);

        //difference in each axis to the closest vertex
        const C = p.x - x; // c - a 
        const D = p.y - y; // d - b

        //when the circle touches a side
        if(p.x > this.pos.x - w2 && p.x < this.pos.x + w2){ return Math.abs(D); } 
        if(p.y > this.pos.y - h2 && p.y < this.pos.y + h2){ return Math.abs(C); }

        //when the circle touches a vertex
        return this.length({x: C, y: D});
    }

    collide(p){ //returns point of collision

        //half of the side lengths
        const w2 = this.sides.w/2;
        const h2 = this.sides.h/2;

        const A = p.x - this.pos.x;
        const B = p.y - this.pos.y;

        //coords of closest vertex to the point p
        const x = this.pos.x + (Math.abs(A * w2) / A);
        const y = this.pos.y + (Math.abs(B * h2) / B);

        //difference in each axis to the closest vertex
        const C = p.x - x; // c - a 
        const D = p.y - y; // d - b

        //when the circle touches a side
        if(p.x > this.pos.x - w2 && p.x < this.pos.x + w2){ return {x: p.x, y: y}; } 
        if(p.y > this.pos.y - h2 && p.y < this.pos.y + h2){ return {x: x, y: p.y}; }

        //when the circle touches a vertex
        return {x: x, y: y};

    }

    draw(ctx){

        ctx.fillStyle = `rgba(${this.colour.r}, ${this.colour.g}, ${this.colour.b})`;
        ctx.fillRect(this.pos.x - this.sides.w/2, this.pos.y - this.sides.h/2, this.sides.w, this.sides.h);

    }

}