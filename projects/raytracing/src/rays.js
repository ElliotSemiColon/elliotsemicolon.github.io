export default class Rays{

    constructor(canvas){

        this.fov = Math.PI/1.5;
        this.instance = canvas.w;
        this.rays = []; //rays are simple object with only a start and an end (a line segment)
        this.stepLimit = 30; //maximum distance calculations per ray
        this.viewDistance = 200; 
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
                len += step;

                v.x += Math.cos(theta) * step; //steps along each ray by the distance to the closest object
                v.y += Math.sin(theta) * step;

                if(step < 0.05){
                    break;
                }
                if(len > this.viewDistance) { j = this.stepLimit; }
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

        scene.objects.forEach(object =>{
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

            brightness = 1 - Math.min((ray.steps / this.stepLimit), 1); //brightness of ray 

            colour = ray.colour; //colour of ray

            //draw one ray
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