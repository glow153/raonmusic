import _durationCodes from '../constants/duration-codes.json';

interface DurationParam {
  id?: number;
  name?: string;
  length?: number;
  fraction?: string;
}

export class Duration {
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

  static fromLength(length: number) {
    const duration = _durationCodes.find(d => d.length === length);
    return new Duration(duration);
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
