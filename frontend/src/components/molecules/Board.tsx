import { Layer, Stage } from 'react-konva';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Note as NoteModel } from '../../model/Note';
import { Song } from '../../model/Song';
import { Note } from '../atoms';
import Grid from './Grid';

export const CANVAS_PADDING = 16;
export const MIN_NOTE_SIZE = 30;
export const CANVAS_HEIGHT = MIN_NOTE_SIZE * 13;
const SCROLLBAR_WIDTH = 10;
const MIN_NOTE_DURATION = 1;
const MEASURES = 2;
const LOWEST_PITCH = 24;

const BoardContainer = styled.div`
  margin-top: 25px;
  width: 100%;
  max-width: 960px;
  height: ${CANVAS_HEIGHT + (CANVAS_PADDING*2) + SCROLLBAR_WIDTH}px;
  overflow: scroll;
  border: 1px solid #eee;
  border-radius: ${SCROLLBAR_WIDTH}px;
  &::-webkit-scrollbar {
    height: ${SCROLLBAR_WIDTH}px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: ${SCROLLBAR_WIDTH}px;
    background-color: ${Colors.gray};
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

interface Prop {
  song: Song;
  setSong: React.Dispatch<React.SetStateAction<Song>>;
  stageRef: any;
  selectedNote?: NoteModel;
  setSelectedNote: React.Dispatch<React.SetStateAction<NoteModel | undefined>>;
  onClick: () => void;
  onSelectNote: (note?: NoteModel) => void;
}

const Board = ({
  song,
  stageRef,
  selectedNote,
  setSelectedNote,
  onClick,
  onSelectNote,
}: Prop) => {
  const stageWidth = song.totalDuration * MIN_NOTE_SIZE + (CANVAS_PADDING*2);
  const stageHeight = CANVAS_HEIGHT + (CANVAS_PADDING*2);

  return (
    <BoardContainer>
      <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
        <Layer>
          <Grid song={song}
            cellSize={MIN_NOTE_SIZE}
            height={CANVAS_HEIGHT}
            padding={CANVAS_PADDING}
            onClick={() => {
              console.log('on click grid');
              onSelectNote(undefined);
            }}
          />
          {song.notes.map((note, i) => { // dhpark: notes
            const prevPitch = i > 0 ? song.notes[i-1].pitch?.code ?? 0 : 0;
            return (
              <Note note={note}
                gridCellSize={MIN_NOTE_SIZE}
                gridHeight={CANVAS_HEIGHT}
                gridPadding={CANVAS_PADDING}
                left={song.elapsed(i)}
                pitch={note.isRest ? prevPitch : undefined}
                lowestPitch={LOWEST_PITCH}
                isSelected={note.equals(selectedNote)}
                onClick={(note) => {
                  console.log('onclicknote:')
                  onSelectNote(note);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </BoardContainer>
  );
};

export default Board;
