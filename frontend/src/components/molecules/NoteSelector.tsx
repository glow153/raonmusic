import { Group, Rect } from "react-konva";
import { NoteSelector as NoteSelectorModel } from '../../model/NoteSelector';
import { StretchHandle } from "../atoms";

interface Prop {
  model: NoteSelectorModel;
  stretchable: boolean;
  borderWidth?: number;
}

const NoteSelector = ({
  model,
  stretchable,
  borderWidth = 5,
}: Prop) => {
  console.log('<NoteSelector/> model:', model);
  const {x, y, width: w, height: h} = model;

  return (
    <Group id={`noteselector-grp`} name={`NoteSelectorGroup`}>
      <Rect id={`noteselector`} name={`NoteSelector`}
        x={x} y={y}
        width={w} height={h}
        fill='transparent' stroke='#ed0e0eaa'
        strokeWidth={borderWidth}
      />
      {stretchable ? (
        <>
          <StretchHandle id='noteselector-stretch-handle-left' x={x} y={y-2}
            direction='v' weight={7} length={h+4}
          />
          <StretchHandle id='noteselector-stretch-handle-right' x={x + w} y={y-2}
            direction='v' weight={7} length={h+4}
          />
        </>
      ) : null}
    </Group>
  );
};

export default NoteSelector;