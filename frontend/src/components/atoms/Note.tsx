import { useCallback, useEffect, useMemo, useState } from 'react';
import { Rect, Text } from 'react-konva';
import { Colors } from '../../constants/color';
import { Note as NoteModel } from '../../model/Note';
import { tryCall } from '../../util';

interface Prop {
  id: string;
  left: number;
  note: NoteModel;
  gridCellSize?: number;
  gridHeight?: number;
  gridPadding?: number;
  prevPitch?: number;
  isSelected?: boolean;
  lowestPitch: number;
  onSelect?: (note: NoteModel) => void;
  onClick?: (note: NoteModel) => void;
  language?: string;
}

const dragThreshold = 14;

const Note = ({
  id,
  left,
  note,
  gridCellSize = 0,
  gridHeight = 0,
  gridPadding = 0,
  prevPitch: _prevPitch,
  isSelected = false,
  lowestPitch,
  onSelect: _onSelect,
  onClick: _onClick,
  language,
}: Prop) => {
  const selectBorderWidth = 5;
  const relativePitch = useMemo<number>(() => {
    if (_prevPitch && _prevPitch >= lowestPitch) {
      return _prevPitch - lowestPitch;
    } else if (note.pitch.code >= lowestPitch) {
      return note.pitch.code - lowestPitch;
    } else {
      return 0;
    }
  }, [note, _prevPitch]);
  const duration = useMemo<number>(() => note.duration?.length ?? 1, [note]);
  const x = useMemo<number>(() => left * gridCellSize + gridPadding, [left, note, gridCellSize, gridPadding]);
  const y = useMemo<number>(() => gridHeight - ((relativePitch + 1) * gridCellSize - gridPadding), [gridHeight, relativePitch, gridCellSize, gridPadding]);
  const width = useMemo<number>(() => gridCellSize * duration, [gridCellSize, duration]);
  const height = useMemo<number>(() => gridCellSize, [gridCellSize]);
  const radius = useMemo<number>(() => Math.round(gridCellSize / 3), [gridCellSize]);
  const fontSize = useMemo<number>(() => Math.round(gridCellSize * 0.7), [gridCellSize]);
  const xText = useMemo<number>(() => x + (width-fontSize)/2, [x, width]);
  const yText = useMemo<number>(() => y + (height-fontSize)/2, [y, gridCellSize]);
  
  const [isHover, setHover] = useState<boolean>(false);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [dragStartY, setDragStartY] = useState<number>(0);
 
  const onSelect = useCallback((note: NoteModel) => {
    tryCall(_onSelect, note);
  }, [note]);
  
  const onMouseDown = useCallback((e: any) => {
    onSelect(note);
    setDragStartY(e.evt.offsetY);
    setDragging(true);
  }, [note]);

  useEffect(() => {
    console.log(`id:${id}, x:${x}, y:${y}, `);
  }, []);

  return (
    <>
      <Rect id={id} x={x} y={y} width={width} height={height}
        cornerRadius={radius}
        fill={note.isRest
          ? (isHover ? Colors.grayHover : Colors.gray)
          : (isHover ? Colors.primaryHover : Colors.primary)
        }
        onMouseDown={onMouseDown}
        onMouseOver={() => {setHover(true);}}
        onMouseOut={() => {setHover(false);}}
      />
      <Text id={`${id}_txt`} x={xText} y={yText}
        fontFamily={language === 'cn' ? 'Ma Shan Zheng' : 'BMJua'} fontSize={fontSize}
        text={note.isRest ? '~' : note.phoneme}
        onMouseDown={onMouseDown}
        onMouseOver={() => {setHover(true);}}
        onMouseOut={() => {setHover(false);}}
      />
      {isSelected && (
        <Rect x={x} y={y}
          width={width} height={height}
          fill='transparent' stroke='#ed0e0eaa'
          strokeWidth={selectBorderWidth}
          onMouseDown={onMouseDown}
          onMouseOver={() => {setHover(true);}}
          onMouseOut={() => {
            setHover(false);
            setDragging(false);
          }}
          onMouseMove={({evt}) => {
            if (isDragging) {
              const dy = dragStartY - evt.offsetY;
              console.log(`mouse dragging: y=${y}, dragStartY=${dragStartY}, evt.offsetY=${evt.offsetY}, dy=${dy}`);
              if (dy > dragThreshold) {
                onSelect(note.higher());
                setDragStartY(evt.offsetY - 15);
              } else if (dy < -dragThreshold) {
                onSelect(note.lower());
                setDragStartY(evt.offsetY + 15);
              }
            }
          }}
          onMouseUp={(evt) => {
            setDragging(false);
          }}
        />
      )}
    </>
  );
};

export default Note;