import { typedProp, typedProps } from 'zletils';
import { validate } from 'json-valid-3k';
import { toObjectProps } from './uncore/utils';
import RunHistory from './RunHistory';
import { TaskSchema } from './uncore/schemas';

// Local
let COUNTER = 0;
const TASK = 'Task_';
const PREFIX = 'raf-run:';

function generateTaskName() {
  return `${TASK}_${++COUNTER}`;
}

export default class Task {
  constructor(props, historyProps) {
    const { valid, tree } = validate(props, TaskSchema, true);

    if (!valid) {
      this.FAILED = true;
      return null;
    }

    const { times, timeout, interval } = tree;
    typedProps({
      values: { times, timeout, interval, active: true},
      target: this,
    });

    const immutable = toObjectProps({
      name: tree.name || generateTaskName(),
      action: Task.spawnAction(tree.action, this),
      history: new RunHistory(historyProps),
    });
    Object.defineProperties(this, immutable);
  }

  // ########### Methods - Public
  enable() {
    this.active = true;
    return this;
  }

  disable() {
    this.active = false;
    return this;
  }

  isReady(now) {
    if (!this.active) return false;

    const { timeout, interval, history } = this;
    const checkDelay = history.ticks === 0 && timeout > 0;

    return checkDelay
      ? now - history.created > timeout
      : history.delta(now) > interval;
  }

  // ########### Methods - Private
  _onTick(now = 0) {
    const { times, history } = this;
    history.push(now);
    if (times && history.ticks >= times) this._markForDestroy();
  }

  _markForDestroy() {
    Object.defineProperty(this, 'destroy', { value: true });
    return this;
  }

  static spawnAction(fn, instance) {
    return (now) => {
      try {
        instance._onTick(now);
        fn(instance);
      } catch (err) {
        instance._markForDestroy();
        console.log(PREFIX, `Task "${instance.name}" failed and will be destroyed\n.`, err);
      }
    };
  }
}
