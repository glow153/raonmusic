import { useCallback, useEffect, useState } from 'react';
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
  pitch?: number;
  isSelected?: boolean;
  lowestPitch: number;
  onClick?: (note: NoteModel) => void;
}

const Note = ({
  note,
  gridCellSize = 0,
  gridHeight = 0,
  gridPadding = 0,
  left,
  pitch: _pitch,
  isSelected = false,
  lowestPitch,
  onClick: _onClick,
}: Prop) => {
  const [isHover, setHover] = useState<boolean>(false);
  const onClick = useCallback((note: NoteModel) => {
    tryCall(_onClick, note);
  }, [note]);

  const pitch = (
    isNumber(_pitch)
      ? ((_pitch ?? 0)  - lowestPitch)
      : (isNumber(note.pitch?.code) ? ((note.pitch?.code ?? 0) - lowestPitch) : 0)
  );
  const duration = note.duration?.length ?? 1;

  const x = left * gridCellSize + gridPadding;
  const y = gridHeight - ((pitch + 1) * gridCellSize - gridPadding);
  const width = gridCellSize * duration;
  const height = gridCellSize;
  const borderWidth = 2;
  const radius = Math.round(gridCellSize / 3);
  const fontSize = Math.round(gridCellSize * 0.7);
  const xText = x + (width-fontSize)/2;
  const yText = y + (height-fontSize)/2;

  useEffect(() => {
    // console.log('<Note/>: note:', note, ', x:', x, ', y:', y, ', pitch:', note.pitch?.code);
  }, []);

  return (
    <>
      <Rect x={x} y={y}
        width={width} height={height}
        cornerRadius={radius}
        fill={note.isRest
          ? (isHover ? Colors.grayHover : Colors.gray)
          : (isHover ? Colors.primaryHover : Colors.primary)
        }
        onClick={(evt) => {
          onClick(note);
        }}
        onMouseOver={() => {setHover(true);}}
        onMouseOut={() => {setHover(false);}}
      />
      <Text x={xText} y={yText}
        text={note.phoneme} fontFamily='BMJua' fontSize={fontSize}
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
          strokeWidth={5}
          onMouseOver={() => {setHover(true);}}
          onMouseOut={() => {setHover(false);}}
        />
      )}
    </>
  );
};

export default Note;