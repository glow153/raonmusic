import { Duration } from "./Duration";
import { Pitch } from "./Pitch";

export interface INote {
  index: number;
  phoneme?: string;
  pitch?: Pitch;
  duration?: Duration;
}

export class Note implements INote {
  public index: number;
  public phoneme?: string;
  public pitch: Pitch;
  public duration: Duration;
  public get isRest() {
    return ((this.pitch?.code ?? 0) < 0) || (this.phoneme === 'SP') || (this.phoneme === 'AP');
  }

  constructor(index: number, phoneme?: string, pitch?: Pitch, duration?: Duration) {
    this.index = index;
    this.phoneme = phoneme ?? '';
    this.pitch = pitch ?? new Pitch();
    this.duration = duration ?? new Duration();
  }

  static rest(index: number) {
    return new Note(index, '-', Pitch.fromCode(0), Duration.fromLength(4));
  }

  static fromJson(obj: any, index?: number) {
    return new Note(
      index ?? 0,
      obj.phoneme,
      Pitch.fromCode(obj.pitch),
      Duration.fromLength(obj.duration)
    );
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