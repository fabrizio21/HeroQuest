class TextMessage {
    constructor({ text, onComplete}) {

        console.log("TextMessage.constructor init");

        this.text = text;
        this.onComplete = onComplete;
        this.element = null;

        console.log("TextMessage.constructor end");
    }

    createElement() {
        // create the element
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        this.element.innerHTML = (
            `<p class="TextMessage_p"><p>
            <button class="TextMessage_button">Next</button>`
        );

        // inits the typrewriter effect
        this.revealingText = new RevealingText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text

        })

        this.element.querySelector("button").addEventListener("click", () => {
            // close the text message
            this.done();
        });

        this.actionListener = new KeyPressListener("Enter", () => {
            this.done();
        })
    }

    done() {
        if(this.revealingText.isDone){
            this.element.remove();
            this.actionListener.unbind();
            this.onComplete();
        } else {
            this.revealingText.warpToDone();
        }
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
        this.revealingText.init();

    }

}