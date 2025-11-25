class Bonus {
    constructor({
        effect = this.apply_effect,
        title = this.title,
        level = this.level,
        icon = this.icon
        } = {}) {
            this.apply_effect = effect;
            this.title = title;
            this.level = level;
            this.icon = icon;
    }

    apply_effect(player){
        console.log(`${player.playerId} : ${this.title}`);
    }
}