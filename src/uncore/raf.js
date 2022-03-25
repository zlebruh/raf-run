const getGlobal = () => {
  try {
    return window
  } catch(err) {
    return { setImmediate }
  }
}

const GLOBAL = getGlobal()

function getRAFFallback(heartbeat) {
  return callback => setTimeout(callback, heartbeat)
}

export function getRAF(forceFallback = false, heartbeat) {
  if (forceFallback === true) return getRAFFallback(heartbeat)

  return GLOBAL.requestAnimationFrame
    || GLOBAL.oRequestAnimationFrame
    || GLOBAL.msRequestAnimationFrame
    || GLOBAL.mozRequestAnimationFrame
    || GLOBAL.webkitRequestAnimationFrame
    || GLOBAL.setImmediate || getRAFFallback(heartbeat)
}
