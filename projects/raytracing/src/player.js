export default class Player{

    constructor(){

        this.heading = 0;
        this.pos = {x: 10, y: 10};
        this.vel = {r: 0, l: 0}; //angular (rotational), linear
        this.speed = {r: 0.00002, l: 0.001};
        this.friction = 0.2;

        this.input = { w: 0, s: 0, a: 0, d: 0, //keeps track of control key states
                       r: 0, l: 0 };

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

    update(dt){

        //modify angular and linear velocity whilst slowing with no input
        this.vel.r = (1 - this.friction) * (this.vel.r + (this.input.r * dt * this.speed.r)); 
        this.vel.l = (1 - this.friction) * (this.vel.l + (this.input.l * dt * this.speed.l)); 

        this.heading += this.vel.r * dt;
        this.pos.x += Math.cos(this.heading) * this.vel.l * dt;
        this.pos.y += Math.sin(this.heading) * this.vel.l * dt;
    }

}