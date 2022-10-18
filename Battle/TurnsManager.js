/*
* Classe per la gestione dei turni di gioco
*/
class TurnsManager {

    constructor(config) {
        // elenca i partecipanti a turni di azione (i nemici in mappe non rivelate non si muovono)
        // (ordinare per iniziativa?)
        this.participants = Object.values(config).filter( o => {
            return o.constructor.name === 'Person' ? o : null;
        });
    }

    init() {
        // lancia un evento nel loop principale per avvisare che un nuovo turno è pronto
        utils.emitEvent("NewTurn", {
            who: this.current()
        })
    }

    next() {
        // rimuove il partecipante corrente, lo mette in coda e scatena l'evento nel loop principale
        const current = this.participants.shift();
        this.participants.push(current);

        console.log("")
        utils.emitEvent("NewTurn", {
            who: this.current()
        })
    }

    current() {
        return this.participants[0];
    }

    remove(id) {
        //this.participants.filter(participant.id)
    }
}