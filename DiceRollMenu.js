class DiceRollMenu {
    constructor({dice, onComplete }) {
        // lista di dadi da lanciare
        this.dice = dice;
        this.hand = [];
        this.canceled = false;
        this.onComplete = onComplete;

    }

    /*
    * Rolls the dice and stores the array of results
    */
    roll() {
        this.hand = [];
        const dice = document.querySelectorAll('.cube');
        this.dice.forEach( (d,index) => {
            const value = Math.floor((Math.random() * d.sides) + 1);
            this.hand.push( value );
            // Change the die appearance
            for (var i = 1; i <= d.sides; i++) {
                dice[index].classList.remove('show-' + i);
                if (value === i) {
                    dice[index].classList.add('show-' + i);
                }
              }
        })
    }

    createElement(container) {
        this.element = document.createElement("div");
        this.element.classList.add("DiceRollMenu");

        var content = '<ul class="die-list">';

        // crea un elenco puntato che ospita i dadi
        this.dice.forEach( (die,index) => {
            console.log(die, index);
            content += (`
            <li>
                <div class="cube">
                    <div class="${die.type === "regular" ? "d1" : "skull"} front"></div>
                    <div class="${die.type === "regular" ? "d2" : "shield-good"} back"></div>
                    <div class="${die.type === "regular" ? "d3" : "skull"} right"></div>
                    <div class="${die.type === "regular" ? "d4" : "shield-good"} left"></div>
                    <div class="${die.type === "regular" ? "d5" : "skull"} top"></div>
                    <div class="${die.type === "regular" ? "d6" : "shield-evil"} bottom"></div>
                </div>
            </li>
            `);
    
        })

        this.element.innerHTML = content;// + "</ul><div class='KeyboardMenu'><div class='option roll'><button>Roll dice!</button></div><div class='option cancel'><button>Cancel!</button></div></div>";

        // attende che 
        this.element.addEventListener("transitionend", (e) => {
            console.log('transitionend', this.hand, e);
        })

    }

    end() {
        //Remove menu element and description element
        this.element.remove();
        this.keyboardMenu.end();
        this.onComplete({
            hand: this.hand, 
            canceled: this.canceled
        });
    }

    getOptions() {
        return [
            {
                label: "Roll!",
                description: "Roll the dice",
                handler: async () => {
                    
                    // recupero il riferimento al pulsante e lo disabilito
                    // todo: si può sicuramente fare meglio
                    const button = this.element.querySelector("button[data-button='0']");
                    button.disabled = true;
                    const button2 = this.element.querySelector("button[data-button='1']");
                    button2.disabled = true;

                    // tira i dati e attende
                    this.roll();
                    this.keyboardMenu.updateOption(0);
                    this.canceled = false;

                    // attende la fine delle transizioni
                    // todo: migliorabile
                    await utils.wait(3000);

                    this.end();
                
                }
            },
            {
                
                label: "Go Back",
                description: "Return to previous page",
                handler: () => {
                    console.log("return");
                    this.hand = [];
                    this.canceled = true;
                    this.end();
                }
            }
        ];
      }

    init(container) {
        this.createElement();
        
        console.log(this.element.querySelector("button.roll"));

        this.keyboardMenu = new KeyboardMenu({
          descriptionContainer: container
        });

        this.keyboardMenu.init(this.element)
        this.keyboardMenu.setOptions(this.getOptions())

        container.appendChild(this.element);

    }

}
