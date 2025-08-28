import type { ScoreType } from "@shared/types/ScoreType";

export default class Score implements ScoreType {
  pairs: number;
  runs: number;
  fifteens: number;
  knobs: number;
  flushes: number;
  total: number;

  constructor(pairScore: number, runScore: number, fifteenScore: number, knobsScore: number, flushScore: number) {
    this.pairs = pairScore;
    this.runs = runScore;
    this.fifteens = fifteenScore;
    this.knobs = knobsScore;
    this.flushes = flushScore;
    this.total = this.calculateTotal();
  }

  calculateTotal(): number {
    return this.pairs + this.runs + this.fifteens + this.knobs + this.flushes;
  }
}
