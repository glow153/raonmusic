import { Duration } from "./Duration";
import { Pitch } from "./Pitch";

export class Note {
  public phoneme?: string;
  public pitch: Pitch;
  public duration: Duration;

  constructor(phoneme: string, pitch: Pitch, duration: Duration) {
    this.phoneme = phoneme;
    this.pitch = pitch;
    this.duration = duration;
  }

  static fromJson(obj: any) {
    return new Note(
      obj.phoneme,
      Pitch.fromCode(obj.pitch),
      Duration.fromLength(obj.duration)
    );
  }

  public setPitch(value: number) {
    this.pitch = Pitch.fromCode(value);
    return this;
  }

  public equals(note: Note): boolean {
    return this.phoneme === note.phoneme
      && this.pitch === note.pitch
      && this.duration === note.duration
    ;
  }
}