import IcEmpty from './empty.svg';
import IcHome from './home.svg';
import IcMinus from './minus.svg';
import IcPause from './pause.svg';
import IcPlay from './play.svg';
import IcPlus from './plus.svg';
import IcRefresh from './refresh.svg';
import IcSong from './song.svg';
import IcZoomIn from './zoomin.svg';
import IcZoomOut from './zoomout.svg';

type t = {
  [index: string]: any;
  empty: any;
  home: any;
  refresh: any;
  plus: any;
  minus: any;
  song: any;
  play: any;
  pause: any;
  zoomin: any;
  zoomout: any;
}

const m: t = {
  empty: IcEmpty,
  home: IcHome,
  refresh: IcRefresh,
  plus: IcPlus,
  minus: IcMinus,
  song: IcSong,
  play: IcPlay,
  pause: IcPause,
  zoomin: IcZoomIn,
  zoomout: IcZoomOut,
};

export default m;