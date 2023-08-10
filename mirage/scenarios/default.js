export default function (server) {
  let otherList = server.create('list', { name: 'Other', listType: 'list' });
  server.create('task', {
    list: otherList,
  });

  server.create('task', 'withDayList', {
    description: 'Task with notes',
    notes: 'These are some notes',
  });

  let yesterdayList = server.create('list', 'yesterday');
  server.create('task', {
    list: yesterdayList,
  });
}
