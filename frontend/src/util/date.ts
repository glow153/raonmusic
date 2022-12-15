import moment from 'moment';
import 'moment/locale/ko';
moment.locale();

export const dateObjToStr = (dt: Date | undefined, format: string = 'YYYY-MM-DD'): string => {
  const dateObj = dt instanceof Date ? moment(dt) : moment(new Date());
  return dateObj.format(format);
};

export const dateObjToTimestamp = (dt: Date | undefined, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dateObjToStr(dt, format);
};