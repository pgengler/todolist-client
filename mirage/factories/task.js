import { Factory, trait } from 'miragejs';

export default Factory.extend({
  done: false,
  description: (i) => `Task ${i}`,

  withDayList: trait({
    afterCreate(task, server) {
      if (task.listId) return;

      let list = server.schema.lists.where({ listType: 'day' }).models[0];
      if (!list) {
        list = server.create('list', 'today');
      }

      task.update({ list });
    },
  }),
});
