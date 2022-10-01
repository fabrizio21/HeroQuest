class GameObject {
    constructor(config) {

        this.id = null;

        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "./images/characters/people/barbarian.png",  //!!!
            //src: config.src || "./images/characters/people/slime_green.png",
            
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];
    }

    
    mount(map) {
        this.isMounted = true;
        map.addWall(this.x, this.y);

        //if we havea beahvior, kick off after a short dealy
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10)
    }


    update() {

    }

    async doBehaviorEvent(map) {

        if(map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }

        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        // create an event instance
        const eventHandler = new OverworldEvent({ map, event: eventConfig});
        await eventHandler.init();

        // setting the next event to fire
        this.behaviorLoopIndex += 1;
        if(this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        } 

        // do it again
        this.doBehaviorEvent(map);
    }
}

