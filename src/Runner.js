import { typedProp } from 'zletils';
import { validate } from 'json-valid-3k';
import { getRAF } from './uncore/raf';
import Task from './Task.js';
import RunHistory from './RunHistory';
import { toObjectProps } from './uncore/utils';

import { RunnerSchema } from './uncore/schemas';

// Local stuff
let running = false;
let RAF = getRAF(false, 1000); // eslint-disable-line

export default class Runner {
  constructor(props = null) {
    const { valid, tree } = validate(props, RunnerSchema, true);

    if (!valid) throw TypeError('raf-run: Could not spawn due to bad params');

    // All instance properties are unmutable OR getters/setters
    const objProps = toObjectProps({
      loop: this._loop.bind(this),
      items: Object.create(null),
      history: new RunHistory(tree.historyRun),
      keepAlive: tree.keepAlive,
      onTabChange: this._handeTabChange.bind(this),
      _initProps: tree,
    });
    Object.defineProperties(this, {
      ...objProps,
      heartbeat: typedProp(tree.heartbeat),
    });

    // The method skips subscribtions on keepAlive: false
    this._subscribe();

    this._changeRAF();
  }

  // ########### Getters ###########
  get running() {
    return running;
  }

  // ########### Methods - Public
  has(name = '') {
    return this.items[name] instanceof Task;
  }

  start() {
    if (!running) {
      running = true;
      RAF(this.loop);
    }

    return this;
  }

  stop() {
    running = false;
    return this;
  }

  add(params = {}) {
    try {
      const task = new Task(params, this._initProps.historyTask);
      const { name } = task;

      if (this.has(name)) throw new Error(`There is already a task "${name}"`)

      if (task.FAILED !== true) {
        this.items[name] = task;
        return true;
      }
    } catch (err) {
      console.error(err);
    }

    return false;
  }

  remove(name = '') {
    return this.has(name) && delete this.items[name];
  }

  enableTask(name = '') {
    try {
      return this.items[name].enable().active;
    } catch (err) {
      console.warn(err);
    }
    return false;
  }

  disableTask(name = '') {
    try {
      return this.items[name].disable().active === false;
    } catch (err) {
      console.warn(err);
    }
    return false;
  }

  changeTaskInterval(name, val) {
    try {
      const task = this.items[name];
      task.interval = val;
      return task.interval === val;
    } catch (err) {
      console.warn(err);
    }
    return false;
  }

  // ########### Methods - Private
  _tick(now = Date.now()) {
    let taskName = '';
    try {
      if (running) {
        const { items } = this;
        Object.keys(items).forEach((name) => {
          if (this.has(name)) {
            taskName = name;
            const task = items[name];
            if (task.isReady(now)) task.action(now);
            if (task.destroy === true) this.remove(name);
          }
        });
      }
    } catch (err) {
      console.error('raf-run:', err);
      this.remove(taskName);
    }
  }

  _loop() {
    if (!running) return;

    const now = Date.now();
    const { history } = this;

    if (history.delta(now) > this.heartbeat) {
      this._tick(now);
      history.push(now);
    }

    RAF(this.loop);
  }

  _handeTabChange() {
    this._changeRAF(document.hidden);
    this._loop();
  }

  _subscribe() {
    if (this.keepAlive === false) return false
    document.addEventListener('visibilitychange', this.onTabChange);
    return true;
  }

  _changeRAF(forceFallback) {
    RAF = getRAF(forceFallback, this.heartbeat);
    return RAF;
  }
}
