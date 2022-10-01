class SubmissionMenu {
    constructor({ caster, enemy, onComplete }) {
        this.caster = caster;
        this.onComplete = onComplete;
        this.enemy = enemy;
    }

    decide() {

        console.log("decide", this.caster);

        this.onComplete({
            action: Actions[ this.caster.actions[0] ],
            target: this.enemy
        });
    }
    
    init(container) {
        this.decide();
    }
}