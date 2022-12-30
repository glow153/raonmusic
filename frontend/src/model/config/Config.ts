import { Key, Tempo, Time } from ".";
import { Pitch } from "../Pitch";

const DEFAULT_LOWEST_PITCH = 24;
const DEFAULT_HIGHEST_PITCH = 36;

interface ConfigParam {
  lyric?: string;
  tempo?: Tempo;
  key?: Key;
  time?: Time;
  measures?: number;
  lang?: string;
  lowestPitch?: Pitch;
  highestPitch?: Pitch;
}

export class Config {
  public lyric: string;
  public tempo: Tempo;
  public key: Key;
  public time: Time;
  public measures: number;
  public lang: string;
  public lowestPitch: Pitch;
  public highestPitch: Pitch;

  public get maxDuration() {
    return this.measures * this.time.lengthPerMeasure;
  }

  public get defaultDuration() {
    return this.time._lower;
  }

  constructor({
    lyric,
    tempo,
    key,
    time,
    measures,
    lang,
    lowestPitch,
    highestPitch
  }: ConfigParam = {}) {
    this.lyric = lyric ?? '';
    this.tempo = tempo ?? new Tempo();
    this.key = key ?? new Key();
    this.time = time ?? new Time();
    this.measures = measures ?? 4;
    this.lang = lang ?? 'ko';
    this.lowestPitch = lowestPitch ?? Pitch.fromCode(DEFAULT_LOWEST_PITCH); // C2
    this.highestPitch = highestPitch ?? Pitch.fromCode(DEFAULT_HIGHEST_PITCH); // C3
  }

  public static fromJson(config: any) {
    return new Config({
      lyric: config.lyric,
      tempo: Tempo.fromJson(config.tempo),
      measures: config.measures,
      key: Key.fromJson(config.key),
      time: Time.fromJson(config.time),
      lang: config.lang,
      lowestPitch: Pitch.fromCode(config['lowestPitch'] ?? DEFAULT_LOWEST_PITCH),
      highestPitch: Pitch.fromCode(config['highestPitch'] ?? DEFAULT_HIGHEST_PITCH),
    });
  }

  public get obj(): any {
    return {
      lyric: this.lyric,
      tempo: this.tempo.obj,
      key: this.key.obj,
      time: this.time.obj,
      lang: this.lang
    };
  }
}