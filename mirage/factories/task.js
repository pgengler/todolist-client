import { Factory, trait } from 'miragejs';

export default Factory.extend({
  done: false,
  description: (i) => `Task ${i}`,

  withDayList: trait({
    afterCreate(task, server) {
      if (task.listId) return;

      server.create('list', 'day', {
        tasks: [task],
      });
    },
  }),
});
