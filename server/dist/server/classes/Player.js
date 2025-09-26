export default class Player {
    id;
    num;
    name;
    hand;
    discardedToCrib;
    constructor(id, num, name, hand, discardedToCrib) {
        this.id = id;
        this.num = num;
        this.name = name;
        this.hand = hand;
        this.discardedToCrib = discardedToCrib;
    }
}
