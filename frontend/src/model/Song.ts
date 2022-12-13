import { Config } from "./config";
import { Riff } from "./Riff";

export class Song {
  public riff: Riff;
  public config: Config;

  constructor(riff: Riff, config: Config) {
    this.riff = riff;
    this.config = config;
  }
}