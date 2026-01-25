import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type Transition from '@ember/routing/transition';
import type RecurrenceRule from 'ember-todo/models/recurrence-rule';
import type SessionService from 'ember-todo/services/session';

export default class RecurringRoute extends Route {
  @service declare session: SessionService;
  @service declare store: Store;

  beforeModel(transition: Transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model(): Promise<RecurrenceRule[]> {
    return this.store.findAll<RecurrenceRule>('recurrence-rule');
  }
}
