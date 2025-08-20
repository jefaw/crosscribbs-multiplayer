export default class Score {
    constructor(pairScore, runScore, fifteenScore){
        this.pairs = pairScore;
        this.runs = runScore;
        this.fifteens = fifteenScore;
    }
    total(){
        return this.pairs + this.runs + this.fifteens;
    }
    
}