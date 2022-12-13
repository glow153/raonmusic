import { Note } from "./Note";

export class Measure {
  public notes: Note[];
  get valid(): boolean {
    if (this.notes) {
      return this.notes?.map(n => n.duration.length).reduce((n1, n2) => n1 + n2, 0) === 16;
    } else {
      return false;
    }
  }
  get lyrics () {
    return `"${this.notes?.map(n => n.phoneme).join("")}"`;
  }
  get pitches () {
    return this.notes?.map(n => `${n.pitch}`).join(",");
  }
  get durations() {
    return this.notes?.map(n => `${n.duration}`).join(",");
  }

  constructor(notes: Note[]) {
    this.notes = notes;
  }

  static fromJson(notes: any[]) {
    return new Measure(notes.map(n => Note.fromJson(n)));
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

  public setNote(index: number, note: Note) {
    this.notes[index] = note;
  }

  public toString() {
    return `lyrics:${this.lyrics}, pitches:${this.pitches}, durations:${this.durations}`;
  }
}