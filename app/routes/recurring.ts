import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type Transition from '@ember/routing/transition';
import type List from 'ember-todo/models/list';
import type SessionService from 'ember-todo/services/session';

export default class RecurringRoute extends Route {
  @service declare session: SessionService;
  @service declare store: Store;

  beforeModel(transition: Transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model(): Promise<List[]> {
    return this.store.query<List>('list', {
      filter: {
        'list-type': 'recurring-task-day',
      },
      include: ['tasks'],
      sort: 'sort-order',
    });
  }
}
