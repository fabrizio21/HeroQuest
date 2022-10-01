class Sprite {
    constructor(config){

        // Set up image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        };

        // Shadow
        this.shadow = new Image();
        this.useShadow = true; // config.useDhadow || false
        if(this.useShadow) {
           this.shadow.src = "./images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        };
        

        // Configure animation & initial sprite
        this.animations = config.animations || {
            "idle-down"     : [ [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0] ],
            "idle-right"    : [ [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0] ],
            "idle-up"       : [ [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0] ],
            "idle-left"     : [ [0,2], [1,2], [2,2], [3,2], [4,2], [5,2], [6,2], [7,2] ],
            "walk-down"     : [ [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1] ],
            "walk-up"       : [ [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1] ],
            "walk-right"    : [ [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1] ],
            "walk-left"     : [ [0,3], [1,3], [2,3], [3,3], [4,3], [5,3], [6,3], [7,3] ]
            ,"attack-right"  : [ [0,4], [1,4], [2,4], [3,4], [4,4], [5,4] ]
        }
        this.currentAnimation = "idle-right"; //config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 4;//8;     // animation speed, the higher the slower
        this.animationFrameProgress = this.animationFrameLimit;

        // refernce the game object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
        // se la direzione è cambiata
        if(this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;     // resetta il contatore frame
        }
    }

    updateAnimationProgress() {
        // downtick frame progress
        if(this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame +=1;

        if(this.frame === undefined)
            this.currentAnimationFrame = 0;
    }

    draw(ctx, cameraPerson) {

        // positions the sprte based on camera person
        const x = ( this.gameObject.x - 8 )  + (utils.withGrid(10.5) - cameraPerson.x);
        const y = ( this.gameObject.y - 18 ) + (utils.withGrid(6) - cameraPerson.y);

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

        const[frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
            frameX * 32, frameY * 32,
            32,32,
            x, y,
            32, 32);

        this.updateAnimationProgress();
    }
}