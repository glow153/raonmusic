import styled from "styled-components";
import { Colors } from "../../constants/color";

const SelectedNoteContainer = styled.div<{language?: string}>`
  width: 125px;
  height: 125px;
  font-family: ${p => p.language === 'cn' ? "'Ma Shan Zheng'" : 'BMJua'};
  background-color: ${Colors.primary};
  border-radius: 17px;
  font-size: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Prop {
  word?: string;
  language?: string;
}

const SelectedNote = ({
  word,
  language
}: Prop) => {
  return (
    <SelectedNoteContainer language={language}>{word}</SelectedNoteContainer>
  );
};

export default SelectedNote;