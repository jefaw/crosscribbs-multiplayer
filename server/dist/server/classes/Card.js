import { CARD_NAME, CARD_VAL, SUITS } from "../../shared/types/CardType.js";
export default class Card {
    id;
    nameIdx;
    name;
    value;
    suit;
    frontImgSrc;
    constructor(nameIdx, suitIdx, id) {
        this.nameIdx = nameIdx;
        this.name = CARD_NAME[nameIdx];
        this.value = CARD_VAL[nameIdx];
        this.suit = SUITS[suitIdx];
        this.frontImgSrc = `/cards/fronts/${this.suit}_${this.name}.svg`;
        this.id = id;
    }
}
