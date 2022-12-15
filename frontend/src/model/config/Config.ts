import { Key, Tempo, Time } from ".";
import { Pitch } from "../Pitch";

interface ConfigParam {
  tempo: Tempo;
  key: Key;
  time: Time;
  measures?: number;
  lang: string;
  lowestPitch?: Pitch;
  highestPitch?: Pitch;
}

export class Config {
  public tempo: Tempo;
  public key: Key;
  public time: Time;
  public measures: number;
  public lang: string;
  public lowestPitch: Pitch;
  public highestPitch: Pitch;

  constructor({tempo, key, time, measures, lang, lowestPitch, highestPitch}: ConfigParam) {
    this.tempo = tempo;
    this.key = key;
    this.time = time;
    this.measures = measures ?? 4;
    this.lang = lang;
    this.lowestPitch = lowestPitch ?? Pitch.fromCode(24); // C2
    this.highestPitch = highestPitch ?? Pitch.fromCode(36); // C3
  }

  public static fromJson(config: any) {
    return new Config({
      tempo: Tempo.fromJson(config.tempo),
      key: Key.fromJson(config.key),
      time: Time.fromJson(config.time),
      lang: config.lang
    });
  }

  public get obj() {
    return {
      tempo: this.tempo.obj,
      key: this.key.obj,
      time: this.time.obj,
      lang: this.lang
    };
  }
}