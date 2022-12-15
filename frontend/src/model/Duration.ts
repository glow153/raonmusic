import _durationCodes from '../constants/duration-codes.json';

interface DurationParam {
  id?: number;
  name?: string;
  length?: number;
  fraction?: string;
}

export class Duration {
  static MIN = _durationCodes[0].length;
  static MAX = _durationCodes[_durationCodes.length-1].length;

  public id: number;
  public name: string;
  public length: number;
  public fraction: string;

  constructor({id, name, length, fraction}: DurationParam = {}) {
    this.id = id ?? 4;
    this.name = name ?? "quarter note";
    this.length = length ?? 4;
    this.fraction = fraction ?? "1/4";
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
}
