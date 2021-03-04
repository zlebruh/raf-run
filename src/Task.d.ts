declare module 'raf-run/Task' {
  class Task {
    constructor(
      props: {
        action: Function;
        name?: String;
        times?: Number;
        timeout?: Number;
        interval?: Number;
      },
      historyProps: { size?: Number }
    );
    enable(): Task;
    disable(): Task;
    isReady(now: Number): Boolean;

    private _onTick(now: Number): void;
    private _markForDestroy(): Task;
    static spawnAction(fn: Function, instance: Task): Function;
  }
}
