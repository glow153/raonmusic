import { dateObjToTimestamp } from "../util";

const timestamp = () => dateObjToTimestamp(undefined, 'YYYY-MM-DD HH:mm:ss.SSS');

export class Logger {
  moduleName: string;
  debugMode: boolean;

  constructor(moduleName: string, debugMode: boolean) {
    this.moduleName = moduleName;
    this.debugMode = debugMode;
  }

  static init(moduleName: string, debugMode: boolean = true) {
    return new Logger(moduleName, debugMode);
  }

  d (...s: any[]) {
    this.debugMode && console.log(timestamp(), `[${this.moduleName}]`, ...s);
  }
  w (...s: any[]) {
    this.debugMode && console.warn(`[${this.moduleName}]`, ...s);
  }
  e (...s: any[]) {
    console.error(`[${this.moduleName}]`, ...s);
  }
}
