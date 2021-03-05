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
```

## Dynamic tick rate
The default interval between each Runner tick is 1000 ms. Here is how to change it
```javascript
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
