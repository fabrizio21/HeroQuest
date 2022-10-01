class OverworldMap {
    constructor(config){
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        this.walls = config.walls || {};
        
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(this.lowerImage, 
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y);
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(this.upperImage,
            utils.withGrid(10.5) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y);

    }
    
    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = utils.nextPosition(currentX,currentY,direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects(){
        Object.keys(this.gameObjects).forEach( key => {
            let object  = this.gameObjects[key];
            object.id = key;        // hero, npc1, npc2,...

            //TODO: determine if this object should actually mount
            object.mount(this);
        })
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        // start a loop of async event and await each one
        for(let i=0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;

        // reset npcs to do idle behavior
        Object.values(this.gameObjects).forEach(object=>object.doBehaviorEvent(this))
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        if(!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events);
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];

        if(!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events);
        }
        
    }

    addWall(x,y){
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x,y){
        delete this.walls[`${x},${y}`];
    }

    moveWall(wasX,wasY,direction) {
        this.removeWall(wasX,wasY);
        const {x,y} = utils.nextPosition(wasX,wasY,direction);
        this.addWall(x,y);
    }
}


// List of maps
window.OverWorldMaps = {
    DemoRoom: {
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                isPlayerControlled: true
            }),
            npcA: new Person({
                x: utils.withGrid(2),
                y: utils.withGrid(8),
                src: "./images/characters/people/npc1.png"
            }),
            npcB: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(5),
                src: "./images/characters/people/npc1.png"
                /*,
                behaviorLoop: [
                    { type: "walk", direction: "left" },
                    { type: "stand", direction: "up", time: 800 },
                    { type: "walk", direction: "up" },
                    { type: "walk", direction: "right" },
                    { type: "walk", direction: "down" }
                ]*/
            })
            
            /*,
            npcA: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: "./images/characters/people/npc1.png",
                behaviorLoop: [
                    { type: "stand", direction: "left", time: 800 },
                    { type: "stand", direction: "up", time: 800 },
                    { type: "stand", direction: "right", time: 1200 },
                    { type: "stand", direction: "up", time: 300 }
                ]
            })*/
        },
        walls: {
            //"16,16": true
            [utils.asGridCoords(7,6)]: true,    
            [utils.asGridCoords(8,6)]: true,
            [utils.asGridCoords(7,7)]: true,
            [utils.asGridCoords(8,7)]: true,
        },
        cutsceneSpaces: {
            [utils.asGridCoords(7,4)]: [
                {
                    events: [
                        { who: "npcB", type: "walk", direction: "left" },
                        { who: "npcB", type: "stand", direction: "up", time: 500 },
                        { type: "textMessage", text: "You can't be in there!" },
                        { who: "npcB", type: "walk", direction: "right" },
                        { who: "hero", type: "walk", direction: "down" },
                        { who: "hero", type: "walk", direction: "left" }
                    ]
                }

            ],
            [utils.asGridCoords(5,10)]: [
                {
                    events: [
                        { type: "changeMap", map: "Kitchen" }                        
                    ]
                }

            ]
        }
    },
    Kitchen: {
        lowerSrc: "./images/maps/KitchenLower.png",
        upperSrc: "./images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                isPlayerControlled: true
            }),
            npcB: new Person({
                x: utils.withGrid(10),
                y: utils.withGrid(8),
                src: "./images/characters/people/dwarf.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Aye, you made it!", faceHero: "npcB" }
                        ]
                    }
                ]
            }),
            npcC: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(8),
                src: "./images/characters/people/slime_green.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Blrrrlllrrr!", faceHero: "npcC" }
                        ]
                    }
                ]
            })
        },
        cutsceneSpaces: {
            [utils.asGridCoords(5,10)]: [
                {
                    events: [
                        { type: "changeMap", map: "DemoRoom" }                        
                    ]
                }

            ]
        }
    },
    Act001: {
        lowerSrc: "./images/maps/act-001.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(6),
                isPlayerControlled: true
            }),
            dwarf: new Person({
                x: utils.withGrid(2),
                y: utils.withGrid(8),
                src: "./images/characters/people/dwarf.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hello!", faceHero: "dwarf"},
                            { type: "textMessage", text: "I'm busy!"},
                            { type: "textMessage", text: "Go away!"},
                        ]
                    }
                ]
            }),
            knight: new Person({
                x: utils.withGrid(4),
                y: utils.withGrid(5),
                src: "./images/characters/people/knight.png"
            }),
            skeleton: new Person({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: "./images/characters/people/skeleton2.png"
            }),
            slime: new Person({
                x: utils.withGrid(8),
                y: utils.withGrid(9),
                src: "./images/characters/people/slime_red.png"
            })
        },
        walls: {
            //"16,16": true
            [utils.asGridCoords(7,6)]: true,    
            [utils.asGridCoords(8,6)]: true,
            [utils.asGridCoords(7,7)]: true,
            [utils.asGridCoords(8,7)]: true,
        }
    }
}
