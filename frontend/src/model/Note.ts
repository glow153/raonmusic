import { Duration, Pitch } from ".";

export class Note {
  public index: number;
  public phoneme?: string;
  public pitch: Pitch;
  public duration: Duration;
  public isRest: boolean;

  constructor(index: number, phoneme?: string, pitch?: Pitch, duration?: Duration, isRest?: boolean) {
    this.index = index;
    this.phoneme = phoneme ?? '';
    this.pitch = pitch ?? new Pitch();
    this.duration = duration ?? new Duration();
    this.isRest = isRest ?? false;
  }

  static rest(index: number) {
    return new Note(index, '-', Pitch.fromCode(-1), Duration.fromLength(4));
  }

  static fromJson(obj: any, index?: number) {
    return new Note(
      index ?? 0,
      obj.phoneme,
      Pitch.fromCode(obj.pitch),
      Duration.fromLength(obj.duration),
      (obj.pitch < 0 || obj.isRest === true) ? true : false
    );
  }

  public setPhoneme(word: string) {
    return new Note(this.index, word, this.pitch, this.duration);
  }

  public setPitch(value: number) {
    return new Note(this.index, this.phoneme, this.pitch.setPitch(value), this.duration);
  }
  
  public higher(amount: number = 1) {
    return new Note(this.index, this.phoneme, this.pitch.higher(amount), this.duration);
  }

  public lower(amount: number = 1) {
    return new Note(this.index, this.phoneme, this.pitch.lower(amount), this.duration);
  }

  public setDuration(amount: number) {
    return new Note(this.index, this.phoneme, this.pitch, this.duration.setLength(amount));
  }
 
  public longer(amount: number = 1) {
    return new Note(this.index, this.phoneme, this.pitch, this.duration.longer(amount));
  }

  public shorter(amount: number = 1) {
    return new Note(this.index, this.phoneme, this.pitch, this.duration.shorter(amount));
  }

  public copy() {
    return new Note(this.index, this.phoneme, this.pitch, this.duration);
  }

  public toggleRest() {
    return new Note(this.index, this.phoneme, this.pitch, this.duration, !this.isRest);
  }

  public equals(note?: Note): boolean {
    return this.index === note?.index
      && this.phoneme === note?.phoneme
      && this.pitch.equals(note?.pitch)
      && this.duration.equals(note?.duration)
    ;
  }

  public get obj() {
    return {
      phoneme: this.phoneme,
      pitch: this.pitch.obj,
      duration: this.duration.obj,
    };
  }
}