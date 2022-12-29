import { useState } from "react";
import { Line } from "react-konva";
import { tryCall } from "../../util";

const StretchHandle = ({
  id,
  x, y,
  color = '#b3e8ff',
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
    setHover(false);
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
    <Line id={id} x={x} y={y} points={[0, 0, x2, y2]}
      stroke={isHover ? color : 'transparent'} strokeWidth={weight}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOver={onMouseOver}
      onMouseMove={onStretch}
      onMouseOut={onMouseOut}
    />
  );
};

export default StretchHandle;