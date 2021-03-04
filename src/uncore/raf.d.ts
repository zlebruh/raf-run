declare module 'raf' {
  function getRAFFallback(): Function;
  export function getRAF(forceFallback: Boolean): Function;
  export function changeRAF(forceFallback: Boolean): Function;
}
