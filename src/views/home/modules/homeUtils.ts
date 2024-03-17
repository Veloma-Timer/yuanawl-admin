export const setValues = (obj: any, key: string) => {
  return Object.values(obj).map((item: any) => {
    return item[key];
  });
};
