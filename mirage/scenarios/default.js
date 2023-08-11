export default function (server) {
  let otherList = server.create('list', 'asExpanded', { name: 'Other', listType: 'list' });
  server.create('task', {
    list: otherList,
  });
  server.create('list', 'asCollapsed', {
    name: 'Collapsed list',
  });
  server.create('list', 'asCollapsed', {
    name: '2nd collapsed list',
  });

  server.create('task', 'withDayList', {
    description: 'Task with notes',
    notes: 'These are some notes',
  });

  let yesterdayList = server.create('list', 'yesterday');
  server.create('task', {
    list: yesterdayList,
    dueDate: yesterdayList.name,
  });

  server.create('list', 'recurringDay', { name: 'Sunday' });
  server.create('list', 'recurringDay', { name: 'Monday' });
  server.create('list', 'recurringDay', { name: 'Tuesday' });
  server.create('list', 'recurringDay', { name: 'Wednesday' });
  server.create('list', 'recurringDay', { name: 'Thursday' });
  server.create('list', 'recurringDay', { name: 'Friday' });
  server.create('list', 'recurringDay', { name: 'Saturday' });
}
