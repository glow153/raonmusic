import { Duration, Pitch } from ".";

export class Note {
  public index: number;
  public phoneme?: string;
  public pitch: Pitch;
  public duration: Duration;
  public start: number;
  public isRest: boolean;
  public get end() {return this.start + this.duration.length - 1;}

  constructor(index: number, phoneme?: string, pitch?: Pitch, duration?: any, start?: number, isRest?: boolean) {
    this.index = index;
    this.phoneme = phoneme ?? '';
    this.pitch = pitch ?? new Pitch();
    this.duration = typeof duration === 'number' ? Duration.fromLength(duration) : (duration ?? new Duration());
    this.start = start ?? 0;
    this.isRest = isRest ?? false;
  }

  public setPhoneme(word: string) {
    return new Note(this.index, word, this.pitch, this.duration, this.start, this.isRest);
  }

  public setPitch(value: number) {
    return new Note(this.index, this.phoneme, this.pitch.setPitch(value), this.duration, this.start, this.isRest);
  }
  
  public higher(amount: number = 1) {
    return new Note(this.index, this.phoneme, this.pitch.higher(amount), this.duration, this.start, this.isRest);
  }

  public lower(amount: number = 1) {
    return new Note(this.index, this.phoneme, this.pitch.lower(amount), this.duration, this.start, this.isRest);
  }

  public setDuration(amount: number) {
    return new Note(this.index, this.phoneme, this.pitch, this.duration.setLength(amount), this.start, this.isRest);
  }
 
  public longer(amount: number = 1) {
    return new Note(this.index, this.phoneme, this.pitch, this.duration.longer(amount), this.start, this.isRest);
  }

  public shorter(amount: number = 1) {
    return new Note(this.index, this.phoneme, this.pitch, this.duration.shorter(amount), this.start, this.isRest);
  }
  
  public toggleRest() {
    return new Note(this.index, this.phoneme, this.pitch, this.duration, this.start, !this.isRest);
  }
  
  public copy() {
    return new Note(this.index, this.phoneme, this.pitch, this.duration, this.start, this.isRest);
  }


  public equals(note?: Note): boolean {
    return this.index === note?.index
      && this.phoneme === note?.phoneme
      && this.pitch.equals(note?.pitch)
      && this.duration.equals(note?.duration)
    ;
  }

  static fromJson(obj: any, index?: number) {
    return new Note(
      index ?? 0,
      obj.phoneme,
      Pitch.fromCode(obj.pitch),
      Duration.fromLength(obj.duration),
      obj.start ?? 0,
      (obj.pitch < 0 || obj.isRest === true) ? true : false
    );
  }

  public get obj() {
    return {
      phoneme: this.phoneme,
      pitch: this.pitch.obj,
      duration: this.duration.obj,
    };
  }
}