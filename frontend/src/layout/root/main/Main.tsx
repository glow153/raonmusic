import React from "react";
import styled from "styled-components";

const MainContainer = styled.main`
`;

interface Prop { 
  children?: any;
}

const Main = ({
  children
}: Prop) => {
  return (
    <MainContainer>
      {children}
    </MainContainer>
  )
};


export default Main;