class KeyboardMenu {
  constructor(config={}) {
    this.options = []; //set by updater method
    this.up = null;
    this.down = null;
    this.prevFocus = null;
    this.descriptionContainer = config.descriptionContainer || null;
  }

  updateOption(option) {
    const button = this.element.querySelectorAll("button[data-button='0']");
    button.disabled = true;
    console.log(button);
  }

  hide() {
    console.log("menu hide", this.element);
    this.element.style.display = "none";
    this.descriptionElementText.style.display = "none";
  }

  show() {
    console.log("menu show");
    this.element.style.display = "block";
    this.descriptionElementText.style.display = "block";
  }

  setOptions(options) {
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled ? "disabled" : "";
      return (`
        <div class="option">
          <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
            ${option.label}
          </button>
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>
      `)
    }).join("");

    this.element.querySelectorAll("button").forEach(button => {

      button.addEventListener("click", () => {
        const chosenOption = this.options[ Number(button.dataset.button) ];
        chosenOption.handler();
      })
      button.addEventListener("mouseenter", () => {
        button.focus();
      })
      button.addEventListener("focus", () => {
        this.prevFocus = button;
        this.descriptionElementText.innerText = button.dataset.description;
      })
    })

    setTimeout(() => {
      this.element.querySelector("button[data-button]:not([disabled])").focus();
    }, 10)

    


  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("KeyboardMenu");

    //Description box element
    this.descriptionElement = document.createElement("div");
    this.descriptionElement.classList.add("DescriptionBox");
    this.descriptionElement.innerHTML = (`<p>I will provide information!</p>`);
    this.descriptionElementText = this.descriptionElement.querySelector("p");
  }

  end() {

    //Remove menu element and description element
    this.element.remove();
    this.descriptionElement.remove();

    //Clean up bindings
    this.up.unbind();
    this.down.unbind();
  }

  init(container) {
    this.createElement();
    (this.descriptionContainer || container).appendChild(this.descriptionElement);
    container.appendChild(this.element);

    this.up = new KeyPressListener("ArrowUp", () => {

      console.log("up");
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
        return el.dataset.button < current && !el.disabled;
      })
      prevButton?.focus();
    })
    this.down = new KeyPressListener("ArrowDown", () => {
      console.log("down");
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
        return el.dataset.button > current && !el.disabled;
      })
      nextButton?.focus();
    })

  }

}