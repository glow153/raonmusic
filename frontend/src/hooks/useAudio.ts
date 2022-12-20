import { useEffect, useMemo, useState } from "react";

export const useAudio = (url?: string): ([boolean, () => void]) => {
  const audio = useMemo<HTMLAudioElement | undefined>(() => url ? new Audio(url) : undefined, [url]);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    console.log('[useAudio] audio:', audio, ', playing:', playing)
    audio ? (playing ? audio.play() : audio.pause()) : undefined;
  }, [playing]);

  useEffect(() => {
    audio?.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio?.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle];
};