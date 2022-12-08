import React from 'react';
import styled from 'styled-components';
import { BasePage } from '../components/templates';

const MainImage = styled.img`
  width: 300px;
  height: fit-content;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;
const TextWrapper = styled.div`margin-top: 1rem;`;
const Text = styled.h1`text-align: center;`;


const Repair = () => {
  return (
    <BasePage>
      <Container>
        <MainImage alt='under construction' src='img/construction.png' />
        <TextWrapper>
          <Text>👷‍♂️ 공사중입니다 🚧</Text>
        </TextWrapper>
      </Container>
    </BasePage>
  );
};


export default Repair;