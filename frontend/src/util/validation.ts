export const hasValue = (v: any): boolean => {
  return v !== null && v !== undefined;
};

export const isEmpty = (v: any): boolean => {
  return !hasValue(v);
};

export const isString = (s: any): boolean => {
  return typeof s === 'string' || s instanceof String;
};

export const isNumber = (n: any): boolean => {
  return n !== undefined && typeof n === 'number';
};

export const isArray = (a: any): boolean => {
  return Array.isArray(a);
};
