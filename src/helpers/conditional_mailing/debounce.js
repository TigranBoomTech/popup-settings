export const timerQue = {};

export const debounce = (id, callback, dilay) => {
  if (timerQue[id]) clearTimeout(timerQue[id]);
  timerQue[id] = setTimeout(callback, dilay);
};
