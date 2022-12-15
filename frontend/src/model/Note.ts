import { Duration } from "./Duration";
import { Pitch } from "./Pitch";

export interface INote {

  phoneme?: string;
  pitch?: Pitch;
  duration?: Duration;
}

export class Note implements INote {
  public phoneme?: string;
  public pitch: Pitch;
  public duration: Duration;
  public get isRest() {
    return ((this.pitch?.code ?? 0) < 0) || this.phoneme === '-';
  }

  constructor(phoneme?: string, pitch?: Pitch, duration?: Duration) {
    this.phoneme = phoneme ?? '';
    this.pitch = pitch ?? new Pitch();
    this.duration = duration ?? new Duration();
  }

  static rest() {
    return new Note('-', Pitch.fromCode(0), Duration.fromLength(4));
  }

  static fromJson(obj: any) {
    return new Note(
      obj.phoneme,
      Pitch.fromCode(obj.pitch),
      Duration.fromLength(obj.duration)
    );
  }

  public toJson(){
    return JSON.stringify(this);
  }
  

  public setPitch(value: number) {
    return new Note(this.phoneme, this.pitch.setPitch(value), this.duration);
  }
  
  public higher(amount: number = 1) {
    return new Note(this.phoneme, this.pitch.higher(amount), this.duration);
  }

  public lower(amount: number = 1) {
    return new Note(this.phoneme, this.pitch.lower(amount), this.duration);
  }

  public setDuration(amount: number) {
    return new Note(this.phoneme, this.pitch, this.duration.setLength(amount));
  }
 
  public longer(amount: number = 1) {
    return new Note(this.phoneme, this.pitch, this.duration.longer(amount));
  }

  public shorter(amount: number = 1) {
    return new Note(this.phoneme, this.pitch, this.duration.shorter(amount));
  }

  public equals(note?: Note): boolean {
    return this.phoneme === note?.phoneme
      && this.pitch.equals(note?.pitch)
      && this.duration.equals(note?.duration)
    ;
  }
}