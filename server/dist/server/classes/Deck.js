import Card from "./Card.js";
export default class Deck {
    deck = [];
    constructor() {
        this.createDeck();
        this.deck = this.shuffleDeck(this.deck);
    }
    createDeck() {
        let deckIdx = 0;
        for (let suitIdx = 0; suitIdx < 4; suitIdx++) {
            for (let nameIdx = 0; nameIdx < 13; nameIdx++) {
                this.deck[deckIdx++] = new Card(nameIdx, suitIdx, deckIdx);
            }
        }
    }
    getCard() {
        //
        return this.deck.pop();
    }
    getHand() {
        const hand = [];
        for (let i = 0; i < 14; i++) {
            hand[i] = this.getCard();
        }
        return hand;
    }
    shuffleDeck(originalArray) {
        const newArray = [...originalArray]; // copy array
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}
