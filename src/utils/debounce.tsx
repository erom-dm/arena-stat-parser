export const debounce = (func: Function, timeout: number = 500) => {
  let timer: NodeJS.Timeout | undefined;
  return (...args: any[]) => {
    if (!timer) {
      func.apply(this, args);
    }
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
};
