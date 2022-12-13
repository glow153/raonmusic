import { Duration } from '../model/Duration';
import { Pitch } from '../model/Pitch';
import _durationCodes from './duration-codes.json';
import _pitchCodes from './pitch-codes.json';

export const pitchCodes = _pitchCodes.map(p => new Pitch(p));
export const durationCodes = _durationCodes.map(d => new Duration(d));
