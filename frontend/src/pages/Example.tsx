import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Link, SelectedNote } from '../components/atoms';
import { CheckboxGroup, IconButton, IconLabelButton } from '../components/molecules';
import { Board, InputSlider } from '../components/organisms';
import { Page } from '../components/templates';
import { Colors } from '../constants/color';
import _song_example_cn from '../constants/song-example-cn.json';
import _song_example_ko from '../constants/song-example-ko.json';
import { Config } from '../model/config';
import { Duration } from '../model/Duration';
import { Note } from '../model/Note';
import { Pitch } from '../model/Pitch';
import { Song } from '../model/Song';
import { isNumber } from '../util';

const backendUrl = 'http://192.168.0.201:11300/generate';

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


const Example = () => {
  const params = useParams();
  const initSong = Song.fromJson(params['lang'] ? (params['lang'] === 'ko' ? _song_example_ko : _song_example_cn) : undefined);
  const [song, setSong] = useState<Song>(initSong);
  const [notes, setNotes] = useState<Note[]>(initSong.notes);
  const [config, setConfig] = useState<Config>(initSong.config);
  const [selectedNote, setSelectedNote] = useState<Note>();
  const [isMusicLoading, setMusicLoading] = useState<boolean>();
  const [isMusicReady, setMusicReady] = useState<boolean>();
  const selectedPitch = useMemo<Pitch | undefined>(() => selectedNote?.pitch, [selectedNote]);
  const selectedDuration = useMemo<Duration | undefined>(() => selectedNote?.duration, [selectedNote]);
  const stageRef = useRef<any>();
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [config]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [config]);

  const onClickRefresh = useCallback(() => {
    console.log('refresh');
  }, []);

  useEffect(() => {
    console.log('useParams:', params);
  }, []);

  useEffect(() => {
    console.log('selectedNote:', selectedNote);
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
    console.log('song:', song);
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
          <IconButton secondary name='refresh' disabled onClick={onClickRefresh} />
          <IconButton secondary name='plus' disabled />
          <IconButton secondary name='minus' disabled />
        </NoteButtonGroup>
        <SelectedNote word={selectedNote?.phoneme} />
        <ConfigButtonGroup>
          <ConfigButton gray>
            <span className='title'>{config.tempo.count}</span>
            <span className='subtitle'>BPM</span>
          </ConfigButton>
          <ConfigButton gray>
            <span className='title'>{config.key.toString()}</span>
            <span className='subtitle'>{config.key.tone}</span>
          </ConfigButton>
          <ConfigButton gray>
            <span className='title'>{`${config.time.upper}/${config.time.lower}`}</span>
            <span className='subtitle'>TIME</span>
          </ConfigButton>
        </ConfigButtonGroup>
      </div>
      
      <Board
        song={song}
        stageRef={stageRef}
        onSelectNote={(note) => {
          setSelectedNote(note);
        }}
      />
      
      <div style={{display: 'flex', marginTop: 30, justifyContent: 'space-between'}}>
        <InputSlider id='pitchSlider' label='피치'
          min={lowestPitch} max={highestPitch} step={1}
          sliderWidth={280}
          text={selectedPitch?.name ?? ''}
          value={selectedPitch?.code}
          disabled={selectedNote?.isRest}
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

        <CheckboxGroup label='쉼표' isChecked={selectedNote?.isRest ?? false} onChange={()=>{}} />

        <InputSlider id='durationSlider' label='길이'
          min={Duration.MIN} max={Duration.MAX} step={1}
          sliderWidth={280}
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
      <div style={{display: 'flex', marginTop: 30, justifyContent: 'center'}}>
        <IconLabelButton secondary
          name='song' label='노래 생성'
          iconBackground={Colors.primary}
          loading={isMusicLoading}
          onClick={() => {
            setMusicLoading(!isMusicLoading);
            console.log(song.toJson());
            fetch(backendUrl, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: song.toJson()
            })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              if (res.result === 'true' && res.song) {
                setMusicLoading(false);
                setMusicReady(true);
              }
            });
          }}
        />
        {isMusicReady ? (
          <IconLabelButton lightgreen
            name='play' label='노래 생성'
            iconBackground={Colors.green}
            style={{marginLeft: 114}}
            onClick={() => {
              
            }}
          />
        ) : null}
      </div>
    </Page>
  );
};

export default React.memo(Example);