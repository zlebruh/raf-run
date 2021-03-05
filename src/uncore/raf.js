function getRAFFallback(heartbeat) {
  return (callback) => {
    setTimeout(callback, heartbeat);
  };
}

export function getRAF(forceFallback = false, heartbeat) {
  if (forceFallback === true) {
    return getRAFFallback(heartbeat);
  }

  const GLOBAL = window || {};

  return GLOBAL.requestAnimationFrame
    || GLOBAL.oRequestAnimationFrame
    || GLOBAL.msRequestAnimationFrame
    || GLOBAL.mozRequestAnimationFrame
    || GLOBAL.webkitRequestAnimationFrame || getRAFFallback(heartbeat);
}
