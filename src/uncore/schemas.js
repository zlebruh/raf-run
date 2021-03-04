const HistorySchema = {
  type: 'Object',
  optional: true,
  props: {
    size: { type: 'Number', default: 10 },
  }
};

const boo = 'Boolean'

export const RunnerSchema = {
  heartbeat: { type: 'Number', default: 1000 },
  keepAlive: { type: 'Boolean', default: false },
  historyRun: HistorySchema,
  historyTask: HistorySchema,
};

export const TaskSchema = {
  action: 'Function',
  name: { type: 'String', optional: true },
  times: { type: 'Number', default: 0 },
  timeout: { type: 'Number', default: 0 },
  interval: { type: 'Number', default: 0 },
};
