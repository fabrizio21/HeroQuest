class TurnCycle {
    constructor( {battle, onNewEvent}) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.currentTeam = "player";
    }

    async turn() {
        // get the caster and the enemy
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];

        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
        const enemy = this.battle.combatants[enemyId];

        console.log("turn",enemyId, enemy);

        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            enemy
        });

        const resultingEvents = submission.action.success;
        for(let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target
            }
            await this.onNewEvent(event);
        }

        // move to another participant (for now I only have two)
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();

    }

    async init() {
        await this.onNewEvent({
            type: "textMessage",
            text: "The battle is starting!"
        });


        // Starts the first turn!
        this.turn();
    }
}