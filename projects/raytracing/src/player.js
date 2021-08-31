export default class Player{

    constructor(){

        this.heading = 0;
        this.pos = {x: -15, y: 15};
        this.vel = {r: 0, l: 0}; //angular (rotational), linear
        this.speed = {r: 0.0012, l: 0.01};
        this.friction = 0.3;

        this.input = { w: 0, s: 0, a: 0, d: 0, //keeps track of control key states
            r: 0, l: 0 };

        //collision stuff
        this.size = 3;
    }

    keystroke(code, state){ //keycode, on is 1 or 0

        switch(code){
            case 65: //A
                this.input.a = state;
                break;
            case 68: //D
                this.input.d = state;
                break;
            case 83: //S
                this.input.s = state;
                break;
            case 87: //W
                this.input.w = state;
                break;
            default:
                return;
        }

        //cancels movement if an opposing pair is pressed
        this.input.r = this.input.d - this.input.a;
        this.input.l = this.input.w - this.input.s;

    }

    update(dt, scene){

        //modify angular and linear velocity whilst slowing with no input
        this.vel.r = (1 - this.friction) * (this.vel.r + (this.input.r * this.speed.r)); 
        this.vel.l = (1 - this.friction) * (this.vel.l + (this.input.l * this.speed.l)); 

        this.heading += this.vel.r * dt;

        this.pos.x += Math.cos(this.heading) * this.vel.l * dt;
        this.pos.y += Math.sin(this.heading) * this.vel.l * dt;

        this.collide(scene); //resolves position should the player be colliding

    }

    collide(scene){ //handles player collisions with objects in the scene
    
        let objects = []; //objects player colliding with
        let p = {x: 0, y: 0}; //point of collision, vector of difference in position

        scene.objects.forEach(object =>{ 
            if(object.distance({x: this.pos.x, y: this.pos.y}) < this.size){ objects.push(object); } //if objects within radius of player
        });

        objects.forEach(shape =>{ //loops through all shapes colliding with player in one frame, resolving coordinates and avoiding any jitter
            // if rectangle
            if(shape.constructor.name == "Rect"){ //fully encompases a static collision response for a rectangle

                p = shape.collide({x: this.pos.x, y: this.pos.y}); //get point of collision on rectangle (nearest point to player)
                this.resolve(p, this.size);
            }

            if(shape.constructor.name == "Circle"){ 

                p = shape.pos;
                this.resolve(p, this.size + shape.radius);
            }
        });

    }

    resolve(p, dist){ //takes point to move from and distance to move the player

        const dx = p.x - this.pos.x; 
        const dy = p.y - this.pos.y;

        const theta = Math.atan2(dy, dx); //angle of line between player and collision point

        this.pos.x = p.x - (Math.cos(theta) * dist); //move player along the line of collision to a point 1 player radius away 
        this.pos.y = p.y - (Math.sin(theta) * dist);

    }

}