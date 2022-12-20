import styled from "styled-components";
import { InputProp } from ".";
import { Colors } from "../../constants/color";
import Input from "./Input";

const SelectedNoteContainer = styled(Input)<{language?: string}>`
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
`;

interface Prop extends InputProp {
  language?: string;
}

const SelectedNote = ({
  ...props
}: Prop) => {
  return (
    <SelectedNoteContainer {...props} maxLength={1} />
  );
};

export default SelectedNote;