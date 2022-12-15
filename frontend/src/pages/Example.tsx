import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Link, SelectedNote } from '../components/atoms';
import { Board, IconButton } from '../components/molecules';
import { InputSlider } from '../components/organisms';
import { Page } from '../components/templates';
import _song from '../constants/song-example-ko.json';
import { Config } from '../model/config';
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
  const [notes, setNotes] = useState<Note[]>(mockupSong.notes);
  const [config, setConfig] = useState<Config>(mockupSong.config);
  const [selectedNote, setSelectedNote] = useState<Note>();
  const selectedPitch = useMemo<Pitch | undefined>(() => selectedNote?.pitch, [selectedNote]);
  const selectedDuration = useMemo<Duration | undefined>(() => selectedNote?.duration, [selectedNote]);
  const stageRef = useRef<any>();
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [config]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [config]);

  const onClickRefresh = useCallback(() => {
    console.log('refresh');
    stageRef.current.clear();
    setSong(Song.fromJson(_song));
  }, []);

  useEffect(() => {
    if (selectedNote) {
      notes.splice(selectedNote?.index, 1, selectedNote);
      setNotes([...notes]);
    }
  }, [selectedNote]);

  useEffect(() => {
    setSong(new Song(notes, config));
  }, [notes, config]);

  useEffect(() => {
    // TODO: refresh board
    
  }, [song]);

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
        song={song}
        notes={notes}
        config={config}
        stageRef={stageRef}
        selectedNote={selectedNote}
        onSelectNote={(note) => {
          setSelectedNote(note);
        }}
      />
      
      <div style={{display: 'flex', marginTop: 30, justifyContent: 'space-between'}}>
        <InputSlider id='pitchSlider' label='피치'
          min={lowestPitch} max={highestPitch} step={1}
          text={selectedPitch?.name ?? ''}
          value={selectedPitch?.code}
          sliderWidth={300}
          onChange={(evt) => {
            const val = parseInt(evt.target.value);
            if (isNumber(val)) {
              setSelectedNote(selectedNote?.setPitch(val));
            }
          }}
          onMouseWheel={(evt) => {
            evt.stopPropagation();
            if (selectedNote) {
              if (evt.deltaY > 0 && selectedNote.pitch.code < highestPitch) {
                setSelectedNote(selectedNote?.higher());
              } else if (evt.deltaY < 0 && selectedNote.pitch.code > lowestPitch) {
                setSelectedNote(selectedNote?.lower());
              }
            }
          }}
        />
        <InputSlider id='durationSlider' label='길이'
          min={Duration.MIN} max={Duration.MAX} step={1}
          sliderWidth={300}
          text={selectedDuration?.fraction ?? ''}
          value={selectedDuration?.length}
          onChange={(evt) => {
            const val = parseInt(evt.target.value);
            if (isNumber(val)) {
              setSelectedNote(selectedNote?.setDuration(val));
            }
          }}
          onMouseWheel={(evt) => {
            evt.stopPropagation();
            if (selectedNote) {
              if (evt.deltaY > 0 && selectedNote.duration.length < Duration.MAX) {
                setSelectedNote(selectedNote?.longer());
              } else if (evt.deltaY < 0 && selectedNote.duration.length > Duration.MIN) {
                setSelectedNote(selectedNote?.shorter());
              }
            }
          }}
        />
      </div>
    </Page>
  );
};

export default React.memo(Example);