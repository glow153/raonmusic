export class Time {
  public upper: number;
  public lower: number;
  
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