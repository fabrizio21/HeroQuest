class RevealingText {
    constructor(config){
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 50;    // the higher the slower

        this.timeout = null;
        this.isDone = false;

    }

    revealOneCharacter(list) {
        // rimuove il primo carattere della lista
        const next = list.splice(0,1)[0];
        // cambia stile allo span
        next.span.classList.add("revealed");

        if(list.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealOneCharacter(list);
            }, next.delayAfter)
            
        } else {
            this.isdone = true;
        }
    }

    /*
    * Reveals all the characters without waiting for the timeout
    */
    warpToDone() {
        clearInterval(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll("span").forEach(s => {
            s.classList.add("revealed");
        })
    }

    init() {
        let characters = [];
        // splits the text into characters, 
        // creates a span for each character 
        // and adds it to the DOM
        this.text.split("").forEach(character => {
           let span = document.createElement("span");
           span.textContent = character; 
           this.element.appendChild(span);

           // adds this span to our internat state array
           characters.push({
                span,
                delayAfter: character === " " ? 0 : this.speed           
            })
        })

        this.revealOneCharacter(characters);
    }
}