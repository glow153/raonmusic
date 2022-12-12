export {
  hasValue, isArray, isEmpty, isNumber, isString
} from './validation';

export const tryCall = function (fn?: Function, ...args: any[]) {
  return fn instanceof Function && fn.apply(this, args);
};