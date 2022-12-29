import { Config, Note } from ".";

export class NoteSelector {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public get right() { return this.x + this.width; }
  public get bottom() { return this.y + this.height; }

  constructor(notes: Note[], config: Config, noteIndex: number, gridInfo: any) {
    const note = notes[noteIndex];
    const {
      cellSize: gridCellSize,
      height: gridHeight,
      padding: gridPadding,
      pitchLabelSize
    } = gridInfo;

    const prev = notes[noteIndex - 1];
    const lowestPitch = config.lowestPitch.code;
    const relativePitch = (note.isRest ? prev.pitch.code : note.pitch.code) - lowestPitch;

    this.x = pitchLabelSize + gridPadding + note.start * gridCellSize;
    this.y = gridHeight - ((relativePitch + 1) * gridCellSize - gridPadding);
    this.width = gridCellSize * note.duration.length;
    this.height = gridCellSize;
  }
}
