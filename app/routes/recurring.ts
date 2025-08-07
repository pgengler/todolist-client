import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/services/session';
import type Store from '@ember-data/store';
import type Transition from '@ember/routing/transition';
import type List from 'ember-todo/models/list';

export default class RecurringRoute extends Route {
  @service declare session: SessionService;
  @service declare store: Store;

  beforeModel(transition: Transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model(): Promise<List[]> {
    return <Promise<List[]>>this.store.query('list', {
      filter: {
        'list-type': 'recurring-task-day',
      },
      include: 'tasks',
      sort: 'sort-order',
    });
  }
}
