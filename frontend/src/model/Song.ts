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
    return [...this.notes];
  }
  public lower(index: number) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.lower());
    return [...this.notes];
  }
  public higher(index: number) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.higher());
    return [...this.notes];
  }

  public setDuration(index: any, amount: number) {
    const targetNote = this.notes[index];
    const originalDuration = targetNote.duration.length;
    const diff = amount - originalDuration;
    console.log('targetNote:',targetNote,', diff:', diff)
    this.notes.splice(index, 1, targetNote.setDuration(amount));
    for (let i = index + 1; i < this.notes.length; i++) {
      this.notes[i].start += diff;
    }
    return [...this.notes];
  }
  public shorter(index: number, amount: number = 1) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.shorter(amount));
    for (let i = index + 1; i < this.notes.length; i++) {
      this.notes[i].start -= amount;
    }
    return [...this.notes];
  }
  public longer(index: number, amount: number = 1) {
    const targetNote = this.notes[index];
    this.notes.splice(index, 1, targetNote.longer(amount));
    for (let i = index + 1; i < this.notes.length; i++) {
      this.notes[i].start += amount;
    }
    return [...this.notes];
  }

  static fromJson(song?: any) {
    if (song) {
      // 1. set start position
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
        .filter((n: any) => n.pitch !== -1)
        .map((n: any, i: number) => Note.fromJson(n, i));

      const config = Config.fromJson(song.config);
      return new Song(notes, config);
    } else {
      return new Song();
    }
  }

  public toJson() {
    // 1. create note objects
    const noteObjs = this.notes.map(n => n.obj);

    for (let i = 1; i < this.notes.length; i++) {
      const prevEnd = this.notes[i-1].end;
      const currStart = this.notes[i].start;

      if (prevEnd + 1 < currStart) {
        // 2. if there is SP in between notes
        noteObjs.splice(i, 0, {
          phoneme: 'SP',
          pitch: -1,
          duration: currStart - prevEnd - 1
        });
      } else if (this.notes[i].isRest) {
        // 3. if a note is rest, replace with AP
        noteObjs.splice(i, 1, {
          phoneme: 'AP',
          pitch: -2,
          duration: noteObjs[i].duration
        });
      }
    }

    // 4. if first note is SP, add SP
    if (this.notes[0].start !== 0) {
      noteObjs.splice(0, 0, {
        phoneme: 'SP',
        pitch: -1,
        duration: this.notes[0].start
      });
    }

    // 5. concatenate lyric
    const configObj = this.config.obj;
    configObj.lyric = this.notes.map(n => n.phoneme).join('');

    // 3. serialize
    return JSON.stringify({
      notes: noteObjs,
      config: configObj
    });
  }
}