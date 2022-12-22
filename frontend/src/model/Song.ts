import { Config, Note } from ".";

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

  private initElapsed() {
    this._elapsed = this.notes.map(n => n.start);
  }

  public elapsed(index: number) {
    return this._elapsed[index];
  }

  public duplicate(index: number) {
    if (0 <= index && index < this.notes.length) {
      this.notes?.splice(index, 0, this.notes[index].copy());
      for (let i = index; i < this.notes.length; i++) {
        this.notes[i].index = i;
      }
    } else {
      debugger;
    }
    return this.notes;
  }
  
  public delete(index: number) {
    if (0 <= index && index < this.notes.length) {
      this.notes?.splice(index, 1);
      for (let i = index; i < this.notes.length; i++) {
        this.notes[i].index = i;
      }
    } else {
      debugger;
    }
    return this.notes;
  }

  public setPitch(index: number, value: number) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.setPitch(value));
    return this.notes;
  }
  public lower(index: number) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.lower());
    return this.notes;
  }
  public higher(index: number) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.higher());
    return this.notes;
  }

  public setDuration(index: any, amount: number) {
    if(typeof index === 'number') {
      const targetNote = this.notes[index];
      const originalDuration = targetNote.duration.length;
      const diff = amount - originalDuration;
      this.notes.splice(index, 1, targetNote.setDuration(amount));
      for (let i = index + 1; i < this.notes.length; i++) {
        if (diff > 0) this.notes[i].longer(diff);
        else if (diff < 0) this.notes[i].shorter(diff);
      }
      return this.notes;
    }
  }
  public shorter(index: number, amount: number = 1) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.shorter(amount));
    for (let i = index + 1; i < this.notes.length; i++) {
      this.notes[i].shorter(amount);
    }
    return this.notes;
  }
  public longer(index: number, amount: number = 1) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.longer(amount));
    for (let i = index + 1; i < this.notes.length; i++) {
      this.notes[i].longer(amount);
    }
    return this.notes;
  }

  static fromJson(song?: any) {
    if (song) {
      // 1. start position
      let elapsed = 0;
      for (let i = 0; i < song.notes.length; i++) {
        if (i > 0) {
          const prev = song.notes[i-1];
          elapsed += (prev.duration);
        }
        song.notes[i].start = elapsed;
      }

      // 2. instantiate note (without SP)
      const notes = song.notes
        .filter((n: any) => n.phoneme !== 'SP')
        .map((n: any, i: number, a: any[]) => Note.fromJson(n, i));

      const config = Config.fromJson(song.config);
      return new Song(notes, config);
    } else {
      return new Song();
    }
  }

  public toJson() {
    // 1. create note objects
    const noteObjs = this.notes.map(n => n.obj);

    // 2. fill blank with 'SP'
    // 2.1 if there is SP in between notes
    for (let i = 1; i < this.notes.length; i++) {
      const prevEnd = this.notes[i-1].end;
      const currStart = this.notes[i].start;
      if (prevEnd + 1 < currStart) {
        noteObjs.splice(i, 0, {
          phoneme: 'SP',
          pitch: -1,
          duration: currStart - prevEnd - 1
        });
      }
    }
    // 2.2 if first note is SP
    if (this.notes[0].start !== 0) {
      noteObjs.splice(0, 0, {
        phoneme: 'SP',
        pitch: -1,
        duration: this.notes[0].start
      });
    }

    // 3. serialize
    return JSON.stringify({
      notes: noteObjs,
      config: this.config.obj
    });
  }
}