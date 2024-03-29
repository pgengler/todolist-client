import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RecurringRoute extends Route {
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return this.store.query('list', {
      filter: {
        'list-type': 'recurring-task-day',
      },
      include: 'tasks',
      sort: 'sort-order',
    });
  }
}
