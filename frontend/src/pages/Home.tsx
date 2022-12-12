import { useCallback } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { Button, Input, Link } from '../components/atoms';
import { Page } from '../components/templates';

interface TitleProp {
  marginTop?: number;
}

const Title = styled.div<TitleProp>`
  margin-top: ${p => p.marginTop}px;
  font-size: 40px;
  width: 100%;
  font-family: BMJua;
  text-align: center;
`;

interface TextProp {
  marginTop?: number;
  textAlign?: string;
}

const Text = styled.p<TextProp>`
  margin-top: ${p => p.marginTop}px;
  font-size: 20px;
  width: 100%;
  text-align: ${p => p.textAlign ?? 'left'};
`;


const Home = () => {
  const onButtonClick = useCallback(() => {
    console.log('onClick')
    toast('coming soon :)');
  }, []);
  return (
    <Page>
      <Title marginTop={200}>아무 문장으로 나만의 노래를 만들어봐요</Title>
      <Text marginTop={36} textAlign='center'>라온 뮤직은 학습에 지친 아이들을 위해 힐링 되고 재미 있는 공부 환경을 제공해드립니다.</Text>
      
      <div style={{display: 'flex', position: 'relative', alignItems: 'center'}}>
        <Input padding={30} placeholder='ex) 반짝 반짝 작은 별 아름답게 비치네' />
        {/* <Link to='/repair' style={{position: 'absolute', right: 30}}>
        </Link> */}
        <Button primary
          style={{fontFamily: 'BMJua', padding: 20, position: 'absolute', right: 30}}
          onClick={onButtonClick}
        >
          노래 편집하러 가기
        </Button>
      </div>

      <Text marginTop={150}>예시로 바로 시작해봐요</Text>
      
      <div style={{display: 'flex', position: 'relative', alignItems: 'center'}}>
        <span style={{position: 'absolute', left: 22, fontFamily: 'BMJua', flex: 0}}>한국어)</span>
        <Link to='/example' style={{flex: 1, display: 'flex'}}>
          <Input value='반짝 반짝 작은 별 아름답게 비치네' style={{paddingLeft: 80, paddingRight: 30, paddingTop: 22, paddingBottom: 22, flex: 1}} readonly />
        </Link>
      </div>
      <div style={{display: 'flex', position: 'relative', alignItems: 'center', marginTop: 20}}>
        <span style={{position: 'absolute', left: 22, fontFamily: 'BMJua'}}>중국어)</span>
        <Link to='/example' style={{flex: 1, display: 'flex'}}>
          <Input value='一闪一闪亮晶晶满天都是小星星' style={{paddingLeft: 80, paddingRight: 30, paddingTop: 22, paddingBottom: 22, flex: 1}} readonly />
        </Link>
      </div>
    </Page>
  );
};

export default Home;