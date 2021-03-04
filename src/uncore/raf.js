function getRAFFallback() {
  return (callback) => {
    setTimeout(callback, min);
  };
}

export function getRAF(forceFallback) {
  if (forceFallback === true) {
    return getRAFFallback();
  }

  const GLOBAL = window || {};

  return GLOBAL.requestAnimationFrame
    || GLOBAL.oRequestAnimationFrame
    || GLOBAL.msRequestAnimationFrame
    || GLOBAL.mozRequestAnimationFrame
    || GLOBAL.webkitRequestAnimationFrame || getRAFFallback();
}

export function changeRAF(forceFallback) {
  RAF = getRAF(forceFallback);
  return RAF;
}
