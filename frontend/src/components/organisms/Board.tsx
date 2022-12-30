import { KonvaEventObject } from 'konva/lib/Node';
import React, { useCallback, useMemo, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Config } from '../../model';
import { Note as NoteModel } from '../../model/Note';
import { NoteSelector as NoteSelectorModel } from '../../model/NoteSelector';
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

const getIndexFromStartPos = (notes: NoteModel[], config: Config, startPos: number): number => {
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
    if (startPos <= config.maxDuration) {
      return notes.length;
    } else {
      return -1;
    }
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
  noteSelector?: NoteSelectorModel;
  selectNoteAction: (note?: NoteModel) => void;
  addNoteAction: (note?: NoteModel) => void;
  changeNoteAction: (note?: NoteModel) => void;
}

const Board = ({
  notes,
  config,
  cellSize = 30,
  padding = 16,
  pitchLabelSize = 30,
  stageRef,
  selectedNote,
  noteSelector,
  selectNoteAction,
  addNoteAction,
  changeNoteAction,
}: Prop) => {
  const selectedNoteIndex = useMemo<number | undefined>(() => selectedNote?.index, [selectedNote]);
  const maxDuration = useMemo<number>(() => config.maxDuration, [config]);
  const language = useMemo<string>(() => config.lang, [config]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [config]);
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [config]);
  const gridHeight = useMemo<number>(() => ((highestPitch - lowestPitch) + 1) * cellSize, [config]);
  const stageWidth = useMemo<number>(() => pitchLabelSize + (maxDuration * cellSize) + (padding * 2), [config]);
  const stageHeight = useMemo<number>(() => gridHeight + (padding * 2), [config]);
  const threshold = useMemo<number>(() => Math.round(cellSize / 2), [cellSize]);

  const [isDragging, setDragging] = useState<boolean>(false);
  const [isStretchingLeft, setStretchingLeft] = useState<boolean>(false);
  const [isStretchingRight, setStretchingRight] = useState<boolean>(false);

  /**
   * 캔버스에서 마우스를 클릭한 경우 호출되는 callback function입니다.
   * @param ke {KonvaEventObject<MouseEvent>} konva mouse event
   */
  const onCanvasMouseDown = useCallback((ke: KonvaEventObject<MouseEvent>) => {
    const attr = ke.target.attrs;
    console.log('onClickCanvas> re:', ke, ', attr:', attr);
    const shapeId = attr.id;
    if (shapeId?.startsWith('note-')) {
      // 1. 클릭한 shape가 note인 경우
      const index = getIndexFromNoteId(shapeId);
      selectNoteAction(notes[index]);
      setDragging(true);
    } else if (shapeId?.startsWith('noteselector')) {
      // 2. 클릭한 shape가 note selector인 경우
      if (shapeId.split('-')[1] === 'stretch') {
        if (shapeId.split('-')[3] === 'left') {
          setStretchingLeft(true);
        } else if (shapeId.split('-')[3] === 'right') {
          setStretchingRight(true);
        }
      }
      setDragging(true);
    }
  }, [notes]);

  /**
   * 캔버스에서 마우스를 움직이는 경우 호출되는 callback function입니다.
   * @param ke {KonvaEventObject<MouseEvent>} konva mouse event
   */
  const onCanvasMouseMove = useCallback((ke: KonvaEventObject<MouseEvent>) => {
    if (isDragging && selectedNote && noteSelector) { // 드래그 중인 경우
      let newNote = selectedNote;
      const {x, y, width: w, height: h, right, bottom} = noteSelector;
      const {offsetX, offsetY} = ke.evt;
      console.log(`onCanvasMouseMove>>>>>> noteSelector:${noteSelector.obj} , offsetX:${offsetX}`);

      if (isStretchingLeft) {
        // 1. 왼쪽 핸들을 늘리고 있는 경우
        const diff = x - offsetX;
        if (diff > threshold) {
          newNote = newNote.longer().goLeft();
        } else if (diff < -threshold) {
          newNote = newNote.shorter().goRight();
        }
      } else if (isStretchingRight) {
        // 2. 오른쪽 핸들을 늘리고 있는 경우
        const diff = offsetX - right;
        if (diff > threshold) {
          newNote = newNote.longer().goLeft();
        } else if (diff < -threshold) {
          newNote = newNote.shorter();
        }
      } else {
        // 3. note를 움직이는 경우
        if (0 < offsetY && offsetY < stageHeight) {
          // 3.1 Y축 이동 -> pitch
          if (y - offsetY > 0) {
            // 3.1.1 pitch up
            if (y - offsetY > threshold) {
              newNote = newNote.higher();
            }
          } else if (offsetY - bottom > 0) {
            // 3.1.2 pitch down
            if (offsetY - bottom > threshold) {
              newNote = newNote.lower();
            }
          }
        }
  
        // 3.2 X축 이동 -> start position
        if (0 < offsetX && offsetX < stageWidth) {
          if (x - offsetX > 0 && newNote.index >= 0) {
            // 3.2.1 go left
            const prevNote = notes[newNote.index - 1];
            if (x - offsetX > threshold && (prevNote?.end ?? 0) < newNote.start) {
              newNote = newNote.goLeft();
            }
          } else if (offsetX - right > 0 && newNote.index < notes.length) {
            // 3.2.2 go right
            const nextNote = notes[newNote.index + 1];
            if (offsetX - right > threshold && newNote.end < (nextNote?.end ?? config.maxDuration)) {
              newNote = newNote.goRight();
            }
          }
        }
      }
      selectNoteAction(newNote);
    }
  }, [isStretchingLeft, isStretchingRight, selectedNote, isDragging, noteSelector, stageWidth]);

  /**
   * 캔버스에서 마우스 클릭을 뗀 경우 호출되는 callback function입니다.
   * @param ke {KonvaEventObject<MouseEvent>} konva mouse event
   */
  const onCanvasMouseUp = useCallback((ke: any) => {
    setDragging(false);
    if (isStretchingLeft) {
      setStretchingLeft(false);
    }
    if (isStretchingRight) {
      setStretchingRight(false);
    }
  }, [isStretchingLeft, isStretchingRight]);
  
  /**
   * 캔버스에서 grid(노트가 아닌 여백)를 클릭한 경우 호출되는 callback function입니다.
   * @param ke {KonvaEventObject<MouseEvent>} konva mouse event
   */
  const onClickGrid = useCallback((ke: any) => {
    // console.log('onClickGrid> evt:', evt);
    selectNoteAction(undefined);
  }, []);
  
  /**
   * board를 더블클릭시 노트를 추가하는 작업을 수행합니다
   * @param ke {KonvaEventObject<MouseEvent>} konva mouse event
   */
  const onDblClickInnerGrid = useCallback((ke: KonvaEventObject<MouseEvent>) => {
    const startPos = Math.floor((ke.evt.offsetX - ke.target.attrs.x) / cellSize);
    const pitch = highestPitch - Math.floor((ke.evt.offsetY - ke.target.attrs.y) / cellSize);
    console.log(`dbl click: startPos=${startPos}, pitch=${pitch}`);
    const index = getIndexFromStartPos(notes, config, startPos);

    if (index >= 0) {
      if (notes.length > 0) {
        const duration = Math.max(Math.min(config.defaultDuration.length, ((notes[index]?.start ?? config.maxDuration) - startPos)), 1);
        addNoteAction(NoteModel.default(index, pitch, duration, startPos));
      } else {
        addNoteAction(NoteModel.default(index, pitch, config.defaultDuration.length, startPos));
      }
    }

  }, [notes, highestPitch]);

  return (
    <BoardContainer padding={padding} height={gridHeight} scrollbarWidth={10}>
      <Stage width={stageWidth} height={stageHeight} ref={stageRef}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
      >
        <Layer>
          <Grid
            config={config}
            cellSize={cellSize}
            pitchLabelSize={pitchLabelSize}
            padding={padding}
            length={maxDuration}
            height={gridHeight}
            stageWidth={stageWidth}
            stageHeight={stageHeight}
            onClick={onClickGrid}
            onDblClickInner={onDblClickInnerGrid}
          />
          {notes?.map((note, i) => { // notes
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
          {noteSelector && <NoteSelector stretchable model={noteSelector} />}
        </Layer>
      </Stage>
    </BoardContainer>
  );
};

export default React.memo(Board);
