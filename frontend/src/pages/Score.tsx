import QueryString from 'qs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Params, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link, SelectedNote } from '../components/atoms';
import { CheckboxGroup, ConfigButton, IconButton, IconLabelButton } from '../components/molecules';
import { Board, InputSlider } from '../components/organisms';
import { Page } from '../components/templates';
import { Colors } from '../constants/color';
import _song_example_cn2 from '../constants/song-example-cn-2.json';
import _song_example_cn from '../constants/song-example-cn.json';
import _song_example_ko2 from '../constants/song-example-ko-2.json';
import _song_example_ko3 from '../constants/song-example-ko-3.json';
import _song_example_ko from '../constants/song-example-ko.json';
import { useAudio } from '../hooks';
import { Config, Tone } from '../model/config';
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

interface SectionProp {
  marginTop?: number;
  spaceBetween?: boolean;
  flexEnd?: boolean;
}
const Section = styled.section<SectionProp>`
  display: flex;
  justify-content: ${p => p.spaceBetween ? 'space-between' : 'center'};
  align-items: ${p => p.flexEnd ? 'flex-end' : ''};
  ${p => p.marginTop ? `margin-top: ${p.marginTop}px` : ''}
`;



const initSong = (param: Params<string>, location: any) => {
  const lang = param.lang;
  const lyric: any = QueryString.parse(location.search, {ignoreQueryPrefix: true})?.lyric;
  return lang ? Song.fromJson(
    lang === 'ko' ? _song_example_ko
    : lang === 'ko2' ? _song_example_ko2
    : lang === 'ko3' ? _song_example_ko3
    : lang === 'cn' ? _song_example_cn
    : lang === 'cn2' ? _song_example_cn2
    : undefined
  ) : new Song(
    lyric?.replace(/ /g, '').split('').map((w: string, i: number) => {
      return new Note(i, w, Pitch.C2, Duration.Unit, i);
    })
  );
}

const Score = () => {
  const params = useParams();
  const location = useLocation();
  const _song = initSong(params, location);
  const [song, setSong] = useState<Song>(_song);
  const [notes, setNotes] = useState<Note[]>([..._song.notes]);
  const [config, setConfig] = useState<Config>(_song.config);
  const [selectedNote, setSelectedNote] = useState<Note>();
  const [addNote, setAddNote] = useState<Note>();

  const [durationOfLastSelectedNote, setDurationOfLastSelectedNote] = useState<number>();
  const selectedNoteIndex = useMemo<number | undefined>(() => selectedNote?.index, [selectedNote]);
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
    setSelectedNote(undefined);
    setNotes([]);
    setNotes([..._song.notes]);
  }, []);
  const onClickAdd = useCallback(() => {
    if (selectedNote) {
      setAddNote(selectedNote.copy());
    }
  }, [selectedNote]);
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
  const onChangePitch = useCallback((evt: any) => {
    const val = parseInt(evt.target.value);
    if (isNumber(val)) {
      setSelectedNote(selectedNote?.setPitch(val));
    }
  }, [selectedNote]);
  const onWheelPitch = useCallback((evt: any) => {
    evt.stopPropagation();
    if (selectedNote) {
      if (evt.deltaY > 0 && selectedNote.pitch.code < highestPitch) {
        setSelectedNote(selectedNote?.higher());
      } else if (evt.deltaY < 0 && selectedNote.pitch.code > lowestPitch) {
        setSelectedNote(selectedNote?.lower());
      }
    }
  }, [selectedNote, highestPitch, lowestPitch]);
  const onChangeDuration = useCallback((evt: any) => {
    const val = parseInt(evt.target.value);
    if (selectedNote && isNumber(val)) {
      const newNote = selectedNote.setDuration(val);
      const diff = newNote.duration.length - selectedNote.duration.length;
      for (let i = newNote.index + 1; i < notes.length; i++) {
        notes[i].start += diff;
      }
      setSelectedNote(newNote);
    }
  }, [selectedNote, notes]);
  const onWheelDuration = useCallback((evt: any) => {
    evt.stopPropagation();
    if (selectedNote) {
      let newNote;
      if (evt.deltaY > 0 && selectedNote.duration.length < Duration.MAX) {
        newNote = selectedNote.longer();
      } else if (evt.deltaY < 0 && selectedNote.duration.length > Duration.MIN) {
        newNote = selectedNote.shorter();
      }
      if (newNote) {
        const diff = newNote.duration.length - selectedNote.duration.length;
        for (let i = newNote.index + 1; i < notes.length; i++) {
          notes[i].start += diff;
        }
        setSelectedNote(newNote);
      }
    }
  }, [selectedNote, notes]);


  // dhpark: USEEFFECT -----------------------------------------
  useEffect(() => {
    if (selectedNote) {
      notes.splice(selectedNote.index, 1, selectedNote);
      setNotes([...notes]);
    }
  }, [selectedNote]);

  useEffect(() => {
    if (addNote) {
      const index = addNote.index;
      notes.splice(index, 0, addNote);
      for (let i = index + 1; i < notes.length; i++) {
        notes[i].index = i;
        notes[i].start += addNote.duration.length;
      }
      setAddNote(undefined);
    }
  }, [addNote]);

  useEffect(() => {
    setSong(new Song(notes, config));
  }, [notes, config]);

  return (
    <Page>
      <Topbar>
        <Link to='/'>
          <IconButton name='home' />
        </Link>
      </Topbar>
      
      <Section spaceBetween flexEnd>
        <NoteButtonGroup>
          <IconButton secondary name='refresh' onClick={onClickRefresh} />
          <IconButton secondary name='plus' onClick={onClickAdd} />
          <IconButton secondary name='minus' onClick={onClickRemove} />
          <IconButton secondary name='song' onClick={() => {
            console.log(notes)
          }} />
        </NoteButtonGroup>
        <SelectedNote language={language}
          note={selectedNote}
          onChange={(e) => {
            if (selectedNote) {
              setSelectedNote(selectedNote.setPhoneme(e.target.value));
            }
          }}
          readonly={!selectedNote || (selectedNote.isRest ?? false)}
        />
        <ConfigButtonGroup>
          <ConfigButton gray>
            <span className='title'>{config.tempo.count}</span>
            <span className='subtitle'>BPM</span>
          </ConfigButton>
          <ConfigButton gray>
            <span className='title'>{config.measures}</span>
            <span className='subtitle'>MEASURES</span>
          </ConfigButton>
          <ConfigButton gray>
            <span className='title'>{`${config.key}${config.key._tone === Tone.MINOR ? 'm' : ''}`}</span>
            <span className='subtitle'>KEY</span>
          </ConfigButton>
          <ConfigButton gray>
            <span className='title'>{`${config.time.upper}/${config.time.lower}`}</span>
            <span className='subtitle'>TIME</span>
          </ConfigButton>
        </ConfigButtonGroup>
      </Section>
      
      <Board
        song={song}
        stageRef={stageRef}
        onSelectNote={(note) => {
          setSelectedNote(note);
        }}
      />
      
      <Section marginTop={30} spaceBetween>
        <InputSlider id='pitchSlider' label='피치'
          min={lowestPitch} max={highestPitch} step={1}
          text={selectedPitch?.name ?? ''}
          value={selectedPitch?.code}
          disabled={selectedNote?.isRest}
          onChange={onChangePitch}
          onMouseWheel={onWheelPitch}
        />
        <CheckboxGroup label='쉼표'
          isChecked={selectedNote?.isRest ?? false}
          onClick={(e) => {
            console.log('on clicked checkbox:', e);
            setSelectedNote(selectedNote?.toggleRest());
          }}
          onChange={(e)=>{
            console.log('on changed checkbox:', e.target.checked, ', e:', e);
          }}
        />
        <InputSlider id='durationSlider' label='길이'
          min={Duration.MIN} max={Duration.MAX} step={1}
          text={selectedDuration?.fraction ?? ''}
          value={selectedDuration?.length}
          onChange={onChangeDuration}
          onMouseWheel={onWheelDuration}
        />
      </Section>

      <Section marginTop={30}>
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
              console.error(e);
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
      </Section>
    </Page>
  );
};

export default React.memo(Score);