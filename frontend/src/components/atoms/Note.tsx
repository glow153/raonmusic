import { useEffect, useRef, useState } from 'react';
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
  setSelectedNote: any;
}

const Note = ({
  left,
  note,
  pitch: _pitch,
  isSelected = false,
  lowestPitch,
  setSelectedNote,
}: Prop) => {
  const shapeRef = useRef();
  const trRef =  useRef<Transformer | null>();
  const [isHover, setHover] = useState<boolean>(false);
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
  const borderWidth = 2;
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
        fill={note.isRest
          ? (isHover ? Colors.grayHover : Colors.gray)
          : (isHover ? Colors.primaryHover : Colors.primary)
        }
        onClick={() => {
          setSelectedNote(note);
        }}
        onMouseOver={() => {setHover(true);}}
        onMouseOut={() => {setHover(false);}}
      />
      <Text x={xText} y={yText}
        text={note.phoneme}
        fontFamily='BMJua' fontSize={fontSize}
        onClick={() => {
          setSelectedNote(note);
        }}
        onMouseOver={() => {setHover(true);}}
        onMouseOut={() => {setHover(false);}}
      />
      {isSelected && (
        <Rect x={x - borderWidth/2} y={y - borderWidth/2}
          width={width + borderWidth} height={height + borderWidth}
          stroke='#de4949'
          fill='transparent'
          zIndex={999}
        />
      )}
    </>
  );
};

export default Note;