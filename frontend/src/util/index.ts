export { dateObjToStr, dateObjToTimestamp } from './date';
export {
  hasValue, isArray, isEmpty, isNumber, isString
} from './validation';

export const tryCall = function (fn?: Function, ...args: any[]) {
  return fn instanceof Function && fn.apply(this, args);
};

export const seq = (count: number): number[] => Array.from(Array(count).keys());


export const spliceString = (str: string, start: number, delCount: number, newSubStr: number) => {
  return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
};