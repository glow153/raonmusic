import { Note } from "./Note";

export class Riff {
  public notes?: Note[];

  constructor(notes: Note[]) {
    this.notes = notes;
  }

  public duplicate(index: number) {
    this.notes?.splice(index, 0, this.notes[index]);
  }
  public delete(index: number) {
    this.notes?.splice(index, 1);
  }
}