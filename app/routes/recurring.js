import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('list', {
      filter: {
        'list-type': 'recurring-task-day'
      },
      include: 'tasks'
    });
  }
});
