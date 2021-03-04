interface HistoryProps {
  size?: Number;
}

declare module 'RunHistory' {
  class RunHistorySnapshot {
    constructor(stamp?: Number, delta?: Number);
  }

  export default class RunHistory extends Array {
    constructor(props: HistoryProps);
    get last(): Number|RunHistorySnapshot;
    delta(now?: Number): Number
    push(stamp: Number): Boolean|any;
  }
}
