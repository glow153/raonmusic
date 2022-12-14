import { useEffect, useRef } from 'react';
import { Rect, Text } from 'react-konva';
import { Colors } from '../../constants/color';
import { Note as NoteModel } from '../../model/Note';
import { isNumber } from '../../util';
import { CANVAS_HEIGHT, CANVAS_PADDING, UNIT_SIZE } from '../molecules/Board';

interface Prop {
  left: number;
  note: NoteModel;
  pitch?: number;
  isSelected?: boolean;
  lowestPitch: number;
}

const Note = ({
  left,
  note,
  pitch: _pitch,
  isSelected = false,
  lowestPitch,
}: Prop) => {
  const shapeRef = useRef();
  const trRef =  useRef<Transformer | null>(null);
  const pitch = (
    isNumber(_pitch)
      ? ((_pitch ?? 0)  - lowestPitch)
      : (isNumber(note.pitch?.code) ? ((note.pitch?.code ?? 0) - lowestPitch) : 0)
  );
  const duration = note.duration?.length ?? 1;

  const x = left * UNIT_SIZE + CANVAS_PADDING;
  const y = CANVAS_HEIGHT - ((pitch + 1) * UNIT_SIZE - CANVAS_PADDING);
  const width = UNIT_SIZE * duration;
  const height = UNIT_SIZE;
  const radius = Math.round(UNIT_SIZE / 3);
  const fontSize = Math.round(UNIT_SIZE * 0.7);
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
        fill={note.isRest ? Colors.gray : Colors.primary}
        draggable
      />
      <Text x={xText} y={yText}
        text={note.phoneme}
        fontFamily='BMJua' fontSize={fontSize}
      />
      {/* {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )} */}
    </>
  );
};

export default Note;