import { Config } from "./config";
import { Note } from "./Note";

export class Song {
  public notes: Note[];
  private _elapsed: number[] = [];
  public config: Config;
  public get totalDuration() {
    return this.notes
      .map(note => note.duration?.length ?? 0)
      .reduce((a, b) => a + b, 0)
    ;
  }

  constructor(notes?: Note[], config?: Config) {
    this.notes = notes ?? [];
    this.config = config ?? new Config();
    this.initElapsed();
  }

  static fromJson(song?: any) {
    return song ? new Song(
      song.notes.map((n: any, i: number) => Note.fromJson(n, i)),
      Config.fromJson(song.config)
    ) : new Song();
  }

  private initElapsed() {
    let elapsed = 0;
    for (let i = 0; i < this.notes.length; i++) {
      if (i > 0) {
        const leftNote = this.notes[i-1];
        elapsed += (leftNote.duration?.length ?? 0);
      }
      this._elapsed.push(elapsed);
    }
  }

  public elapsed(index: number) {
    return this._elapsed[index];
  }

  public duplicate(index: number) {
    if (index >= 0) {
      this.notes?.splice(index, 0, this.notes[index]);
    } else {
      debugger;
    }
  }
  
  public delete(index: number) {
    if (index >= 0) {
      this.notes?.splice(index, 1);
    } else {
      debugger;
    }
  }

  public toJson() {
    return JSON.stringify({
      notes: this.notes.map(n => n.obj),
      config: this.config.obj
    });
  }
}