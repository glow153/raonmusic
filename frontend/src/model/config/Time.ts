import { Duration } from "..";

export class Time {
  public upper: number;
  public _lower!: Duration;
  public get lower(): number {
    return this._lower.sign;
  }
  public set lower(value: number) {
    const lower = Duration.fromTimeSignature(value);
    if (lower) {
      this._lower = lower;
    } else {
      throw new Error(`잘못된 time signature 설정입니다. (lower: ${value})`);
    }
  }
  public get lengthPerMeasure() {
    return this._lower.length * this.upper;
  }
  
  constructor(upper?: number, lower?: number) {
    this.upper = upper ?? 4;
    this.lower = lower ?? 4;
  }

  static fromJson(time: any) {
    return new Time(time.upper, time.lower);
  }

  public get obj() {
    return { upper: this.upper, lower: this.lower };
  }
}