export default class Rays{

    constructor(canvas){

        this.fov = Math.PI/2;
        this.instance = canvas.w;
        this.rays = []; //rays are simple object with only a start and an end (a line segment)
        this.radius = 50;
        this.stepLimit = 50;
        this.canvas = canvas;

    }

    update(heading, pos, scene){

        let theta, len, object, step, v, j;

        for(let i = 0; i < this.instance; i++){

            theta = heading - (this.fov / 2) + ((this.fov / (this.instance - 1)) * i);
            v = {x: pos.x, y: pos.y};
            len = 0;

            for(j = 0; j < this.stepLimit; j++){

                object = this.distance(scene, v);
                step = object.dist;

                v.x += Math.cos(theta) * step; //steps along each ray by the distance to the closest object
                v.y += Math.sin(theta) * step;
                len += step;

                if(step < 0.05){
                    break;
                }
            }

            this.rays[i] = { 
                p1: { x: pos.x, y: pos.y },
                p2: v,
                len: len,
                steps: j,
                colour: object.colour ? object.colour : {r: 0, g: 0, b: 0}
            };
        }

    }    

    distance(scene, v){

        let dist = 100000, temp, colour;

        scene.forEach(object =>{
            temp = object.distance({x: v.x, y: v.y});
            //dist = Math.min(dist, object.distance({x: v.x, y: v.y}));
            if(dist > temp){
                dist = temp;
                colour = object.colour;
            }
        });

        return {dist: dist, colour: colour};

    }

    draw(ctx){ //temp method 

        let x = 0, len, brightness, colour;

        this.rays.forEach(ray => {

            len = Math.max(this.canvas.h * (10 / (ray.len)), 0); //length of ray on screen

            brightness = 1 - Math.min((Math.pow(ray.steps, 1) / this.stepLimit), 1);

            colour = ray.colour;

            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(${colour.r * brightness}, ${colour.g * brightness}, ${colour.b * brightness})`;
            ctx.beginPath();
            ctx.moveTo(x, (this.canvas.h - len) / 2);
            ctx.lineTo(x, (this.canvas.h + len) / 2);
            ctx.stroke();
            x++;

        });

    }

}