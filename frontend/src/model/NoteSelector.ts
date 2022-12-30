import { Config, Note } from ".";

export class NoteSelector {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public get right() { return this.x + this.width; }
  public get bottom() { return this.y + this.height; }

  constructor(notes: Note[], config: Config, selectedNote: Note, gridInfo: any) {
    // console.log('NoteSelector>> notes:', notes, ', config:', config, ', selectedNote:', selectedNote, ', gridInfo:', gridInfo);
    const {
      cellSize: gridCellSize,
      padding: gridPadding,
      pitchLabelSize
    } = gridInfo;
    
    const prev = notes[selectedNote.index - 1];
    const lowestPitch = config.lowestPitch.code;
    const highestPitch = config.highestPitch.code;
    const gridHeight = ((highestPitch - lowestPitch) + 1) * gridCellSize;
    const relativePitch = (selectedNote.isRest ? prev.pitch.code : selectedNote.pitch.code) - lowestPitch;

    this.x = pitchLabelSize + gridPadding + selectedNote.start * gridCellSize;
    this.y = gridHeight - ((relativePitch + 1) * gridCellSize - gridPadding);
    this.width = gridCellSize * selectedNote.duration.length;
    this.height = gridCellSize;
  }

  public get obj() {
    return JSON.stringify({x: this.x, y: this.y, width: this.width, height: this.height});
  }
}
