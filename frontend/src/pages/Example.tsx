import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Link, SelectedNote } from '../components/atoms';
import { Board, IconButton } from '../components/molecules';
import { InputSlider } from '../components/organisms';
import { Page } from '../components/templates';
import _song from '../constants/song-example-ko.json';
import { Duration } from '../model/Duration';
import { Note } from '../model/Note';
import { Pitch } from '../model/Pitch';
import { Song } from '../model/Song';
import { isNumber } from '../util';

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
  min-width: 53px;
  span{font-family:BMJua;line-height:1.3;}
  .title{font-size:18px;}
  .subtitle{font-size:12px;}
`;

const mockupSong = Song.fromJson(_song);

const Example = () => {
  const [song, setSong] = useState<Song>(mockupSong);
  const [selectedNote, setSelectedNote] = useState<Note>();
  const [selectedPitch, setSelectedPitch] = useState<Pitch>();
  const [selectedDuration, setSelectedDuration] = useState<Duration>();
  const stageRef = useRef<any>();

  useEffect(() => {
    // console.log('song:', song, ', selectedNote:', selectedNote);
    setSelectedPitch(selectedNote?.pitch);
    setSelectedDuration(selectedNote?.duration);
  }, [selectedNote]);

  const onClickRefresh = useCallback(() => {
    console.log('refresh');
    stageRef.current.clear();
    setSong(Song.fromJson(_song));
  }, []);

  return (
    <Page>
      <Topbar>
        <Link to='/'>
          <IconButton name='home' />
        </Link>
      </Topbar>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <NoteButtonGroup>
          <IconButton secondary name='refresh' onClick={onClickRefresh} />
          <IconButton secondary name='plus' disabled />
          <IconButton secondary name='minus' disabled />
        </NoteButtonGroup>
        <SelectedNote word={selectedNote?.phoneme} />
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
      
      <Board
        song={song} setSong={setSong}
        stageRef={stageRef}
        selectedNote={selectedNote} setSelectedNote={setSelectedNote}
      />
      
      <div style={{display: 'flex', marginTop: 30, justifyContent: 'space-between'}}>
        <InputSlider
          label='피치'
          min={24} max={36} step={1}
          text={selectedPitch?.name}
          value={selectedPitch?.code}
          sliderWidth={300}
          onChange={(evt) => {
            const val = parseInt(evt.target.value);
            if (isNumber(val)) {
              setSelectedNote(selectedNote?.setPitch(val));
            }
          }}
        />
        <InputSlider label='길이'
          min={1} max={16} step={1}
          sliderWidth={300}
          text={selectedDuration?.fraction}
          value={selectedDuration?.length}
          onChange={(evt) => {
            const val = parseInt(evt.target.value);
            if (isNumber(val)) {
              setSelectedNote(selectedNote?.setDuration(val));
            }
          }}
        />
      </div>
    </Page>
  );
};

export default React.memo(Example);