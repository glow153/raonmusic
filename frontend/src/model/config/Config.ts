import { Key, Tempo, Time } from ".";
import { Pitch } from "../Pitch";

interface ConfigParam {
  tempo: Tempo;
  key: Key;
  time: Time;
  lang: string;
  lowestPitch: Pitch;
  highestPitch: Pitch;
}

export class Config {
  public tempo: Tempo;
  public key: Key;
  public time: Time;
  public lang: string;
  public lowestPitch: Pitch;
  public highestPitch: Pitch;

  constructor({tempo, key, time, lang, lowestPitch, highestPitch}: ConfigParam) {
    this.tempo = tempo;
    this.key = key;
    this.time = time;
    this.lang = lang;
    this.lowestPitch = lowestPitch ?? Pitch.fromCode(24); // C2
    this.highestPitch = highestPitch ?? Pitch.fromCode(36); // C3
  }

  // public fromJson(config: any) {
  //   return new Config(

  //   );
  // }
}