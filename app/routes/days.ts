import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { parse } from 'date-fns';
import type PollerService from 'ember-todo/services/poller';
import type SelectedDateService from 'ember-todo/services/selected-date';
import type SessionService from 'ember-todo/services/session';
import type Transition from '@ember/routing/transition';

interface DaysRouteParams {
  date?: string;
}

export default class DaysRoute extends Route {
  @service declare poller: PollerService;
  @service declare selectedDate: SelectedDateService;
  @service declare session: SessionService;

  queryParams = {
    date: { refreshModel: true },
  };

  beforeModel(transition: Transition): Promise<void> {
    this.session.requireAuthentication(transition, 'login');
    return this.poller.stop();
  }

  model(params: DaysRouteParams): void {
    const date = params.date ? parse(params.date, 'yyyy-MM-dd', new Date()) : null;
    this.selectedDate.date = date;
    void this.poller.start();
  }

  @action deactivate() {
    void this.poller.stop();
  }
}
