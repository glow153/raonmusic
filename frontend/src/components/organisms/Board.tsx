import { useState } from 'react';
import { Layer, Stage } from 'react-konva';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Note as NoteModel } from '../../model/Note';
import { Song } from '../../model/Song';
import { Note } from '../atoms';
import Grid from '../molecules/Grid';

export const MIN_NOTE_SIZE = 30;
const MEASURES = 2;
const LOWEST_PITCH = 24;


interface BoardContainerProp {
  padding: number;
  height: number;
  scrollbarWidth: number;
}
const BoardContainer = styled.div<BoardContainerProp>`
  margin-top: 25px;
  width: 100%;
  max-width: 960px;
  height: ${p => p.height + (p.padding*2) + p.scrollbarWidth}px;
  overflow: scroll;
  border: 1px solid #eee;
  border-radius: ${p => p.scrollbarWidth}px;
  &::-webkit-scrollbar {
    width: ${p => p.scrollbarWidth}px;
    height: ${p => p.scrollbarWidth}px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: ${p => p.scrollbarWidth}px;
    background-color: ${Colors.gray};
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

interface Prop {
  song: Song;
  padding?: number;
  stageRef: any;
  onSelectNote: (note?: NoteModel) => void;
}

const Board = ({
  song,
  padding = 16,
  stageRef,
  onSelectNote,
}: Prop) => {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>();
  const language = song.config.lang;
  const songLength = song.config.measures * 16;
  const highestPitch = song.config.highestPitch.code;
  const lowestPitch = song.config.lowestPitch.code;

  const boardHeight = ((highestPitch - lowestPitch) + 1) * MIN_NOTE_SIZE;
  const stageWidth = songLength * MIN_NOTE_SIZE + (padding*2);
  const stageHeight = boardHeight + (padding*2);

  return (
    <BoardContainer
      padding={padding}
      height={boardHeight}
      scrollbarWidth={10}
    >
      <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
        <Layer>
          <Grid
            config={song.config}
            cellSize={MIN_NOTE_SIZE}
            length={songLength}
            height={boardHeight}
            padding={padding}
            onClick={() => {
              setSelectedNoteIndex(undefined);
              onSelectNote(undefined);
            }}
          />
          {song.notes?.map((note, i) => { // dhpark: notes
            const prevPitch = i > 0 ? song.notes[i-1].pitch?.code ?? 0 : 0;
            return (
              <Note key={`note${i}`}
                note={note}
                gridCellSize={MIN_NOTE_SIZE}
                gridHeight={boardHeight}
                gridPadding={padding}
                left={song.elapsed(i)}
                restPitch={note.isRest ? prevPitch : undefined}
                lowestPitch={lowestPitch}
                isSelected={i === selectedNoteIndex}
                language={language}
                onClick={(note) => {
                  setSelectedNoteIndex(i);
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
