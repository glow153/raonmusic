import { useState } from "react";
import { Group, Line, Rect } from "react-konva";
import { tryCall } from "../../util";

const Guide = ({
  x, y,
  direction, // 'v' or 'h'
  weight,
  length,
  onStretch: _onStretch,
}: any) => {
  const x2 = direction === 'v' ? 0 : length;
  const y2 = direction === 'v' ? length : 0;
  // console.log(`duration stretch guide component: x=${x}, y=${y}, x2=${x2}, y2=${y2}, length=${length}`)
  const [isHover, setHover] = useState<boolean>(false);
  const [isDragging, setDragging] = useState<boolean>(false);
  
  const onMouseDown = () => {
    setDragging(true);
    document.body.style.cursor = 'ew-resize';
  };
  const onMouseUp = () => {
    setDragging(false);
    document.body.style.cursor = 'default';
  };
  const onMouseOver = () => {
    setHover(true);
    document.body.style.cursor = 'ew-resize';
  };
  const onMouseOut = () => {
    setHover(false);
    document.body.style.cursor = 'default';
  };
  const onStretch = (re: any) => {
    if (isDragging) {
      tryCall(_onStretch, re);
    }
  }

  return (
    <Line x={x} y={y} points={[0, 0, x2, y2]}
      stroke={isHover ? '#f7f734' : 'transparent'} strokeWidth={weight}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOver={onMouseOver}
      onMouseMove={onStretch}
      onMouseOut={onMouseOut}
    />
  );
};

const NoteSelector = ({
  dimension,
  stretchable,
  borderWidth,
  onCanvasMouseDown,
  onCanvasMouseMove: _onCanvasMouseMove,
  onCanvasMouseUp,
  onStretchLeft,
  onStretchRight,
}: any) => {
  const [isLeftDragging, setDraggingLeft] = useState<boolean>(false);
  const [isRightDragging, setDraggingRight] = useState<boolean>(false);

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
        x={dimension.x} y={dimension.y}
        width={dimension.width} height={dimension.height}
        fill='transparent' stroke='#ed0e0eaa'
        strokeWidth={borderWidth}
      />
      {stretchable ? (
        <>
          <Guide key='guide-left' x={dimension.x+7} y={dimension.y+3}
            direction='v' weight={9}
            length={dimension.height-6}
            onStretch={onStretchLeft}
            />
          <Guide key='guide-right' x={dimension.x + dimension.width-7} y={dimension.y+3}
            direction='v' weight={9}
            length={dimension.height-6}
            onStretch={onStretchRight}
          />
        </>
      ) : null}
    </Group>
  );
};

export default NoteSelector;