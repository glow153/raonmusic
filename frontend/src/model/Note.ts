export class Note {
  public phoneme: string;
  private _pitch: number;
  public duration: number;
  get pitch() {
    // TODO: 추후 실제 음이름을 숫자로 매핑하도록 변경 필요 (ex. 0: 'C2', 1: 'C#2')
    return this._pitch.toString();
  }

  constructor(phoneme: string, pitch: number, duration: number) {
    this.phoneme = phoneme;
    this._pitch = pitch;
    this.duration = duration;
  }

}