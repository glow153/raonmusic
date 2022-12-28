import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Link } from '../components/atoms';
import { AnimatedPage } from '../components/templates';

interface TitleProp {
  marginTop?: number;
}

const Title = styled.div<TitleProp>`
  margin-top: ${p => p.marginTop}px;
  font-size: 40px;
  font-family: BMJua;
  text-align: center;
  padding-left: 20px;
  padding-right: 20px;
`;

interface TextProp {
  marginTop?: number;
  textAlign?: string;
}

const Text = styled.p<TextProp>`
  margin-top: ${p => p.marginTop}px;
  font-size: 20px;
  text-align: ${p => p.textAlign ?? 'left'};
  padding-left: 20px;
  padding-right: 20px;
`;

const Section = styled.section`
  display: flex;
  position: relative;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const StyledButton = styled(Button)`
  font-family: 'BMJua';
  padding: 20px;
  position: absolute;
  right: 30px;
`;

const LeftLabel = styled.span`
  position: absolute;
  left: 35px;
  font-family: 'BMJua';
  flex: 0;
`;

const Home = () => {
  const [lyric, setLyric] = useState<string>();
  const urlExample = useMemo<string>(() => lyric ? `/score?lyric=${lyric}` : '/score', [lyric]);
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(urlExample);
  }, [urlExample]);
  
  return (
    <AnimatedPage>
      <Title marginTop={200}>아무 문장으로 나만의 노래를 만들어봐요</Title>
      <Text marginTop={36} textAlign='center'>라온 뮤직은 학습에 지친 아이들을 위해 힐링 되고 재미 있는 공부 환경을 제공해드립니다.</Text>
      <Section>
        <Input padding={30} placeholder='ex) 반짝 반짝 작은 별 아름답게 비치네'
          onChange={(e) => {
            setLyric(e.target.value);
          }}
        />
        <StyledButton primary onClick={onClick}>노래 편집하러 가기</StyledButton>
      </Section>
      <Text marginTop={150}>예시로 바로 시작해봐요</Text>
      <Section>
        <LeftLabel>한국어)</LeftLabel>
        <Link to='/example/ko' style={{flex: 1, display: 'flex'}}>
          <Input value='반짝반짝작은별 아름답게비치네' style={{paddingLeft: 90, paddingRight: 30, paddingTop: 22, paddingBottom: 22, flex: 1}} readonly />
        </Link>
      </Section>
      <Section style={{marginTop: 20}}>
        <LeftLabel>한국어2)</LeftLabel>
        <Link to='/example/ko2' style={{flex: 1, display: 'flex'}}>
          <Input value='반짝반짝작은별 아름답게비치네 (다른 버전)' style={{paddingLeft: 90, paddingRight: 30, paddingTop: 22, paddingBottom: 22, flex: 1}} readonly />
        </Link>
      </Section>
      <Section style={{marginTop: 20}}>
        <LeftLabel>한국어3)</LeftLabel>
        <Link to='/example/ko3' style={{flex: 1, display: 'flex'}}>
          <Input value='여수밤바다' style={{paddingLeft: 90, paddingRight: 30, paddingTop: 22, paddingBottom: 22, flex: 1}} readonly />
        </Link>
      </Section>
      <Section style={{marginTop: 20}}>
        <LeftLabel>중국어)</LeftLabel>
        <Link to='/example/cn' style={{flex: 1, display: 'flex'}}>
          <Input value='小酒窝 长-睫-毛' style={{paddingLeft: 90, paddingRight: 30, paddingTop: 22, paddingBottom: 22, flex: 1}} readonly />
        </Link>
      </Section>
      <Section style={{marginTop: 20}}>
        <LeftLabel>중국어2)</LeftLabel>
        <Link to='/example/cn2' style={{flex: 1, display: 'flex'}}>
          <Input value='Chinese Eminem' style={{paddingLeft: 90, paddingRight: 30, paddingTop: 22, paddingBottom: 22, flex: 1}} readonly />
        </Link>
      </Section>
    </AnimatedPage>
  );
};

export default Home;