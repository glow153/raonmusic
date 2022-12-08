import React from 'react';
import styled from 'styled-components';
import { Input } from '../components/atoms';
import { NormalPage } from '../components/templates';

interface TitleProp {
  marginTop?: number;
}

const Title = styled.div<TitleProp>`
  margin-top: ${({marginTop}) => marginTop}px;
  font-size: 40px;
  width: 100%;
  font-family: BMJua;
  text-align: center;
`;

const SubTitle = styled.div<TitleProp>`
  margin-top: ${({marginTop}) => marginTop}px;
  font-size: 20px;
  width: 100%;
  text-align: center;
`;

const Home = () => {
  return (
    <NormalPage>
      <Title marginTop={200}>아무 문장으로 나만의 노래를 만들어봐요</Title>
      <SubTitle marginTop={36}>라온 뮤직은 학습에 지친 아이들을 위해 힐링 되고 재미 있는 공부 환경을 제공해드립니다.</SubTitle>
      <Input width={1000} hint='ex) 반짝 반짝 작은 별 아름답게 비치네' />
    </NormalPage>
  );
};

export default Home;