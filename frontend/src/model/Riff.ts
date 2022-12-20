import { Measure } from ".";

export class Riff {
  public measures: Measure[];
  public get notes() {
    return this.measures.flatMap(m => m.notes);
  }

  constructor(measures: Measure[]) {
    this.measures = measures;
  }

  static fromJson(measures: any[]) {
    return new Riff(measures.map(m => Measure.fromJson(m.notes)));
  }

  public duplicate(index: number) {
    const targetNote = this.notes?.[index];
    if (targetNote && this.measures) {
      for (let i = 0; i < this.measures.length; i++) {
        const m = this.measures[i];
        const foundIndex = m.notes.findIndex(n => n === targetNote) ?? -1;
        if (foundIndex >= 0) {
          m.duplicate(foundIndex);
          return;
        }
      }
    }
  }

  public delete(index: number) {
    const targetNote = this.notes?.[index];
    if (targetNote && this.measures) {
      for (let i = 0; i < this.measures.length; i++) {
        const m = this.measures[i];
        const foundIndex = m.notes.findIndex(n => n === targetNote) ?? -1;
        if (foundIndex >= 0) {
          m.delete(foundIndex);
          return;
        }
      }
    }
  }
}