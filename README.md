# raf-run
requestAnimationFrame based muilti-task runner and handy a setTimeout/setInterval replacement

<hr />

## Simple usage
```javascript
import Runner from 'raf-run';

const runner = new Runner({ heartbeat: 250 }).start();

// Add a task
function action(task) {
  console.log(`${task.name} TASK:`, task.history.last);
}
runner.add({
  action,         // Required
  name: 'AAA',    // Optional, defaults to auto generated
  times: 5,       // Optional, defaults to infinite
  timeout: 3000,  // Optional, defaults to 0
  interval: 1000, // Optional, defaults to 0
});

// in the console, 3 seconds later...
// AAA TASK: RunHistorySnapshot {delta: 0, stamp: 1614875522153}
// AAA TASK: RunHistorySnapshot {delta: 1017, stamp: 1614875523170}
// AAA TASK: RunHistorySnapshot {delta: 1017, stamp: 1614875524187}
// AAA TASK: RunHistorySnapshot {delta: 1015, stamp: 1614875525202}
// AAA TASK: RunHistorySnapshot {delta: 1001, stamp: 1614875526203}
```

## Runner params in TypeScript format
```typescript
interface RunnerParams {
  heartbeat?: Number;
  keepAlive?: Boolean;
  historyRun?: {size?: Number};
  historyTask?: {size?: Number};
}
```

## Runner params explanation
```javascript
import Runner from 'raf-run';

const runner = new Runner({
  // This is how often tasks are evaluated.
  // A task cannot be executed faster than this global interval
  heartbeat: 250, // Optional, defaults to 1000 (ms)

  // requestAnimationFrame based means...
  // navigating to another tab stops the execution.
  // Use "true" if you need your tasks to run in the background
  keepAlive: true, // Optional, defaults to false

  // Runner history props for stats such as time deltas and stamps
  historyRun: { // Optional
    size: 35,   // Optional, history snapshot buffer size, defaults to 10
  },

  // Runner history props for stats such as time deltas and stamps
  historyTask: { // Optional
    size: 55,    // Optional, history snapshot buffer size, defaults to 10
  },
}).start();
```

## Runner management
```javascript
runner.stop();
runner.start();
runner.heartbeat = 3000; // The setter only accepts Number
```

## Task management
```javascript
import Runner from 'raf-run';

const runner = new Runner({ heartbeat: 250 }).start();

// Add a task
function action(task) {
  console.log(`${task.name} TASK:`, task.history.last);
}
runner.add({
  action: () => console.warn('Boo hoo'),
  name: 'BBB',
  times: 15,
});

// Pause the task
runner.disableTask('BBB');

// Resume the task
runner.enableTask('BBB');

// Change how often a task runs
// Again, this value cannot be lower than the global "every"
runner.changeTaskInterval('BBB', 3000);

// Change it again
runner.changeTaskInterval('BBB', 300);

// Remove the task manually
runner.remove('BBB');
```
<br>

## Task params in TypeScript format
```typescript
interface TaskParams {
  action: Function;
  name?: String;
  times?: Number;
  timeout?: Number;
  interval?: Number;
}
```
<br>

## Managing tasks directly - **not recommended**
Having references might be a really bad idea.
Complete tasks are removed from the list.<br>
If you keep reference to a task that has been destroyed (or failed)<br>
are caching garbage with
```javascript
const task_a = runner.items['AAA_'];

// Enable / disable task
task_a.enable();
task_a.disable();

// Change task interval.
// Only applies to the ones that have this property in the first place.
// If confused, look at "Adding tasks" again.
task_a.interval = 3000; // Task is now being executed every 3 seconds
task_a.interval = 300; // Task is now being executed every 300 ms
```

## Continue reading if this works for you.

<hr />

## Purpose
With `raf-run` you can easily **add/pause/remove** tasks that have the combined characteristics of *setInterval* and *setTimeout*, plus the ability to scale your global operation, including individual tasks, on demand.

That means you can ***change*** you **global** and **task-level** intervals at any point time

Say, you're working with canvas/svg animations and you want to update/animate an arbitrary amount of things. But what if you need to speed up or slow down each update based on demand, user focus, or something else? You can do that.

Or you're working on a web game. Nothing easier than adding your draw operations to `raf-run`. Wanna change the maximum frame? Yes, you can. Want to have a diffrent frame rate for your main screen and your mini map? Duh, it's just another task. And since `raf-run` is **requestAnimationFrame** based, you can be sure your game will not eat resources when the tab is not active.

## Features - Runner
  ### start/stop
  - Ability to **start** or **stop** the Runner at any point in time
  - If stopped, all execution is suspended. No more timers!
  - When started again, tasks that have missed their time window will be executed immediatelly. Business as usual.

  ### internal tick rate
  - By default, the tick rate is now set to 0ms
  - This means `raf-run` is checking for tasks to run every quarter of a second.
  - You may increase or decrease this value according to your needs.
  - I have found that 250ms is the sweet spot that doesn't affect in a meaningful way even low power devices such as phones and embedded systems.
  - However, that's nowhere near enough for high performance tasks such as games, graph updates, animations, etc. Choose wisely based on your needs, cycles are not always free.
  - **NOTE**: increasing the time between each `raf-run` tick will have an effect on recurring tasks that execute faster. Individual tasks cannot override this behaviour

## Features - Task
  ### enable/disable
  - You can **enable** or **disable** any task at any given time.
  - If a task has missed its time window will be executed while being disabled, it will be executed on first opportunity when enabled again. Business as usual.
  ### change interval time in real time
  - Recurring tasks can have their interval changed at any point in time
  - Say you want to increace/decrease the max FPS of your canvas animation based on some changing conditions
  - **NOTE**: Recurring tasks cannot execute more often than the `raf-run` instance itself.
  - Just edit the code if it's not doing what you want.

## Dynamic tick rate
The default interval between each Runner tick is 0.

### Here is how to change it
```javascript
runner.heartbeat = 3000; // The setter only accepts Number
```
