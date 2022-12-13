import { Duration } from "./Duration";
import { Pitch } from "./Pitch";

export class Note {
  public phoneme?: string;
  public pitch?: Pitch;
  public duration?: Duration;

  constructor(phoneme?: string, pitch?: Pitch, duration?: Duration) {
    this.phoneme = phoneme ?? '';
    this.pitch = pitch ?? new Pitch();
    this.duration = duration ?? new Duration();
  }

  static fromJson(obj: any) {
    return new Note(
      obj.phoneme,
      Pitch.fromCode(obj.pitch),
      Duration.fromLength(obj.duration)
    );
  }

  public setPitch(value: number) {
    const pitch = Pitch.fromCode(value);
    return new Note(this.phoneme, pitch, this.duration);
  }

  public setDuration(value: number) {
    const duration = Duration.fromLength(value);
    return new Note(this.phoneme, this.pitch, duration);
  }

  public equals(note: Note): boolean {
    return this.phoneme === note.phoneme
      && this.pitch === note.pitch
      && this.duration === note.duration
    ;
  }
}