import type { ScoreType } from "@shared/types/ScoreType";

export default class Score implements ScoreType {
  pairs: number;
  runs: number;
  fifteens: number;
  total: number;

  constructor(pairScore: number, runScore: number, fifteenScore: number) {
    this.pairs = pairScore;
    this.runs = runScore;
    this.fifteens = fifteenScore;
    this.total = this.calculateTotal();
  }

  calculateTotal(): number {
    return this.pairs + this.runs + this.fifteens;
  }
}
