import { Duration } from "../Duration";

export class Tempo {
  public count: number;
  public beat: Duration;

  constructor(count: number, beat?: Duration) {
    this.count = count;
    this.beat = beat ?? new Duration();
  }

  static fromJson(tempo: any) {
    return new Tempo(tempo.count, Duration.fromLength(tempo.beat));
  }

  public get obj() {
    return { count: this.count, beat: this.beat.length };
  }
}