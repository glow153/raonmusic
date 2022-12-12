import styled from 'styled-components';
import { Button, Link, SelectedNote, Slider } from '../components/atoms';
import { IconButton, InputGroup } from '../components/molecules';
import { Page } from '../components/templates';
import { Colors } from '../constants/color';

const Topbar = styled.section`
  display: flex;
`;

const NoteButtonGroup = styled.div`
  display: flex;
  button {
    margin-right: 3px;
    &:last-child {
      margin-right: 0px;
    }
  }
`;

const ConfigButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    margin-right: 3px;
    border-radius: 0px;
    &:first-child {
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }
    &:last-child {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
      margin-right: 0px;
    }
  }
`;

const ConfigButton = styled(Button)`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 6px 11px;
  span{font-family:BMJua;line-height:1.3;}
  .title{font-size:18px;}
  .subtitle{font-size:12px;}
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 375px;
  background-color: ${Colors.gray}
`;

const Example = () => {
  return (
    <Page>
      <Topbar>
        <Link to='/' style={{textDecoration: 'none'}}>
          <IconButton name='home' />
        </Link>
      </Topbar>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <NoteButtonGroup>
          <IconButton secondary name='refresh' />
          <IconButton secondary name='plus' />
          <IconButton secondary name='minus' />
        </NoteButtonGroup>
        <SelectedNote />
        <ConfigButtonGroup>
          <ConfigButton gray>
            <span className='title'>120</span>
            <span className='subtitle'>BPM</span>
          </ConfigButton>
          <ConfigButton gray>
            <span className='title'>C2</span>
            <span className='subtitle'>MAJOR</span>
          </ConfigButton>
          <ConfigButton gray>
            <span className='title'>4/4</span>
            <span className='subtitle'>TIME</span>
          </ConfigButton>
        </ConfigButtonGroup>
      </div>
      <div style={{display: 'flex', marginTop: 25, justifyContent: 'center'}}>
        <Canvas />
      </div>
      <div style={{display: 'flex', marginTop: 30, justifyContent: 'space-between'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <InputGroup label='피치' value={'C2'} />
          <Slider width={300} min={0} max={12} step={1} value={0} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <InputGroup label='길이' value={'1/4'} />
          <Slider width={300} min={0} max={12} step={1} value={0} />
        </div>
      </div>
    </Page>
  );
};

export default Example;