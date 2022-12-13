import { Duration } from "../Duration";

export class Tempo {
  public beat: Duration;
  public count: number;

  constructor(count: number, beat?: Duration) {
    this.count = count;
    this.beat = beat ?? new Duration();
  }
}