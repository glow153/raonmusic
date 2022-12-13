import { Pitch } from "../Pitch";

enum Tone {
  MAJOR, MINOR
}

export class Key {
  public pitch: Pitch;
  private _tone: Tone;
  public get tone() {
    return this._tone === Tone.MAJOR ? "Major" : "Minor";
  }
  
  constructor(pitch?: Pitch, tone?: Tone) {
    this.pitch = pitch ?? Pitch.C2;
    this._tone = tone ?? Tone.MAJOR;
  }

  toString() {
    return `${this.pitch.shorterName} ${this.tone}`;
  }
}