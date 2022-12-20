import { useCallback, useMemo, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Note as NoteModel } from '../../model/Note';
import { Song } from '../../model/Song';
import { Note } from '../atoms';
import Grid from '../molecules/Grid';

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
  border: 1px solid #dfdfdf;
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
  cellSize?: number;
  padding?: number;
  stageRef: any;
  onSelectNote: (note?: NoteModel) => void;
}

const Board = ({
  song,
  cellSize = 30,
  padding = 16,
  stageRef,
  onSelectNote,
}: Prop) => {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>();
  const language = useMemo<string>(() => song.config.lang, [song]);
  const songLength = useMemo<number>(() => song.config.measures * 16, [song]);
  const highestPitch = useMemo<number>(() => song.config.highestPitch.code, [song]);
  const lowestPitch = useMemo<number>(() => song.config.lowestPitch.code, [song]);
  const boardHeight = useMemo<number>(() => ((highestPitch - lowestPitch) + 1) * cellSize, [song]);
  const stageWidth = useMemo<number>(() => songLength * cellSize + (padding * 2), [song]);
  const stageHeight = useMemo<number>(() => boardHeight + (padding * 2), [song]);

  const onClickGrid = useCallback(() => {
    setSelectedNoteIndex(undefined);
    onSelectNote(undefined);
  }, []);

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
            cellSize={cellSize}
            length={songLength}
            height={boardHeight}
            padding={padding}
            onClick={onClickGrid}
          />
          {song.notes?.map((note, i) => { // dhpark: notes
            const prevPitch = i > 0 ? song.notes[i-1].pitch?.code ?? 0 : lowestPitch;
            return (
              <Note key={`note${i}`}
                note={note}
                gridCellSize={cellSize}
                gridHeight={boardHeight}
                gridPadding={padding}
                left={song.elapsed(i)}
                restPitch={note.isRest ? prevPitch : undefined}
                lowestPitch={lowestPitch}
                isSelected={i === selectedNoteIndex}
                language={language}
                onSelect={(note) => {
                  setSelectedNoteIndex(i);
                  onSelectNote(note);
                }}
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
