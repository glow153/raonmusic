import _pitchCodes from '../constants/pitch-codes.json';

interface PitchParam {
  code?: number;
  sharpName?: string;
  flatName?: string;
  mode?: PitchMode;
}

export enum PitchMode {
  SHARP, FLAT
}

export class Pitch implements PitchParam {
  public code: number;
  private _sharpName: string;
  private _flatName: string;
  public mode: PitchMode;
  public get name() {
    return this.mode === PitchMode.SHARP ? this._sharpName : this._flatName;
  }
  public get shorterName() {
    return this.name.substring(0, this.name.length - 1);
  }

  constructor({code, sharpName, flatName, mode}: PitchParam = {}) {
    this.code = code ?? 0;
    this._sharpName = sharpName ?? "C2";
    this._flatName = flatName ?? "C2";
    this.mode = mode ?? PitchMode.SHARP;
  }

  static fromCode(code: number) {
    const pitch = _pitchCodes.find(p => p.code === code);
    return new Pitch(pitch);
  }

  static rest() {
    return new Pitch({code: -1, sharpName: '', flatName: ''});
  }

  static get C2() {
    return new Pitch(_pitchCodes[1]);
  }

  public up(amount?: number) {
    
  }

  public toString() {
    return this.name;
  }

  public equals(pitch: Pitch): boolean {
    return this.code === pitch.code
      && this._sharpName === pitch._sharpName
      && this._flatName === pitch._flatName
      && this.mode === pitch.mode
    ;
  }
}