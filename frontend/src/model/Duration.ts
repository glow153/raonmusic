import _durationCodes from '../constants/duration-codes.json';

interface DurationParam {
  id?: number;
  name?: string;
  length?: number;
  fraction?: string;
  sign?: number;
}

export class Duration {
  static MIN = _durationCodes[0].length;
  static MAX = _durationCodes[_durationCodes.length-1].length;

  public id: number;
  public name: string;
  public length: number;
  public fraction: string;
  public sign: number;

  constructor({id, name, length, fraction}: DurationParam = {}) {
    this.id = id ?? 4;
    this.name = name ?? "quarter note";
    this.length = length ?? 4;
    this.fraction = fraction ?? "1/4";
    this.sign = parseInt(this.fraction.split('/')[1]);
  }

  static get Unit () {
    return Duration.fromLength(1);
  }

  static fromLength(_length: number) {
    const length = (
      _length < Duration.MIN ? Duration.MIN
      : _length > Duration.MAX ? Duration.MAX
      : _length
    );
    const duration = _durationCodes.find(d => d.length === length);
    return new Duration(duration);
  }

  static fromTimeSignature(lower: number = 4) {
    const target = _durationCodes.find(d => d.fraction === `1/${lower}`);
    return target ? new Duration(target) : undefined;
  }

  public setLength(length: number) {
    return Duration.fromLength(length);
  }

  public longer(amount: number = 1) {
    return this.setLength(this.length + amount);
  }
  
  public shorter(amount: number = 1) {
    return this.setLength(this.length - amount);
  }

  public toString() {
    return this.fraction;
  }

  public equals(duration?: Duration): boolean {
    return this.id === duration?.id
      && this.name === duration?.name
      && this.length === duration?.length
      && this.fraction === duration?.fraction
    ;
  }

  public get obj() {
    return this.length;
  }
}
