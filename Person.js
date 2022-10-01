class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isStanding = false;

        this.direction = "right";

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state){

        if(this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {

            // more cases to come
            /*
            if(this.isPlayerControlled && state.arrow === "attack") {
                this.startBehavior(state, {
                    type: "attack",
                    direction: state.arrow
                });
            }*/

            if(!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                // case: we're keyboard ready and have an arrow pressed
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                });
            }
            this.updateSprite(state);
        }
    }

    startBehavior(state, behavior){

/*
        if(behavior.type === "attack"){
            this.movingProgressRemaining = 16;
        }
        */
        if(behavior.type === "walk") {
            // set character direction to whatever bevavior has
            this.direction = behavior.direction;

            // stop here if space is not free
            if(state.map.isSpaceTaken(this.x, this.y, this.direction)){

                behavior.retry && setTimeout(() => {
                    this.startBehavior(state, behavior);
                }, 10)

                return;
            }
            // ready to walk
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = 16;
            this.updateSprite(state);
        }

        if(behavior.type === "stand") {
            this.isStanding = true;
            console.log("startBehavior", state, behavior);
            setTimeout(() => {
                utils.emitEvent("PersonStandComplete", {
                    whoId: this.id
                })
                this.isStanding = false;
            }, behavior.time)
        }
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        //console.log( this.directionUpdate[this.direction],property,change);
        this[property] += change;
        this.movingProgressRemaining -= 1;

        if(this.movingProgressRemaining === 0) {
            utils.emitEvent("PersonWalkingComplete", {
                whoId: this.id
            })
        }
    }
    
    updateSprite(state) {
        if(this.movingProgressRemaining > 0) {
            //if(state.arrow === "attack")
             //   this.sprite.setAnimation("attack-" + this.direction);
            //else
                this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction);    
    }
}