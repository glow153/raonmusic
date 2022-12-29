import { useState } from "react";
import { Group, Rect } from "react-konva";
import { StretchHandle } from "../atoms";

const NoteSelector = ({
  dimension,
  stretchable,
  borderWidth = 5,
  onCanvasMouseDown,
  onCanvasMouseMove: _onCanvasMouseMove,
  onCanvasMouseUp,
  onStretchLeft,
  onStretchRight,
}: any) => {
  const [isLeftDragging, setDraggingLeft] = useState<boolean>(false);
  const [isRightDragging, setDraggingRight] = useState<boolean>(false);
  const {x, y, width: w, height: h} = dimension;

  const onCanvasMouseMove = (re: any) => {
    if (isLeftDragging) {
      const offsetX = re.evt.offsetX;
    } else if (isRightDragging) {

    } else {
      _onCanvasMouseMove(re);
    }
  };

  return ( // dhpark: Note Selector shape
    <Group id={`noteselector-grp`} name={`NoteSelectorGroup`}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
    >
      <Rect id={`noteselector`} name={`NoteSelector`}
        x={x} y={y}
        width={w} height={h}
        fill='transparent' stroke='#ed0e0eaa'
        strokeWidth={borderWidth}
      />
      {stretchable ? (
        <>
          <StretchHandle id='noteselector-stretch-handle-left' x={x} y={y-2}
            direction='v' weight={7}
            length={h+4}
            onStretch={onStretchLeft}
            />
          <StretchHandle id='noteselector-stretch-handle-right' x={x + w} y={y-2}
            direction='v' weight={7}
            length={h+4}
            onStretch={onStretchRight}
          />
        </>
      ) : null}
    </Group>
  );
};

export default NoteSelector;