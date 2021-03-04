import { isType } from 'zletils';
import { toObjectProps } from './uncore/utils';

// LOCAL
const { push } = Array.prototype;

class RunHistorySnapshot {
  constructor(stamp = 0, delta = 0) {
    const props = toObjectProps({ delta, stamp });
    Object.defineProperties(this, props);
  }
}

export default class RunHistory extends Array {
  constructor(props) {
    super();

    Object.defineProperties(this, {
      ...toObjectProps({ ...props, created: Date.now() }),
      ticks: { value: 0, writable: true },
    });
  }

  get last() {
    return this[this.length - 1] || new RunHistorySnapshot();
  }

  delta(now = Date.now()) {
    return now - this.last.stamp;
  }

  push(stamp) {
    if (!isType(stamp, 'Number')) return false;

    if (this.length >= this.size) this.shift();

    const diff = this.delta(stamp);
    const delta = stamp === diff ? 0 : diff;
    const snapshot = new RunHistorySnapshot(stamp, delta);
    push.call(this, snapshot);
    this.ticks += 1;

    return true;
  }
}
