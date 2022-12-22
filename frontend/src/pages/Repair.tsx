import React from 'react';
import styled from 'styled-components';
import { Root } from '../layout/root';

const MainImage = styled.img`
  width: 300px;
  height: fit-content;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 15%;
  padding-right: 15%;
  align-items: center;
  justify-content: center;
`;
const TextContainer = styled.div`margin-top: 1rem; width: 350px;`;
const Text = styled.h1`text-align: center;`;


const Repair = () => {
  return (
    <Root>
      <Container>
        <MainImage alt='under construction' src='img/construction.png' />
        <TextContainer>
          <Text>👷‍♂️ 공사중입니다 🚧</Text>
        </TextContainer>
      </Container>
    </Root>
  );
};


export default React.memo(Repair);