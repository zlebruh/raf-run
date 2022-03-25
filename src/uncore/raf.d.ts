declare module 'raf' {
  const GLOBAL: Object;
  function getRAFFallback(heartbeat: Number): Function;
  function getRAF(forceFallback: Boolean, heartbeat: Number): Function;
}
