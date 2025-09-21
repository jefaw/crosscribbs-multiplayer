export default class Score {
    pairs;
    runs;
    fifteens;
    knobs;
    flushes;
    total;
    constructor(pairScore, runScore, fifteenScore, knobsScore, flushScore) {
        this.pairs = pairScore;
        this.runs = runScore;
        this.fifteens = fifteenScore;
        this.knobs = knobsScore;
        this.flushes = flushScore;
        this.total = this.calculateTotal();
    }
    calculateTotal() {
        return this.pairs + this.runs + this.fifteens + this.knobs + this.flushes;
    }
}
