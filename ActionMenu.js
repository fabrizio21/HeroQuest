class ActionMenu { 
    constructor({ caster, enemy, onComplete, items, spells, map }) {
      this.caster = caster;
      this.enemy = enemy;
      this.spells = spells;
      this.onComplete = onComplete;
      this.map = map;

      console.log({ caster, enemy, onComplete, items, spells });
  
      let quantityMap = {};
      items.forEach(item => {
        if (item.team === caster.team) {
          let existing = quantityMap[item.actionId];
          if (existing) {
            existing.quantity += 1;
          } else {
            quantityMap[item.actionId] = {
              actionId: item.actionId,
              quantity: 1,
              instanceId: item.instanceId,
            }
         }
        }
      })
      this.items = Object.values(quantityMap);

      this.validMoves = {};
    }

    movementRolled({ hand, canceled }) {
      if(!canceled) {
        const coords = utils.toGridCoord(this.caster.x, this.caster.y);
        // distanza da percorrere, fa la somma degli elementi dell'array
        const distance = hand.reduce((a, b) => a + b, 0);

        this.validMoves = {};

        // la ricorsione in js è lentissima, trovo il rettangolo centrato sul pesronaggio
        // che contiene tutte le possibili mosse
        const top = coords.x - distance < 0 ? 0 : coords.x - distance;
        const left = coords.y - distance < 0 ? 0 : coords.y - distance;

        let calcDistance = 0, row = 0, col = 0;
        console.log("distance", distance, left, top, (distance*2+1)**2);

        let objects = Object.values(this.map.gameObjects); 
        
        for(let i =0; i < (distance*2+1)**2; i++) {
        
          // trova le coordiante della cella
          row = top + Math.floor(i/ (distance * 2 + 1));
          col =  left + (i % (distance * 2 +1 ));
          // trova la distanza (in celle) fra le celle
          calcDistance = Math.abs(coords.x - row) + Math.abs(coords.y - col);
          // calcola le coordiante in pixel
          const posPixel = utils.asGridCoord(col, row);

          if(calcDistance <= distance) {
            if(this.validMoves[posPixel] === undefined
              && !this.map.walls[posPixel] 
              && !objects.find( o => o.x === row*16 && o.y === col*16)) {
                this.validMoves[posPixel] = true;
  
            }
          }
        }
        this.map.showClickableCells(this.validMoves);

        // ora devo nascondere il menu per permettere all'utente di selezionare la destinazione
        this.keyboardMenu.hide();
      }
      
    }

/*
    findNeighbors(x, y, distance, objects) {
      // direzioni possibili a partite dalla cella corrente (no movimenti in diagonale)
      // [scostamento x, scostamento y]
      // east, south, west, north
      const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      
      dirs.forEach( dir => {
        const pos = {x: x + dir[0], y: y + dir[1]};
        const posPixel = utils.asGridCoord(pos.y, pos.x);

        //const xx = utils.withGrid(pos.x);
        //const yy = utils.withGrid(pos.y);

        if(distance > 0 && pos.x >= 0 && pos.y >= 0) {        

          //console.log("object", xx, yy, objects.find( o => o.x === xx && o.y === yy) );

          // tutto bene se la cella è contenuta nella mappa, non è un muro e non è un personaggio
          if(this.validMoves[posPixel] === undefined
            && !this.map.walls[posPixel] 
            && !objects.find( o => o.x === xx && o.y === yy)) {
              this.validMoves[posPixel] = true;

          }
          this.findNeighbors(pos.x, pos.y, distance - 1, objects);
        }

        
      });
    }
*/
  
    getPages() {
  
      const backOption = {
        label: "Go Back",
        description: "Return to previous page",
        handler: () => {
          this.keyboardMenu.setOptions(this.getPages().root)
        }
      };
  
      return {
        root: [
            {
                label: "Move",
                description: "Muovi personaggio",
                handler: async () => {
                  //Do something when chosen...
                  //this.keyboardMenu.setOptions( this.getPages().attacks )

                    
                    const {movement} = this.caster;
                    console.log(this.caster, movement);

                    var diceArray = [];
                    for(let i=0; i < movement.number; i++) {
                      diceArray.push({sides: movement.sides, type: "regular"});
                    }

                    console.log(diceArray);

                    const diceRollMenu = new DiceRollMenu({
                      dice: diceArray, 
                      onComplete: this.movementRolled.bind(this)    // [!!!] uso la bind per evitare che la proprietà diventi undefined
                    });

                    diceRollMenu.init(document.querySelector(".game-container"));

                }
            },
          {
            label: "Attack",
            description: "Choose an attack",
            disabled: false, /* disabilitato se non ho nemici vicino */
            handler: () => {
              //Do something when chosen...
              //this.keyboardMenu.setOptions( this.getPages().attacks )

              var roll = utils.rollDies( this.caster.attack.sides, this.caster.attack.number );
              console.log("attacco ", roll);
            }
          },
          {
            label: "Search",
            description: "Search around for threats!",
            disabled: false, /* disabilitato se non ho nemici vicino */
            handler: () => {
              //Do something when chosen...
              //this.keyboardMenu.setOptions( this.getPages().attacks )
              console.log("searchato");
            }
          },
          {
            label: "Open",
            description: "Open doors/chests",
            disabled: false, /* disabilitato se non ci sono oggetti (rivelati) vicino */
            handler: () => {
              //
              //this.keyboardMenu.setOptions( this.getPages().attacks )
              var roll = utils.rollDies( this.caster.movement.sides, this.caster.movement.number );
              console.log("opens everything");
            }
          },
          {
            label: "Items",
            description: "Choose an item",
            handler: () => {
              this.keyboardMenu.setOptions( this.getPages().items )
            }
          },
          {
             label: "Spells",
             description: "Choose an item",
             handler: () => {
               this.keyboardMenu.setOptions( this.getPages().items )
            }
          },
          {
              label: "End",
              description: "Ends turn",
              handler: () => {

                //
                this.map.overworld.turnsManager.next();
                this.onComplete("end-turn");
             }
          /*,
          {
            label: "Spells",
            description: "Choose a spell",
            handler: () => { 
              this.keyboardMenu.setOptions( this.getPages().spells )
            }*/
          }
        ],
        attacks: [
            /*
          ...this.caster.actions.map(key => {
            const action = Actions[key];
            return {
              label: action.name,
              description: action.description,
              handler: () => {
                this.menuSubmit(action)
              }
            }
          }),*/
          backOption
        ],
        items: [
          ...this.items.map(item => {
            const action = Actions[item.actionId];
            return {
              label: action.name,
              description: action.description,
              right: () => {
                return "x"+item.quantity;
              },
              handler: () => {
                this.menuSubmit(action, item.instanceId)
              }
            }
          }),
          backOption
        ],
        replacements: [
            /*
          ...this.replacements.map(replacement => {
            return {
              label: replacement.name,
              description: replacement.description,
              handler: () => {
                //Swap me in, coach!
                this.menuSubmitReplacement(replacement)
              }
            }
          }),*/
          backOption
        ]
      }
    }
  
    menuSubmitReplacement(replacement) {
      this.keyboardMenu?.end();
      this.onComplete({
        replacement
      })
    }
  
    menuSubmit(action, instanceId=null) {
  
      this.keyboardMenu?.end();
  
      this.onComplete({
        action,
        target: action.targetType === "friendly" ? this.caster : this.enemy,
        instanceId
      })
    }
  
    decide() {
      //TODO: Enemies should randomly decide what to do...
      this.menuSubmit(Actions[ this.caster.actions[0] ]);
    }
  
    showMenu(container) {
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(container);
      this.keyboardMenu.setOptions( this.getPages().root )
    }
  
    init(container) {
  
      if (this.caster.isPlayerControlled) {
        //Show some UI
        this.showMenu(container)
      } else {
        this.decide()
      }
    }
  }