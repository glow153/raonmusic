export class Time {
  public upper: number;
  public lower: number;
  
  constructor(upper?: number, lower?: number) {
    this.upper = upper ?? 4;
    this.lower = lower ?? 4;
  }
}