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
import { useAudio } from '../hooks';
import { Config } from '../model/config';
import { Duration } from '../model/Duration';
import { Note } from '../model/Note';
import { Pitch } from '../model/Pitch';
import { Song } from '../model/Song';
import { isNumber, isString } from '../util';

const url = 'https://api.svs.raondata.ai'
const generateEndpoint = '/generate';
const generateUrl = url + generateEndpoint;

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
  const {lang} = useParams();
  const initSong = Song.fromJson(
    lang === 'ko' ? _song_example_ko
    : lang === 'cn' ? _song_example_cn
    : undefined
  );
  const [song, setSong] = useState<Song>(initSong);
  const [notes, setNotes] = useState<Note[]>(initSong.notes);
  const [config, setConfig] = useState<Config>(initSong.config);
  const [selectedNote, setSelectedNote] = useState<Note>();
  const [isMusicLoading, setMusicLoading] = useState<boolean>();
  const [isMusicReady, setMusicReady] = useState<boolean>();
  const [audioUri, setAudioUri] = useState<string>();
  const selectedPitch = useMemo<Pitch | undefined>(() => selectedNote?.pitch, [selectedNote]);
  const selectedDuration = useMemo<Duration | undefined>(() => selectedNote?.duration, [selectedNote]);
  const stageRef = useRef<any>();
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [config]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [config]);
  const language = useMemo<string>(() => config.lang ?? 'ko', [config]);
  const audioSrc = useMemo<string | undefined>(() => audioUri ? (url + audioUri) : undefined, [audioUri]);
  const [isPlaying, togglePlaying] = useAudio(audioSrc);

  const onClickRefresh = useCallback(() => {
    console.log('refresh');
    setNotes([]);
    setNotes(initSong.notes);
    setSelectedNote(undefined);
  }, []);
  const onClickAdd = useCallback(() => {
    if (selectedNote) {
      const index = selectedNote.index
      const newNote = selectedNote.copy();      
      notes.splice(index, 0, newNote);
      for (let i = index; i < notes.length; i++) {
        notes[i].index = i;
      }
      setSelectedNote(newNote);
    }
  }, [selectedNote, notes]);
  const onClickRemove = useCallback(() => {
    if (selectedNote) {
      const index = selectedNote.index
      notes.splice(index, 1);
      for (let i = index; i < notes.length; i++) {
        notes[i].index = i;
      }
      setSelectedNote(notes[index]);
    }
  }, [selectedNote, notes]);

  useEffect(() => {
    if (selectedNote) {
      notes.splice(selectedNote?.index, 1, selectedNote); // dhpark: replace selected note
      setNotes([...notes]);
    }
  }, [selectedNote]);

  useEffect(() => {
    setSong(new Song(notes, config));
  }, [notes, config]);

  useEffect(() => {
    // TODO: refresh board
    // console.log('song:', song);
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
          <IconButton secondary name='plus' onClick={onClickAdd} />
          <IconButton secondary name='minus' onClick={onClickRemove} />
        </NoteButtonGroup>
        <SelectedNote word={selectedNote?.phoneme} language={language} />
        <ConfigButtonGroup>
          <ConfigButton gray>
            <span className='title'>{config.tempo.count}</span>
            <span className='subtitle'>BPM</span>
          </ConfigButton>
          <ConfigButton gray>
            <span className='title'>{config.measures}</span>
            <span className='subtitle'>Measures</span>
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

            fetch(generateUrl, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
              },
              body: song.toJson()
            })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              if (res.result === 'true' && isString(res.song)) {
                setAudioUri(res.song);
                setMusicLoading(false);
                setMusicReady(true);
              }
            })
            .catch((e) => {
              setAudioUri(undefined);
              setMusicLoading(false);
              setMusicReady(false);
            });
          }}
        />

        {isMusicReady ? (
          <IconLabelButton lightgreen
            name={isPlaying ? 'pause' : 'play'} label={isPlaying ? '노래 일시정지' : '노래 듣기'}
            iconBackground={Colors.green}
            style={{marginLeft: 114}}
            onClick={() => {
              console.log('audioSrc:', audioSrc);
              console.log('isPlaying:', isPlaying);
              togglePlaying();
            }}
          />
        ) : null}
      </div>
    </Page>
  );
};

export default React.memo(Example);