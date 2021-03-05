declare module 'raf-run' {
  export default class Runner {
    constructor(props: {
      heartbeat?: Number;
      keepAlive?: Boolean;
      historyRun?: { size?: Number };
      historyTask?: { size?: Number };
    });

    get running(): Boolean;

    has(name: String): Boolean;
    start(): Runner;
    stop(): Runner;

    add(params: {
      action: Function;
      name?: String;
      times?: Number;
      timeout?: Number;
      interval?: Number;
    }): Boolean;
    remove(name: String): Boolean;
    enableTask(name: String): Boolean;
    disableTask(name: String): Boolean;
    changeTaskInterval(name: String, val: Number): Boolean;

    private _tick(now?: Number): void;
    private _loop(): void;
    private _handeTabChange(): void;
    private _subscribe(): Boolean;
    private _changeRAF(forceFallback: Boolean): Function;
  }
}