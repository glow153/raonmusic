import IcHome from './home.svg';
import IcMinus from './minus.svg';
import IcPause from './pause.svg';
import IcPlay from './play.svg';
import IcPlus from './plus.svg';
import IcRefresh from './refresh.svg';
import IcSong from './song.svg';

type t = {
  [index: string]: any;
  home: any;
  refresh: any;
  plus: any;
  minus: any;
  song: any;
  play: any;
  pause: any;
}

const m: t = {
  home: IcHome,
  refresh: IcRefresh,
  plus: IcPlus,
  minus: IcMinus,
  song: IcSong,
  play: IcPlay,
  pause: IcPause,
};

export default m;