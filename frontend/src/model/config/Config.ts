import { Key, Tempo, Time } from ".";

interface ConfigParam {
  tempo: Tempo;
  key: Key;
  time: Time;
  lang: string;
}

export class Config {
  public tempo: Tempo;
  public key: Key;
  public time: Time;
  public lang: string;

  constructor({tempo, key, time, lang}: ConfigParam) {
    this.tempo = tempo;
    this.key = key;
    this.time = time;
    this.lang = lang;
  }
}