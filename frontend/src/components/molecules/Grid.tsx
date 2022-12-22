import { Fragment, useMemo } from "react";
import { Line, Rect } from "react-konva";
import { Colors } from "../../constants/color";
import { Config } from "../../model/config";
import { seq } from "../../util";

interface Prop {
  config: Config;
  cellSize: number;
  length: number;
  height: number;
  padding: number;
  onClick: (evt?: any) => void;
}

const Grid = ({
  config,
  cellSize,
  length,
  height,
  padding,
  onClick,
}: Prop) => {
  const stageWidth = useMemo(() => height + (length * cellSize) + (padding * 2), [height]);
  const stageHeight = useMemo(() => height + (padding * 2), [height]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [config]);
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [config]);

  return (
    <>
      {seq(length + 1).map((n, i) => { // dhpark: 세로선
        const dx = n * cellSize;
        const isMeasure = i % 32 === 0;
        const isHalfMeasure = i % 16 === 0;
        return (
          <Fragment key={`frg-${i}`}>
            <Line
              x={padding} y={0}
              points={[dx, 0, dx, stageHeight]}
              stroke={(isMeasure || isHalfMeasure) ? Colors.strong : Colors.primary}
              strokeWidth={isMeasure ? 3 : isHalfMeasure ? 2 : 1}
            />
            {n%2 === 0 ? ( // dhpark: stripe
              <Rect
                x={padding + dx + 1} y={padding}
                width={cellSize - 1} height={height}
                fill={Colors.secondary + '77'}
              />
            ) : null}
          </Fragment>
        );
      })}
      {seq((highestPitch - lowestPitch) + 2).map((n, i) => { // dhpark: 가로선
        const dy = n * cellSize;
        const isOctave = i === 0 || i === 13;
        return (
          <Line key={`vline${i}`}
            x={0} y={padding}
            points={[0, dy, stageWidth, dy]}
            stroke={isOctave ? Colors.strong : Colors.primary}
            strokeWidth={isOctave ? 2 : 1}
          />
        );
      })}
      <Rect key='grid-background'
        x={0} y={0} width={stageWidth} height={stageHeight}
        fill='transparent'
        onClick={onClick}
        onTap={onClick}
      />
    </>
  );
};

export default Grid;
