import styled from "styled-components";
import { InputProp } from ".";
import { Colors } from "../../constants/color";
import { Note as NoteModel } from "../../model";
import Input from "./Input";

interface StyledInputProp {
  ref: any;
  autoComplete: string;
  language?: string;
}
const SelectedNoteInput = styled(Input)<StyledInputProp>`
  width: 125px;
  height: 125px;
  font-family: ${p => p.language === 'cn' ? "'Ma Shan Zheng'" : 'BMJua'};
  background-color: ${Colors.primary};
  border-radius: 17px;
  font-size: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px solid transparent;
  text-align: center;
  &:focus {
    border-color: #f5d590 !important;
    box-shadow: 0 0 0.25rem 0.5rem #fdcd0d70;
  }
`;

interface Prop extends InputProp {
  note?: NoteModel;
  ref: any;
  language?: string;
}

const SelectedNote = ({
  note,
  ref,
  ...props
}: Prop) => {
  return (
    <SelectedNoteInput {...props} ref={ref}
      value={note ? (
        note.isRest ? '~' : note.phoneme?.trim() ?? ''
      ) : ''}
      maxLength={1}
      autoComplete="off"
    />
  );
};

export default SelectedNote;