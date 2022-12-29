import { KonvaEventObject } from 'konva/lib/Node';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  selectNoteAction: (note?: NoteModel) => void;
  addNoteAction: (note?: NoteModel) => void;
}

const Board = ({
  notes,
  config,
  cellSize = 30,
  padding = 16,
  pitchLabelSize = 30,
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
  const stageWidth = useMemo<number>(() => pitchLabelSize + (maxDuration * cellSize) + (padding * 2), [config]);
  const stageHeight = useMemo<number>(() => gridHeight + (padding * 2), [config]);

  const [noteSelector, setNoteSelector] = useState<NoteSelectorModel>();
  const [isDragging, setDragging] = useState<boolean>(false);
  const [isStretchingLeft, setStretchingLeft] = useState<boolean>(false);
  const [isStretchingRight, setStretchingRight] = useState<boolean>(false);
  const [stretchPos, setStretchPos] = useState<number>(0);

  const onCanvasMouseDown = (re: KonvaEventObject<MouseEvent>) => {
    const attr = re.target.attrs;
    console.log('onClickCanvas> re:', re, ', attr:', attr);
    const shapeId = attr.id;
    if (shapeId?.startsWith('note-')) {
      const index = getIndexFromNoteId(shapeId);
      selectNoteAction(notes[index]);
      setDragging(true);
    } else if (shapeId?.startsWith('noteselector')) {
      if (shapeId.split('-')[1] === 'stretch') {
        setStretchPos(re.evt.offsetX);
        if (shapeId.split('-')[3] === 'left') {
          console.log('stretching left: fase -> true');
          setStretchingLeft(true);
        } else if (shapeId.split('-')[3] === 'right') {
          console.log('stretching right: false -> true');
          setStretchingRight(true);
        }
      }
      setDragging(true);
    } else {
      setDragging(false);
    }
  };

  const onCanvasMouseMove = useCallback((re: KonvaEventObject<MouseEvent>) => {
    let newNote;
    if (selectedNote && noteSelector) {
      if (isStretchingLeft) {
        const diff = noteSelector.x - re.evt.offsetX;
        console.log(`onCanvasMouseMove: stretching left: offsetX=${re.evt.offsetX}, stretchPos=${stretchPos}, diff=${diff}`);
        if (diff > Math.round(cellSize / 2)) {
          newNote = selectedNote?.longer().goLeft();
          setStretchPos(re.evt.offsetX);
        } else if (diff < -Math.round(cellSize / 2)) {
          newNote = selectedNote?.shorter().goRight();
          setStretchPos(re.evt.offsetX);
        }
      } else if (isStretchingRight) {
        const diff = re.evt.offsetX - noteSelector.right;
        console.log(`onCanvasMouseMove: stretching right: offsetX=${re.evt.offsetX}, stretchPos=${stretchPos}, diff=${diff}`);
        if (diff > Math.round(cellSize / 2)) {
          newNote = selectedNote?.longer().goLeft();
        } else if (diff < -Math.round(cellSize / 2)) {
          newNote = selectedNote?.shorter();
          setStretchPos(re.evt.offsetX);
        }
      } else if (isDragging) {
        const {x, y, width: w, height: h} = noteSelector;
        
        const {offsetX, offsetY} = re.evt;
  
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
          if (x - offsetX > 0 && selectedNote.index > 0) {
            // 2.1 go left
            const prevNote = notes[selectedNote.index - 1];
            if (x - offsetX > Math.round(cellSize / 2) && prevNote.end + 1 < selectedNote.start) {
              newNote = selectedNote.goLeft();
            }
          } else if (offsetX - (x + w) > 0 && selectedNote.index < notes.length - 1) {
            // 2.2 go right
            const nextNote = notes[selectedNote.index + 1];
            if (offsetX - (x + w) > Math.round(cellSize / 2) && selectedNote.end + 1 < nextNote.end) {
              newNote = selectedNote.goRight();
            }
          }
        }
      }
    }
    
    if(newNote) {
      selectNoteAction(newNote);
    }
  }, [isStretchingLeft, isStretchingRight, stretchPos, selectedNote, isDragging, noteSelector, stageWidth]);

  const onCanvasMouseUp = useCallback((re: any) => {
    setDragging(false);
    if (isStretchingLeft) {
      console.log('stretching left: true -> false');
      setStretchingLeft(false);
      setStretchPos(re.evt.offsetX);
    }
    if (isStretchingRight) {
      console.log('stretching right: true -> false');
      setStretchingRight(false);
      setStretchPos(re.evt.offsetX);
    }
  }, [isStretchingLeft, isStretchingRight]);
  
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



  useEffect(() => {
    if (selectedNote) {
      setNoteSelector(new NoteSelectorModel(notes, config, selectedNote.index, {
        cellSize,
        height: gridHeight,
        padding,
        pitchLabelSize
      }));
    } else {
      setNoteSelector(undefined);
    }
  }, [selectedNote]);

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
