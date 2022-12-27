import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Config } from '../../model';
import { Note as NoteModel } from '../../model/Note';
import { Song } from '../../model/Song';
import { Note } from '../atoms';
import { NoteSelector } from '../molecules';
import Grid from '../molecules/Grid';

interface BoardContainerProp {
  padding: number;
  height: number;
  scrollbarWidth: number;
}
const BoardContainer = styled.div<BoardContainerProp>`
  margin-top: 25px;
  max-width: 1000px;
  height: ${p => p.height + (p.padding * 2) + p.scrollbarWidth}px;
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
  selectedNote?: NoteModel;
  cellSize?: number;
  padding?: number;
  stageRef: any;
  onSelectNote: (note?: NoteModel) => void;
}

const selectBorderWidth = 5;

const getIndexFromNoteId = (noteId: string) => {
  return parseInt(noteId.split('-')[1]);
}

const Board = ({
  song,
  selectedNote,
  cellSize = 30,
  padding = 16,
  stageRef,
  onSelectNote,
}: Prop) => {
  const selectedNoteIndex = useMemo<number | undefined>(() => selectedNote?.index ?? undefined, [song, selectedNote]);
  const config = useMemo<Config>(() => song.config, [song]);
  const language = useMemo<string>(() => config.lang, [song]);
  const songLength = useMemo<number>(() => config.measures * 16, [song]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [song]);
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [song]);
  const boardHeight = useMemo<number>(() => ((highestPitch - lowestPitch) + 1) * cellSize, [song]);
  const stageWidth = useMemo<number>(() => songLength * cellSize + (padding * 2), [song]);
  const stageHeight = useMemo<number>(() => boardHeight + (padding * 2), [song]);

  const [noteSelectorDimension, setNoteSelectorDimension] = useState<any>();
  const isSelected = useMemo<boolean>(() => noteSelectorDimension !== undefined, [noteSelectorDimension]);
  const [isDragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    // setNoteSelectorDimension(selectedNote);
  }, [selectedNote]);

  const onCanvasMouseDown = (re: KonvaEventObject<MouseEvent>) => {
    const attr = re.target.attrs;
    console.log('onClickCanvas> evt:', re, ', attr:', attr);
    const shapeId = attr.id;
    if (shapeId?.startsWith('note-')) {
      const index = getIndexFromNoteId(shapeId);
      setNoteSelectorDimension(attr);
      onSelectNote(song.notes[index]);
      setDragging(true);
    } else if (shapeId === 'noteselector') {
      setDragging(true);
    } else {
      setNoteSelectorDimension(undefined);
      setDragging(false);
    }
  };
  const onCanvasMouseMove = (re: KonvaEventObject<MouseEvent>) => {
    if (isDragging && selectedNote) {
      const {x, y, width: w, height: h} = noteSelectorDimension;
      const {offsetX, offsetY} = re.evt;
      let newNote = selectedNote;
      // 1. Y축 이동 -> pitch
      if (0 < offsetY && offsetY < stageHeight) {
        if (y - offsetY > 0) {
          // 1.1 pitch up
          if (y - offsetY > Math.round(h / 2)) {
            newNote = selectedNote.higher();
          }
        } else if (offsetY - (y + h) > 0) {
          // 1.2 pitch down
          if (offsetY - (y + h) > Math.round(h / 2)) {
            newNote = selectedNote.lower();
          }
        }
      }

      // 2. X축 이동 -> start position
      if (0 < offsetX && offsetX < stageWidth) {
        if (x - offsetX > 0 && newNote.index > 0) {
          // 2.1 go left
          const prevNote = song.notes[newNote.index - 1];
          if (x - offsetX > Math.round(cellSize / 2) && prevNote.end + 1 < newNote.start) {
            newNote.start -= 1;
          }
        } else if (offsetX - (x + w) > 0 && newNote.index < song.notes.length - 1) {
          // 2.2 go right
          const nextNote = song.notes[newNote.index + 1];
          if (offsetX - (x + w) > Math.round(cellSize / 2) && newNote.end + 1 < nextNote.end) {
            newNote.start += 1;
          }
        }
      }
      onSelectNote(newNote);
    }
  };

  const onCanvasMouseUp = useCallback((re: any) => {
    setDragging(false);
  }, []);
  
  const onStretchLeft = useCallback((re: any) => {
    console.log('onStretchLeft: re=', re);
  }, []);
  
  const onStretchRight = useCallback((re: any) => {
    console.log('onStretchLeft: re=', re);
  }, []);

  const onClickGrid = useCallback((evt: any) => {
    // console.log('onClickGrid> evt:', evt);
    onSelectNote(undefined);
  }, []);


  return (
    <BoardContainer padding={padding} height={boardHeight} scrollbarWidth={10}>
      <Stage width={stageWidth} height={stageHeight} ref={stageRef}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
        // onTouchStart={onCanvasTouchStart}
        // onTouchMove={onCanvasTouchMove}
        // onTouchEnd={onCanvasMouseUp}
      >
        <Layer>
          <Grid
            config={config}
            cellSize={cellSize}
            length={songLength}
            height={boardHeight}
            padding={padding}
            onClick={onClickGrid}
          />
          {song.notes?.map((note, i) => { // dhpark: notes
            const prevPitch = i > 0 ? song.notes[i-1].pitch?.code ?? 0 : lowestPitch;
            return (
              <Note id={`note-${i}`} key={`note-${i}`}
                note={note}
                gridCellSize={cellSize}
                gridHeight={boardHeight}
                gridPadding={padding}
                start={note.start}
                prevPitch={note.isRest ? prevPitch : undefined}
                lowestPitch={lowestPitch}
                isSelected={i === selectedNoteIndex}
                language={language}
                onSelect={(note) => {
                  onSelectNote(note);
                }}
                onClick={(note) => {
                  onSelectNote(note);
                }}
              />
            );
          })}
          {isSelected && ( // dhpark: Note Selector shape
            <NoteSelector
              dimension={noteSelectorDimension}
              borderWidth={selectBorderWidth}
              onCanvasMouseDown={onCanvasMouseDown}
              onCanvasMouseMove={onCanvasMouseMove}
              onCanvasMouseUp={onCanvasMouseUp}
              onStretchLeft={onStretchLeft}
              onStretchRight={onStretchRight}
            />
          )}
        </Layer>
      </Stage>
    </BoardContainer>
  );
};

export default Board;
