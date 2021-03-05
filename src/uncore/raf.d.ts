declare module 'raf' {
  function getRAFFallback(heartbeat: Number): Function;
  export function getRAF(forceFallback: Boolean, heartbeat: Number): Function;
}
