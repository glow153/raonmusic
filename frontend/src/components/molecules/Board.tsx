import { Layer, Line, Rect, Stage } from 'react-konva';
import styled from 'styled-components';
import { Colors } from '../../constants/color';
import { Song } from '../../model/Song';
import { seq } from '../../util';
import { Note } from '../atoms';

export const CANVAS_PADDING = 23;
export const UNIT_SIZE = 30;
export const CANVAS_HEIGHT = UNIT_SIZE * 13;
const MEASURES = 4;
const LOWEST_PITCH = 24;

const BoardContainer = styled.div`
  margin-top: 25px;
  width: 100%;
  max-width: 960px;
  height: ${CANVAS_HEIGHT + (CANVAS_PADDING*2) + 20}px;
  overflow-x: auto;
  border: 1px solid #ccc;
  border-radius: 23px;
`;

interface Prop {
  song: Song;
  setSong: React.Dispatch<React.SetStateAction<Song>>;
}

const Board = ({
  song,
}: Prop) => {
  const stageWidth = song.totalDuration * UNIT_SIZE + (CANVAS_PADDING*2);
  const stageHeight = CANVAS_HEIGHT + (CANVAS_PADDING*2);

  return (
    <BoardContainer>
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {seq(song.totalDuration + 1).map(n => {
            const dx = n * UNIT_SIZE;
            return (
              <>
                <Line
                  x={CANVAS_PADDING}
                  y={0}
                  points={[dx, 0, dx, stageHeight]}
                  stroke={Colors.primary}
                  strokeWidth={1}
                  tension={1}
                />
                {n%2 === 0 ? (
                  <Rect
                    x={CANVAS_PADDING + (n*UNIT_SIZE)}
                    y={CANVAS_PADDING}
                    width={UNIT_SIZE}
                    height={CANVAS_HEIGHT}
                    fill={Colors.secondary + '77'}
                  />
                ) : null}
              </>
            );
          })}
          {seq((song.config.highestPitch.code - song.config.lowestPitch.code) + 2).map(n => {
            const dy = n * UNIT_SIZE;
            return (
              <Line
                x={0}
                y={CANVAS_PADDING}
                points={[0, dy, stageWidth, dy]}
                stroke={Colors.primary}
                strokeWidth={1}
                tension={1}
              />
            );
          })}
          {song.notes.map((note, i) => {
            if (note.isRest) {
              const prevPitch = i > 0 ? song.notes[i-1].pitch?.code ?? 0 : 0;
              // console.log('Board.notes:: prevPitch:', prevPitch);
              return (
                <Note
                  left={song.elapsed(i)}
                  note={note}
                  pitch={prevPitch}
                  lowestPitch={LOWEST_PITCH}
                />
              );
            } else {
              return (
                <Note
                  left={song.elapsed(i)}
                  note={note}
                  lowestPitch={LOWEST_PITCH}
                />
              );
            }
          })}
        </Layer>
      </Stage>
    </BoardContainer>
  );
};

export default Board;
