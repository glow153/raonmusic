import { KonvaEventObject } from "konva/lib/Node";
import { Fragment, useMemo } from "react";
import { Line, Rect, Text } from "react-konva";
import { Colors } from "../../constants/color";
import { Pitch } from "../../model";
import { Config } from "../../model/config";
import { seq } from "../../util";

interface Prop {
  config: Config;
  cellSize: number;
  pitchLabelSize: number;
  length: number;
  height: number;
  padding: number;
  onClick: (evt: KonvaEventObject<MouseEvent>) => void;
  onDblClickInner: (evt: KonvaEventObject<MouseEvent>) => void;
}

const Grid = ({
  config,
  cellSize,
  pitchLabelSize,
  length,
  height,
  padding,
  onClick,
  onDblClickInner,
}: Prop) => {
  const stageWidth = useMemo(() => pitchLabelSize + height + (length * cellSize) + (padding * 2), [height, length, cellSize, padding]);
  const stageHeight = useMemo(() => height + (padding * 2), [height, padding]);
  const innerGridWidth = useMemo(() => height + (length * cellSize), [height, length, cellSize]);
  const innerGridHeight = useMemo(() => height, [height]);
  const paddingLeft = useMemo(() => pitchLabelSize + padding, [padding, pitchLabelSize]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [config]);
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [config]);
  
  return (
    <>
      <Rect key='upper-padding'
        x={0} y={0} width={stageWidth} height={padding}
        fill='#f2f2f2'
      />
      <Rect key='lower-padding'
        x={0} y={stageHeight - padding} width={stageWidth} height={cellSize}
        fill='#f2f2f2'
      />
      {seq((highestPitch - lowestPitch) + 2).map((n) => {
        const dy = n * cellSize;
        const currentPitch = Pitch.fromCode(highestPitch - n);
        const isOctave = (currentPitch.code % 12) === ((config.key.pitch.code - 1) % 12);
        const isOctaveLabel = (currentPitch.code % 12) === (config.key.pitch.code % 12);

        return (
          <Fragment key={`hfrg-${n}`}>
            <Line key={`hline-${n}`} // 가로선
              x={0} y={padding}
              points={[0, dy, stageWidth, dy]}
              stroke={isOctave ? Colors.strong : Colors.primary}
              strokeWidth={isOctave ? 2 : 1}
            />
            {currentPitch.isBlack ? ( // black note
              <Rect
                x={0} y={padding + dy}
                width={paddingLeft + innerGridWidth} height={cellSize}
                fill={Colors.secondary + '77'}
              />
            ) : null}
            {n !== ((highestPitch - lowestPitch) + 1) ? ( // pitch label
              <Text key={`notelabel-${n}`}
                x={5} y={padding + dy} width={pitchLabelSize} height={cellSize}
                align='left' verticalAlign='middle' fontFamily='Noto Sans KR'
                fontSize={20} fontStyle={isOctaveLabel ? 'bolder' : undefined}
                text={Pitch.fromCode(highestPitch - n).shorterName}
              />
            ) : null}
          </Fragment>
        );
      })}
      {seq(length + 1).map((n, i) => {
        const dx = n * cellSize;
        const isMeasure = i % 32 === 0;
        const isHalfMeasure = i % 16 === 0;
        return (
          <Fragment key={`vfrg-${i}`}>
            <Line key={`vline-${i}`}    // 세로선
              x={paddingLeft} y={0}
              points={[dx, 0, dx, stageHeight]}
              stroke={(isMeasure || isHalfMeasure) ? Colors.strong : Colors.primary}
              strokeWidth={isMeasure ? 3 : isHalfMeasure ? 2 : 1}
            />
            {/* {(n%2 === 0 && n !== length)? ( // dhpark: stripe
              <Rect
                x={paddingLeft + dx + 1} y={padding}
                width={cellSize - 1} height={height}
                fill={Colors.secondary + '77'}
              />
            ) : null} */}
          </Fragment>
        );
      })}
      <Rect key='inner-grid'
        x={paddingLeft} y={padding} width={innerGridWidth} height={innerGridHeight}
        fill='transparent'
        onClick={onClick}
        onDblClick={onDblClickInner}
        onTap={onClick}
        onDblTap={onDblClickInner}
      />
    </>
  );
};

export default Grid;
