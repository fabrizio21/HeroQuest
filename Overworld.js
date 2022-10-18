class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");

   this.ctx = this.canvas.getContext("2d");

   this.map = null;
   this.turnsManager = null;


 }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      // todo: [fab] in base al personaggio attivo dovrebbe centrare la telecamera
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })
      
      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);
      
      if (!this.map.isPaused) {
        requestAnimationFrame(() => {
          step();   
        })
      }
    }
    step();
 }

 bindActionInput() {
   new KeyPressListener("Enter", () => {
     //Is there a person here to talk to?
     this.map.checkForActionCutscene()
   })
   new KeyPressListener("Escape", () => {
     if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { type: "pause" }
      ])
     }
   })
 }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId === "hero") {
       //Hero's position has changed
       this.map.checkForFootstepCutscene()
     }
   })
 }

 // [fab] controlla se è disponibile un altro turno
 bindNewTurnCheck() {
  document.addEventListener("NewTurn", async e => {

        this.map.startCutscene([
          { type: "actionMenu" , who: e.detail.who }
        ])

/*
        // E' pronto un nuovo turno per un giocatore giocante
        const eventHandler = new OverworldEvent({ map: this.map, event: {
          type: "actionMenu",
          who: e.detail.who
        }
       });
        await eventHandler.init(); 
        */
  })
 }

 startMap(mapConfig, heroInitialState=null) {
  this.map = new OverworldMap(mapConfig);
  this.map.overworld = this;
  this.map.mountObjects();

// >>
  var getPos = function(e){
    var bx = e.target.getBoundingClientRect(),
    x = e.clientX - bx.left,y = e.clientY - bx.top;

    var xx = x-utils.withGrid(10.5);
    var yy = y-utils.withGrid(6);


    //const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
    //const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

    //utils.withGrid(10.5)
    //console.log(x,y,xx,yy);
  }
  this.canvas.addEventListener("mousemove", getPos);
// <<


  if (heroInitialState) {
    const {hero} = this.map.gameObjects;
    hero.x = heroInitialState.x;
    hero.y = heroInitialState.y;
    hero.direction = heroInitialState.direction;
  }

  this.progress.mapId = mapConfig.id;
  this.progress.startingHeroX = this.map.gameObjects.hero.x;
  this.progress.startingHeroY = this.map.gameObjects.hero.y;
  this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;

 }

 async init() {

  const container = document.querySelector(".game-container");

  //Create a new Progress tracker
  this.progress = new Progress();

  //Show the title screen
  this.titleScreen = new TitleScreen({
    progress: this.progress
  })
  const useSaveFile = await this.titleScreen.init(container);

  //Potentially load saved data
  let initialHeroState = null;
  if (useSaveFile) {
    this.progress.load();
    initialHeroState = {
      x: this.progress.startingHeroX,
      y: this.progress.startingHeroY,
      direction: this.progress.startingHeroDirection,
    }
  }

  //Load the HUD
  this.hud = new Hud();
  this.hud.init(container);

  //Start the first map
  this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState );
  // [fab] inizializza il manager dei turni d'azione
  this.turnsManager = new TurnsManager(this.map.gameObjects);

  //Create controls
  this.bindActionInput();
  this.bindHeroPositionCheck();

  this.bindNewTurnCheck()
  this.turnsManager.init();

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  //Kick off the game!
  this.startGameLoop();


  // this.map.startCutscene([
  //   { type: "battle", enemyId: "beth" }
  //   // { type: "changeMap", map: "DemoRoom"}
  //   // { type: "textMessage", text: "This is the very first message!"}
  // ])

 }
}