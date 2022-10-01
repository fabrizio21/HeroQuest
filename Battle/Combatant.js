class Combatant {
    constructor(config, battle) {
        // hp, mp,...
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        })
        this.battle = battle;
    }

    creteElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("Combatant");
        this.hudElement.setAttribute("data-combatant", this.id);
        this.hudElement.setAttribute("data-team", this.team);
        this.hudElement.innerHTML = (`
        <p class="Combatant_name">${this.name}</p>
        <p class="Combatant_level"></p>
        <div class="Combatant_character_crop">
            <img class="Combatant_character" alt="${this.name}" src="${this.src}" />
        </div>
        <img class="Combatant_type" alt="${this.type}" src="${this.icon}" />
        <svg viewBox="0 0 26 3" class="Combatant_life-container">
            <rect x=0 y=0 windth="0%" height=1 fill= "#82ff71" />
            <rect x=0 y=1 windth="0%" height=2 fill= "#e3f126" />
        </svg>
        <svg viewBox="0 0 26 2" class="Combatant_xp-container">
            <rect x=0 y=0 windth="0%" height=1 fill= "#ffd76a" />
            <rect x=0 y=1 windth="0%" height=2 fill= "#ffc934" />
        </svg>
        <p class="Combatant_status"></p>
        `);

        this.pizzaElement = document.createElement("img");
        this.pizzaElement.classList.add("Pizza");
        this.pizzaElement.setAttribute("src", this.src);
        this.pizzaElement.setAttribute("alt", this.alt);
        this.pizzaElement.setAttribute("data-team", this.team);

        this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
        this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");

    }

    update(changes={}) {
        Object.keys(changes).forEach(key => {
            this[key] = changes[key];
        });

        this.hudElement.setAttribute("data-active", this.isActive);
        this.pizzaElement.setAttribute("data-active", this.isActive);

        this.hpFills.forEach( rect => rect.style.width = `${this.hpPercent}%`);
        this.xpFills.forEach( rect => rect.style.width = `${this.xpPercent}%`);

        this.hudElement.querySelector(".Combatant_level").innerText = this.level;

    }

    get hpPercent() {
        const percent = this.hp / this.maxHp * 100;
        return percent > 0 ? percent : 0;
    }

    get xpPercent() {
        return this.xp / this.maxXp * 100;
    }

    get isActive() {
        return this.battle.activeCombatants[this.team] === this.id;
    }

    init(container) {
        this.creteElement();
        container.appendChild(this.hudElement);
        container.appendChild(this.pizzaElement);
        this.update();
    }

}