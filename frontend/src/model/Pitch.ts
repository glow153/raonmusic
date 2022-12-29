import _pitchCodes from '../constants/pitch-codes.json';

interface PitchParam {
  code?: number;
  sharpName?: string;
  flatName?: string;
  mode?: PitchMode ;
}

export enum PitchMode {
  SHARP, FLAT
}

export class Pitch implements PitchParam {
  static MIN_PITCH_CODE = _pitchCodes[2].code;
  static MAX_PITCH_CODE = _pitchCodes[_pitchCodes.length-1].code;

  public code: number;
  private _sharpName: string;
  private _flatName: string;
  public mode: PitchMode = PitchMode.SHARP;
  public get name() {
    return (this.mode === PitchMode.SHARP ? this._sharpName : this._flatName);
  }
  public get shorterName() {
    return this.name.substring(0, this.name.length - 1);
  }
  public get isBlack() {
    return this._sharpName.includes('#');
  }

  constructor({code, sharpName, flatName, mode}: PitchParam = {}) {
    this.code = code ?? 0;
    this._sharpName = sharpName ?? "C2";
    this._flatName = flatName ?? "C2";
    this.mode = mode ?? PitchMode.SHARP;
  }

  static fromCode(_code: number, mode?: PitchMode) {
    const code = (
      _code < 0 ? _code
      : _code < Pitch.MIN_PITCH_CODE ? Pitch.MIN_PITCH_CODE
      : _code > Pitch.MAX_PITCH_CODE ? Pitch.MAX_PITCH_CODE
      : _code
    );
    const pitch = new Pitch(_pitchCodes.find(p => p.code === code));
    if (mode) {
      pitch.mode = mode;
    } else if (pitch.name.includes('#')) {
      pitch.mode = PitchMode.SHARP;
    }
    return pitch;
  }

  static rest() {
    return new Pitch({code: -1, sharpName: '', flatName: ''});
  }

  static get C2() {
    return new Pitch(_pitchCodes[26]);
  }

  public setPitch(amount: number = 1) {
    return Pitch.fromCode(amount);
  }

  public higher(amount: number = 1) {
    return this.setPitch(this.code + amount);
  }

  public lower(amount: number = 1) {
    return this.setPitch(this.code - amount);
  }

  public toString() {
    return this.name;
  }

  public equals(pitch?: Pitch): boolean {
    return this.code === pitch?.code
      && this._sharpName === pitch?._sharpName
      && this._flatName === pitch?._flatName
      && this.mode === pitch?.mode
    ;
  }

  public get obj() {
    return this.code;
  }
}