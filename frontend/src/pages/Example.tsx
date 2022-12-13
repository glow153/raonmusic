import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Link, SelectedNote } from '../components/atoms';
import { IconButton } from '../components/molecules';
import { InputSlider } from '../components/organisms';
import { Page } from '../components/templates';
import { Colors } from '../constants/color';
import _riff from '../constants/riff-mockup.json';
import { Duration } from '../model/Duration';
import { Note } from '../model/Note';
import { Pitch } from '../model/Pitch';
import { Riff } from '../model/Riff';

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
  background-color: ${Colors.gray};
`;


const mockupRiff = Riff.fromJson(_riff.measures);
const mockupNote = mockupRiff.notes[0];

const Example = () => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const [ctx, setCtx] = useState();
  const [riff, setRiff] = useState<Riff>(mockupRiff);
  const [selectedNote, setSelectedNote] = useState<Note>(mockupNote);
  const [selectedPitch, setSelectedPitch] = useState<Pitch>();
  const [selectedDuration, setSelectedDuration] = useState<Duration>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.strokeStyle = 'black';

    }
  }, []);

  useEffect(() => {
    console.log('riff:', riff);
    console.log('selectedNote:', selectedNote);
    setSelectedPitch(selectedNote.pitch);
    setSelectedDuration(selectedDuration);
  }, [selectedNote]);

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
        <SelectedNote word={selectedNote.phoneme} />
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
        <InputSlider
          label='피치'
          min={0} max={12} step={1}
          text={selectedPitch?.name}
          value={selectedPitch?.code}
          sliderWidth={300}
          onChange={(evt) => {
            const val = parseInt(evt.target.value);
            setSelectedNote(selectedNote.setPitch(val));
          }}
        />
        <InputSlider label='길이'
          min={0} max={16} step={1}
          sliderWidth={300}
          text={selectedDuration?.fraction}
          value={selectedDuration?.length}
          onChange={(evt) => {
            console.log(evt);
          }}
        />
      </div>
    </Page>
  );
};

export default React.memo(Example);