import QueryString from 'qs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Params, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link, SelectedNote } from '../components/atoms';
import { CheckboxGroup, ConfigButton, IconButton, IconLabelButton } from '../components/molecules';
import { Board, InputSlider } from '../components/organisms';
import { AnimatedPage } from '../components/templates';
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

const splitLyric = (lyric?: string): (string[] | undefined) => {
  const splitted = lyric?.trim().replace(/ +/g, ' ').split('');
  if (splitted) {
    for (let i = 1; i < splitted.length; i++) {
      if (splitted[i] === ' ') {
        splitted.splice(i-1, 2, splitted[i-1]+splitted[i]);
      }
    }
  }
  return splitted;
};

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
    splitLyric(lyric)?.map((w: string, i: number) => {
      return new Note(i, w, Pitch.C2, Duration.Unit, i);
    })
  );
};

const adjustNotes = (notes: Note[]) => {
  for (let i = 0; i < notes.length - 1; i++) {
    const curr = notes[i];
    const next = notes[i + 1];

    // 1. reset index
    curr.index = i;

    // 2. calc diff and pull back notes
    if (curr.end + 1 > next.start) {
      const diff = curr.end - next.start + 1;
      next.start += diff;
    }
  }

  // 3. reset index of last note
  notes[notes.length - 1].index = notes.length - 1;
  return notes;
};

const Sheet = ({
  cellSize: _cellSize = 30,
}) => {
  const params = useParams();
  const location = useLocation();
  const _song = initSong(params, location);
  const [song, setSong] = useState<Song>(_song);
  const [notes, setNotes] = useState<Note[]>(_song.notes);
  const [config, setConfig] = useState<Config>(_song.config);
  const [selectedNote, selectNote] = useState<Note>();
  const [cellSize, setCellSize] = useState<number>(_cellSize);
  const [addNote, setAddNote] = useState<Note>();
  const [changedNote, setChangedNote] = useState<Note>();
  const [deleteNote, setDeleteNote] = useState<Note>();
  const selectedPitch = useMemo<Pitch | undefined>(() => selectedNote?.pitch, [selectedNote]);
  const selectedDuration = useMemo<Duration | undefined>(() => selectedNote?.duration, [selectedNote]);
  const language = useMemo<string>(() => config.lang ?? 'ko', [config]);
  const lowestPitch = useMemo<number>(() => config.lowestPitch.code, [config]);
  const highestPitch = useMemo<number>(() => config.highestPitch.code, [config]);
  
  const [isMusicLoading, setMusicLoading] = useState<boolean>();
  const [isMusicReady, setMusicReady] = useState<boolean>();
  const [audioUri, setAudioUri] = useState<string>();
  const audioSrc = useMemo<string | undefined>(() => audioUri ? (url + audioUri) : undefined, [audioUri]);
  const selectedNoteInputRef = useRef<HTMLInputElement>();
  const stageRef = useRef<any>();
  const [isPlaying, togglePlaying] = useAudio(audioSrc);

  const onClickRefresh = useCallback(() => {
    console.log('refresh');
    selectNote(undefined);
    setAddNote(undefined);
    setNotes([]);
    setNotes([..._song.notes]);
  }, [_song, notes]);

  const onClickAdd = useCallback(() => {
    if (selectedNote) {
      const newNote = selectedNote.copy();
      // newNote.start = newNote.end + 1;
      setAddNote(newNote);
    }
  }, [selectedNote]);

  const onClickRemove = useCallback(() => {
    if (selectedNote) {
      setDeleteNote(selectedNote);
    }
  }, [selectedNote, notes]);

  const onChangePitch = useCallback((evt: any) => {
    const val = parseInt(evt.target.value);
    if (selectedNote && isNumber(val)) {
      setChangedNote(selectedNote.setPitch(val));
    }
  }, [selectedNote]);

  const onWheelPitch = useCallback((evt: any) => {
    evt.stopPropagation();
    if (selectedNote) {
      if (evt.deltaY > 0 && selectedNote.pitch.code < highestPitch) {
        setChangedNote(selectedNote.higher());
      } else if (evt.deltaY < 0 && selectedNote.pitch.code > lowestPitch) {
        setChangedNote(selectedNote.lower());
      }
    }
  }, [selectedNote, highestPitch, lowestPitch]);

  const onChangeDuration = useCallback((evt: any) => {
    const val = parseInt(evt.target.value);
    if (selectedNote && isNumber(val)) {
      const newNote = selectedNote.setDuration(val);
      setChangedNote(newNote);
    }
  }, [selectedNote, notes]);
  
  const onWheelDuration = useCallback((evt: any) => {
    if (selectedNote) {
      if (evt.deltaY > 0 && selectedNote.duration.length < Duration.MAX) {
        setChangedNote(selectedNote.longer());
      } else if (evt.deltaY < 0 && selectedNote.duration.length > Duration.MIN) {
        setChangedNote(selectedNote.shorter());
      }
    }
  }, [selectedNote, notes]);

  const onClickGenerateMusic = useCallback(() => {
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
  }, [song]);

  const onZoomIn = useCallback(() => {
    setCellSize(cellSize + 10);
  }, [cellSize]);
  const onZoomOut = useCallback(() => {
    setCellSize(cellSize - 10);
  }, [cellSize]);
  

  // dhpark: USEEFFECT -----------------------------------------
  // 1. selecting note
  useEffect(() => {
    if (selectedNote) {
      notes.splice(selectedNote.index, 1, selectedNote);
      setNotes([...adjustNotes(notes)]);
      selectedNoteInputRef.current?.focus();
    }
  }, [selectedNote]);

  // 2. adding note
  useEffect(() => {
    if (addNote) {
      console.log('add Note:', addNote);
      notes.splice(addNote.index, 0, addNote);      
      selectNote(addNote);
      setAddNote(undefined);
    }
  }, [addNote]);

  // 3. changing note
  useEffect(() => {
    if (changedNote) {
      console.log('change Note:', changedNote);
      notes.splice(changedNote.index, 1, changedNote);      
      selectNote(changedNote);
      setChangedNote(undefined);
    }
  }, [changedNote]);

  useEffect(() => {
    if (deleteNote) {
      const index = notes.findIndex(n => n.equals(deleteNote));
      if (index >= 0) {
        notes.splice(index, 1);
      }
      selectNote(notes[index]);
      setDeleteNote(undefined);
    }
  }, [deleteNote]);

  useEffect(() => {
    console.log(notes);
    setSong(new Song(notes, config));
  }, [notes, config]);

  return (
    <AnimatedPage>
      <Topbar>
        <Link to='/'>
          <IconButton name='home' />
        </Link>
      </Topbar>
      
      <Section spaceBetween flexEnd>
        <NoteButtonGroup>
          <IconButton secondary name='refresh' onClick={onClickRefresh} />
          <IconButton secondary name='plus' onClick={onClickAdd} disabled={!selectedNote} />
          <IconButton secondary name='minus' onClick={onClickRemove} disabled={!selectedNote} />
          {/*
          <IconButton secondary name='zoomin' onClick={onZoomIn} />
          <IconButton secondary name='zoomout' onClick={onZoomOut} />
          */}
        </NoteButtonGroup>
        <SelectedNote
          inputRef={selectedNoteInputRef}
          language={language}
          note={selectedNote}
          onChange={(e) => {
            if (selectedNote) {
              selectNote(selectedNote.setPhoneme(e.target.value));
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
        notes={notes}
        config={config}
        stageRef={stageRef}
        cellSize={cellSize}
        selectedNote={selectedNote}
        selectNoteAction={selectNote}
        addNoteAction={setAddNote}
      />
      
      <Section marginTop={30} spaceBetween>
        <InputSlider id='pitchSlider' label='피치'
          min={lowestPitch} max={highestPitch} step={1}
          text={selectedPitch?.name ?? ''}
          value={selectedPitch?.code}
          disabled={selectedNote?.isRest || !selectedNote}
          onChange={onChangePitch}
          onMouseWheel={onWheelPitch}
        />
        <CheckboxGroup label='쉼표'
          isChecked={selectedNote?.isRest ?? false}
          onClick={(e) => {
            // console.log('on clicked checkbox:', e);
            selectNote(selectedNote?.toggleRest());
          }}
          onChange={(e) => {
            // console.log('on changed checkbox:', e.target.checked, ', e:', e);
          }}
        />
        <InputSlider id='durationSlider' label='길이'
          min={Duration.MIN} max={Duration.MAX} step={1}
          text={selectedDuration?.fraction ?? ''}
          value={selectedDuration?.length}
          disabled={!selectedNote}
          onChange={onChangeDuration}
          onMouseWheel={onWheelDuration}
        />
      </Section>

      <Section marginTop={30}>
        <IconLabelButton secondary
          name='song' label='노래 생성'
          iconBackground={Colors.primary}
          loading={isMusicLoading}
          onClick={onClickGenerateMusic}
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
    </AnimatedPage>
  );
};

export default React.memo(Sheet);