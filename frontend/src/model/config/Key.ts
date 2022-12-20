import { Pitch } from "../Pitch";

export enum Tone {
  MAJOR, MINOR
}

export class Key {
  public pitch: Pitch;
  public _tone: Tone;
  public get tone() {
    return this._tone === Tone.MAJOR ? "Major" : "Minor";
  }
  
  constructor(pitch?: Pitch, tone?: Tone) {
    this.pitch = pitch ?? Pitch.C2;
    this._tone = tone ?? Tone.MAJOR;
  }

  static fromJson(key: any) {
    return new Key(Pitch.fromCode(key.pitch), key.tone);
  }

  toString() {
    return `${this.pitch.shorterName}`;
  }

  public get obj() {
    return { pitch: this.pitch.code, tone: this._tone };
  }
}