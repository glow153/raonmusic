import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Config } from '../../model';
import { Note as NoteModel } from '../../model/Note';
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

const getIndexFromNoteId = (noteId: string) => {
  return parseInt(noteId.split('-')[1]);
}

const getIndexFromStartPos = (notes: NoteModel[], startPos: number): number => {
  if (notes.length > 0) {
    // 1. 맨 앞
    if (startPos < notes[0].start) {
      return 0;
    }

    // 2. 사이
    for (let i = 0; i < notes.length - 1; i++) {
      const prev = notes[i];
      const next = notes[i + 1];
      if (prev.end < startPos && startPos < next.start) {
        return i + 1;
      }
    }

    // 3. 맨 끝
    return notes.length;
  } else {
    // 4. board에 note가 하나도 없으면 0번째
    return 0;
  }
}

interface Prop {
  notes: NoteModel[];
  config: Config;
  cellSize?: number;
  pitchLabelSize?: number;
  padding?: number;
  stageRef: any;
  selectedNote?: NoteModel;
  selectNoteAction: (note?: NoteModel) => void;
  addNoteAction: (note?: NoteModel) => void;
}

const Board = ({
  notes,
  config,
  cellSize = 30,
  pitchLabelSize = 30,
  padding = 30,
  stageRef,
  selectedNote,
  selectNoteAction,
  addNoteAction,
}: Prop) => {
  const selectedNoteIndex = useMemo<number | undefined>(() => selectedNote?.index, [selectedNote]);
  const maxDuration = useMemo<number>(() => config.maxDuration, [config]);
  const language = useMemo<string>(() => config.lang, [config]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [config]);
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [config]);
  const gridHeight = useMemo<number>(() => ((highestPitch - lowestPitch) + 1) * cellSize, [config]);
  const stageWidth = useMemo<number>(() => pitchLabelSize + maxDuration * cellSize + (padding * 2), [config]);
  const stageHeight = useMemo<number>(() => gridHeight + (padding * 2), [config]);

  const [noteSelector, setNoteSelector] = useState<any>();
  const isSelected = useMemo<boolean>(() => noteSelector !== undefined, [noteSelector]);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [isStretchingLeft, setStretchingLeft] = useState<boolean>(false);
  const [isStretchingRight, setStretchingRight] = useState<boolean>(false);

  useEffect(() => {
    // setNoteSelector(selectedNote);
  }, [selectedNote]);

  const onCanvasMouseDown = (re: KonvaEventObject<MouseEvent>) => {
    const attr = re.target.attrs;
    console.log('onClickCanvas> re:', re, ', attr:', attr);
    const shapeId = attr.id;
    if (shapeId?.startsWith('note-')) {
      const index = getIndexFromNoteId(shapeId);
      setNoteSelector(attr);
      selectNoteAction(notes[index]);
      setDragging(true);
    } else if (shapeId?.startsWith('noteselector')) {
      if (shapeId.split('-')[1] === 'stretch') {
        if (shapeId.split('-')[3] === 'left') {
          setStretchingLeft(true);
        } else {
          setStretchingRight(true);
        }
      }
      setDragging(true);
    } else {
      setNoteSelector(undefined);
      setDragging(false);
    }
  };
  const onCanvasMouseMove = (re: KonvaEventObject<MouseEvent>) => {
    if (isStretchingLeft) {
      console.log('onCanvasMouseMove: stretching left:', re);
    } else if (isStretchingRight) {
      console.log('onCanvasMouseMove: stretching right:', re);
    } else if (isDragging && selectedNote) {
      const {x, y, width: w, height: h} = noteSelector;
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
      // TODO: bug fix 필요
      if (0 < offsetX && offsetX < stageWidth) {
        if (x - offsetX > 0 && newNote.index > 0) {
          // 2.1 go left
          const prevNote = notes[newNote.index - 1];
          if (x - offsetX > Math.round(cellSize / 2) && prevNote.end + 1 < newNote.start) {
            newNote.start -= 1;
          }
        } else if (offsetX - (x + w) > 0 && newNote.index < notes.length - 1) {
          // 2.2 go right
          const nextNote = notes[newNote.index + 1];
          if (offsetX - (x + w) > Math.round(cellSize / 2) && newNote.end + 1 < nextNote.end) {
            newNote.start += 1;
          }
        }
      }

      selectNoteAction(newNote);
    } 
  };

  const onCanvasMouseUp = useCallback((re: any) => {
    setDragging(false);
    setStretchingLeft(false);
    setStretchingRight(false);
  }, []);
  
  const onStretchLeft = useCallback((re: any) => {
    console.log('onStretchLeft: re=', re);
  }, []);
  
  const onStretchRight = useCallback((re: any) => {
    console.log('onStretchLeft: re=', re);
  }, []);

  const onClickGrid = useCallback((evt: any) => {
    // console.log('onClickGrid> evt:', evt);
    selectNoteAction(undefined);
  }, []);
  
  /**
   * board를 더블클릭시 노트를 추가하는 작업을 수행합니다
   * @param re {KonvaEventObject<MouseEvent>} konva mouse event
   */
  const onDblClickInnerGrid = useCallback((re: KonvaEventObject<MouseEvent>) => {
    const startPos = Math.floor((re.evt.offsetX - re.target.attrs.x) / cellSize);
    const pitch = highestPitch - Math.floor((re.evt.offsetY - re.target.attrs.y) / cellSize);
    console.log(`dbl click: startPos=${startPos}, pitch=${pitch}`);
    const index = getIndexFromStartPos(notes, startPos);

    if (notes.length > 0) {
      const duration = Math.max(Math.min(config.defaultDuration.length, ((notes[index]?.start ?? config.maxDuration) - startPos)), 1);
      addNoteAction(NoteModel.default(index, pitch, duration, startPos));
    } else {
      addNoteAction(NoteModel.default(index, pitch, config.defaultDuration.length, startPos));
    }

  }, [notes, highestPitch]);

  return (
    <BoardContainer padding={padding} height={gridHeight} scrollbarWidth={10}>
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
            pitchLabelSize={pitchLabelSize}
            cellSize={cellSize}
            length={maxDuration}
            height={gridHeight}
            padding={padding}
            onClick={onClickGrid}
            onDblClickInner={onDblClickInnerGrid}
          />
          {notes?.map((note, i) => { // dhpark: notes
            const prevPitch = i > 0 ? notes[i-1].pitch?.code ?? 0 : lowestPitch;
            return (
              <Note id={`note-${i}`} key={`note-${i}`}
                note={note}
                gridInfo={{ cellSize, height: gridHeight, padding, pitchLabelSize }}
                start={note.start}
                prevPitch={note.isRest ? prevPitch : undefined}
                lowestPitch={lowestPitch}
                isSelected={i === selectedNoteIndex}
                language={language}
                onSelect={selectNoteAction}
              />
            );
          })}
          {isSelected && ( // dhpark: Note Selector shape
            <NoteSelector stretchable
              dimension={noteSelector}
              onCanvasMouseDown={onCanvasMouseDown}
              onCanvasMouseMove={onCanvasMouseMove}
              onCanvasMouseUp={onCanvasMouseUp}
              // onStretchLeft={onStretchLeft}
              // onStretchRight={onStretchRight}
            />
          )}
        </Layer>
      </Stage>
    </BoardContainer>
  );
};

export default Board;
