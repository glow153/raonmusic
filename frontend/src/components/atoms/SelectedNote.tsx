import React from "react";
import styled from "styled-components";
import { Colors } from "../../constants/color";

const SelectedNoteContainer = styled.div`
  width: 125px;
  height: 125px;
  font-family: BMJua;
  background-color: ${Colors.primary};
  border-radius: 17px;
`;

interface Prop {
  word?: string;
}

const SelectedNote = ({
  word
}: Prop) => {
  return (
    <SelectedNoteContainer>{word}</SelectedNoteContainer>
  );
};

export default SelectedNote;