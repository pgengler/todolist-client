import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.query('list', {
      filter: {
        'list-type': 'recurring-task-day'
      },
      include: 'tasks',
      sort: 'sort-order'
    });
  }
});
