class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    startGameLoop() {
        const step = () => {
            
            // Clears off the canvas
            this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

            // Establish the camera person
            const cameraPerson = this.map.gameObjects.hero;

            // Updates all objects (to eliminate lags)
            // todo: però così velocizza il giocatore
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                });
            })
            

            // Draws lower layer
            this.map.drawLowerImage(this.ctx, cameraPerson);

            // Draws all the objects
            Object.values(this.map.gameObjects)
                .sort((a,b) => {
                    return a.y - b.y;   // ordina gli elementi in base allap osizione vertivale 
                                        // gli elementi sotto verranno disegnati prima di quelli sopra
                })
                .forEach(object => {

                /*
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                });
                */
                
                object.sprite.draw(this.ctx, cameraPerson);
            })

            // Draws the upper layer
            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            // is there a person here to talk to?
            this.map.checkForActionCutscene();
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if(e.detail.whoId === "hero") {
                //hero's position has changed
                this.map.checkForFootstepCutscene();
            }
        })
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    init() {        
        this.startMap(window.OverWorldMaps.Kitchen);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();

        
         this.map.startCutscene(
             [
                 { type: "battle" }
                 //{ type: "textMessage", text: "This is the very first message!" }
             ]
             );
        
    }
}
