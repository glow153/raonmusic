import { useCallback, useState } from 'react';
import { Rect, Text } from 'react-konva';
import { Colors } from '../../constants/color';
import { Note as NoteModel } from '../../model/Note';
import { isNumber, tryCall } from '../../util';

interface Prop {
  note: NoteModel;
  gridCellSize?: number;
  gridHeight?: number;
  gridPadding?: number;
  left: number;
  restPitch?: number;
  isSelected?: boolean;
  lowestPitch: number;
  onSelect?: (note: NoteModel) => void;
  onClick?: (note: NoteModel) => void;
  language?: string;
}

const dragThreshold = 18;

const Note = ({
  note,
  gridCellSize = 0,
  gridHeight = 0,
  gridPadding = 0,
  left,
  restPitch,
  isSelected = false,
  lowestPitch,
  onSelect: _onSelect,
  onClick: _onClick,
  language,
}: Prop) => {
  const pitch = (
    isNumber(restPitch)
      ? ((restPitch ?? 0) - lowestPitch)
      : (isNumber(note.pitch?.code) ? ((note.pitch?.code ?? 0) - lowestPitch) : 0)
  );
  const duration = note.duration?.length ?? 1;

  const x = left * gridCellSize + gridPadding;
  const y = gridHeight - ((pitch + 1) * gridCellSize - gridPadding);
  const width = gridCellSize * duration;
  const height = gridCellSize;
  const selectBorderWidth = 5;
  const radius = Math.round(gridCellSize / 3);
  const fontSize = Math.round(gridCellSize * 0.7);
  const xText = x + (width-fontSize)/2;
  const yText = y + (height-fontSize)/2;

  const [isHover, setHover] = useState<boolean>(false);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const onClick = useCallback((note: NoteModel) => {
    tryCall(_onClick, note);
  }, [note]);
  const onSelect = useCallback((note: NoteModel) => {
    tryCall(_onSelect, note);
  }, [note]);
  

  return (
    <>
      <Rect x={x} y={y}
        width={width} height={height}
        cornerRadius={radius}
        fill={note.isRest
          ? (isHover ? Colors.grayHover : Colors.gray)
          : (isHover ? Colors.primaryHover : Colors.primary)
        }
        onMouseOver={() => {setHover(true);}}
        onMouseOut={() => {setHover(false);}}
        onMouseDown={({evt}) => {
          console.log('onMouseDown', evt);
          onClick(note);
          setDragStartY(evt.y);
          setDragging(true);
        }}
      />
      <Text x={xText} y={yText}
        text={note.phoneme} fontFamily={language === 'cn' ? 'Ma Shan Zheng' : 'BMJua'} fontSize={fontSize}
        onClick={() => {
          onClick(note);
        }}
        onMouseOver={() => {setHover(true);}}
        onMouseOut={() => {setHover(false);}}
      />
      {isSelected && (
        <Rect x={x} y={y}
          width={width} height={height}
          fill='transparent' stroke='#ed0e0eaa'
          strokeWidth={selectBorderWidth}
          onMouseOver={() => {setHover(true);}}
          onMouseOut={() => {
            setHover(false);
            setDragging(false);
          }}
          onMouseDown={({evt}) => {
            console.log('onMouseDown', evt);
            setDragStartY(evt.offsetY);
            setDragging(true);
          }}
          onMouseMove={({evt}) => {
            if (isDragging){
              const dy = dragStartY - evt.offsetY;
              console.log(`mouse dragging: y=${y}, dragStartY=${dragStartY}, evt.offsetY=${evt.offsetY}, dy=${dy}`);
              if (dy > dragThreshold) {
                onSelect(note.higher());
                setDragStartY(evt.y - 15);
              } else if (dy < -dragThreshold) {
                onSelect(note.lower());
                setDragStartY(evt.y + 15);
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