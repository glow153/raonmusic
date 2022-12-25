import { Key, Tempo, Time } from ".";
import { Pitch } from "../Pitch";

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
    this.lowestPitch = lowestPitch ?? Pitch.fromCode(24); // C2
    this.highestPitch = highestPitch ?? Pitch.fromCode(36); // C3
  }

  public static fromJson(config: any) {
    return new Config({
      lyric: config.lyric,
      tempo: Tempo.fromJson(config.tempo),
      measures: config.measures,
      key: Key.fromJson(config.key),
      time: Time.fromJson(config.time),
      lang: config.lang,
      lowestPitch: Pitch.fromCode(config['lowestPitch'] ?? 24),
      highestPitch: Pitch.fromCode(config['highestPitch'] ?? 36),
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