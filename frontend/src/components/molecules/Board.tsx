import { Layer, Stage } from 'react-konva';
import styled from 'styled-components';
import { Song } from '../../model/Song';
import { Note } from '../atoms';

export const UNIT_SIZE = 36;
export const CANVAS_HEIGHT = UNIT_SIZE * 13;
const LOWEST_PITCH = 24;

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
  width: 100%;
  height: ${CANVAS_HEIGHT}px;
  border: 1px solid #ccc;
  overflow-x: auto;
`;

interface Prop {
  song: Song;
  setSong: React.Dispatch<React.SetStateAction<Song>>;
}

const Board = ({
  song,
}: Prop) => {
  return (
    <BoardContainer>
      <Stage width={960} height={CANVAS_HEIGHT}>
        <Layer x={0} y={0}>
          {song.notes.map((note, i) => {
            return (
              <Note
                left={song.elapsed(i)}
                note={note}
                isSelected={false}
                lowestPitch={LOWEST_PITCH}
              />
            );
          })}
          {/* <Rect x={0} y={0} width={50 * 4} height={50} fill={Colors.primary} cornerRadius={30} />
          <Text x={0 + 13} y={0 + 13} width={50 * 4} height={50}
            text='반' fontFamily='BMJua' fontSize={24}
          /> */}
        </Layer>
      </Stage>
    </BoardContainer>
  );
};

export default Board;
